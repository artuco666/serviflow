from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/jobs", tags=["jobs"])


def _get_owned_client(db: Session, client_id: int, company_id: int) -> models.Client:
    client = (
        db.query(models.Client)
        .filter(models.Client.id == client_id, models.Client.company_id == company_id)
        .first()
    )
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return client


@router.get("", response_model=List[schemas.JobOut])
def list_jobs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Job)
        .filter(models.Job.company_id == current_user.company_id)
        .order_by(models.Job.id.desc())
        .all()
    )


@router.post("", response_model=schemas.JobOut, status_code=201)
def create_job(
    data: schemas.JobCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    _get_owned_client(db, data.client_id, current_user.company_id)
    job = models.Job(company_id=current_user.company_id, **data.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.patch("/{job_id}/status", response_model=schemas.JobOut)
def update_status(
    job_id: int,
    data: schemas.JobStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    job = (
        db.query(models.Job)
        .filter(models.Job.id == job_id, models.Job.company_id == current_user.company_id)
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="Ordem de serviço não encontrada")
    job.status = data.status
    db.commit()
    db.refresh(job)
    return job
