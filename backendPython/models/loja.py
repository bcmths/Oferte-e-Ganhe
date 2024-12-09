from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from db import Base

class Loja(Base):
    __tablename__ = "loja"

    id_loja = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cod_loja = Column(String, nullable=False)
    nome = Column(String, nullable=False)
    cidade = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    usuarios = relationship("Usuario", back_populates="loja")
    estoque = relationship("Estoque", uselist=False, back_populates="loja")
