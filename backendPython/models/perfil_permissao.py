from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from db import Base

class PerfilPermissao(Base):
    __tablename__ = "perfil_permissao"

    id_perfil = Column(Integer, ForeignKey("perfil.id_perfil"), primary_key=True)
    id_permissao = Column(Integer, ForeignKey("permissao.id_permissao"), primary_key=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
