from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=schemas.DashboardStats)
def summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cid = current_user.company_id
    open_statuses = [
        models.JobStatus.novo,
        models.JobStatus.agendado,
        models.JobStatus.em_execucao,
    ]

    clients_count = db.query(func.count(models.Client.id)).filter(models.Client.company_id == cid).scalar()
    open_jobs = (
        db.query(func.count(models.Job.id))
        .filter(models.Job.company_id == cid, models.Job.status.in_(open_statuses))
        .scalar()
    )
    revenue = (
        db.query(func.coalesce(func.sum(models.Job.value), 0))
        .filter(models.Job.company_id == cid, models.Job.status == models.JobStatus.concluido)
        .scalar()
    )
    pipeline = (
        db.query(func.coalesce(func.sum(models.Job.value), 0))
        .filter(models.Job.company_id == cid, models.Job.status.in_(open_statuses))
        .scalar()
    )

    return schemas.DashboardStats(
        clients=clients_count or 0,
        open_jobs=open_jobs or 0,
        revenue=float(revenue or 0),
        pipeline=float(pipeline or 0),
    )
