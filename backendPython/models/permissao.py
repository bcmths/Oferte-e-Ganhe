from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from db import Base

class Permissao(Base):
    __tablename__ = "permissao"

    id_permissao = Column(Integer, primary_key=True, index=True, autoincrement=True)
    modulo = Column(String, nullable=False)
    tipo_permissao = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    perfis = relationship(
        "Perfil",
        secondary="perfil_permissao",
        back_populates="permissoes"
    )
