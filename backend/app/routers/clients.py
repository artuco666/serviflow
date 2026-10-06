from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("", response_model=List[schemas.ClientOut])
def list_clients(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Client)
        .filter(models.Client.company_id == current_user.company_id)
        .order_by(models.Client.id.desc())
        .all()
    )


@router.post("", response_model=schemas.ClientOut, status_code=201)
def create_client(
    data: schemas.ClientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    client = models.Client(company_id=current_user.company_id, **data.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.get("/{client_id}", response_model=schemas.ClientOut)
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    client = (
        db.query(models.Client)
        .filter(models.Client.id == client_id, models.Client.company_id == current_user.company_id)
        .first()
    )
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return client
