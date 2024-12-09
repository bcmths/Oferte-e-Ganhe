from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from db import Base

class Usuario(Base):
    __tablename__ = "usuario"

    id_usuario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String, nullable=False)
    matricula = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    senha = Column(String, nullable=False)
    id_perfil = Column(Integer, ForeignKey("perfil.id_perfil"), nullable=False)
    id_loja = Column(Integer, ForeignKey("loja.id_loja"), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    perfil = relationship("Perfil", back_populates="usuarios")
    loja = relationship("Loja", back_populates="usuarios")
    solicitacoes = relationship("Solicitacao", back_populates="usuario")
