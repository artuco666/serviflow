from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict

from .models import JobStatus, UserRole


# ---------- Auth ----------

class CompanyRegister(BaseModel):
    company_name: str
    owner_name: str
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    name: str
    email: EmailStr
    role: UserRole


# ---------- Client ----------

class ClientCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None


class ClientOut(ClientCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    created_at: datetime


# ---------- Job (Ordem de Serviço) ----------

class JobCreate(BaseModel):
    client_id: int
    title: str
    value: float = 0
    scheduled_at: Optional[datetime] = None
    notes: Optional[str] = None


class JobStatusUpdate(BaseModel):
    status: JobStatus


class JobOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    client_id: int
    title: str
    status: JobStatus
    value: float
    scheduled_at: Optional[datetime]
    notes: Optional[str]
    created_at: datetime


class DashboardStats(BaseModel):
    clients: int
    open_jobs: int
    revenue: float
    pipeline: float
