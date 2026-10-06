from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..security import hash_password, verify_password, create_access_token
from ..deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(data: schemas.CompanyRegister, db: Session = Depends(get_db)):
    """Cria uma nova empresa (tenant) e seu usuário owner."""
    existing = db.query(models.User).filter(models.User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    company = models.Company(name=data.company_name)
    db.add(company)
    db.flush()  # garante company.id sem precisar commitar ainda

    user = models.User(
        company_id=company.id,
        name=data.owner_name,
        email=data.email,
        hashed_password=hash_password(data.password),
        role=models.UserRole.owner,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=str(user.id), extra_claims={"company_id": user.company_id})
    return schemas.Token(access_token=token)


@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="E-mail ou senha inválidos")

    token = create_access_token(subject=str(user.id), extra_claims={"company_id": user.company_id})
    return schemas.Token(access_token=token)


@router.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user
