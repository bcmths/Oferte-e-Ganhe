from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from db import Base

class Perfil(Base):
    __tablename__ = "perfil"

    id_perfil = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    usuarios = relationship("Usuario", back_populates="perfil")
    permissoes = relationship(
        "Permissao",
        secondary="perfil_permissao",
        back_populates="perfis"
    )
