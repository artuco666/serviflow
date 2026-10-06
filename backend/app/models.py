import enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Enum,
    func,
)
from sqlalchemy.orm import relationship

from .database import Base


class UserRole(str, enum.Enum):
    owner = "owner"
    admin = "admin"
    technician = "technician"


class JobStatus(str, enum.Enum):
    novo = "Novo"
    agendado = "Agendado"
    em_execucao = "Em Execução"
    concluido = "Concluído"
    cancelado = "Cancelado"


class Company(Base):
    """Representa uma empresa cliente do ServiFlow (base para multi-tenancy)."""

    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    users = relationship("User", back_populates="company", cascade="all, delete-orphan")
    clients = relationship("Client", back_populates="company", cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.owner)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("Company", back_populates="users")


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50))
    email = Column(String(255))
    address = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("Company", back_populates="clients")
    jobs = relationship("Job", back_populates="client", cascade="all, delete-orphan")


class Job(Base):
    """Ordem de Serviço (OS)."""

    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    status = Column(Enum(JobStatus), nullable=False, default=JobStatus.novo)
    value = Column(Float, default=0)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(String(2000))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("Company", back_populates="jobs")
    client = relationship("Client", back_populates="jobs")
