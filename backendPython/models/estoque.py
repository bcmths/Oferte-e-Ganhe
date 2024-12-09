from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from db import Base

class Estoque(Base):
    __tablename__ = "estoque"

    id_estoque = Column(Integer, primary_key=True, index=True, autoincrement=True)
    estoque_atual = Column(Integer, nullable=False)
    estoque_minimo = Column(Integer, nullable=False)
    estoque_recomendado = Column(Integer, nullable=False)
    id_loja = Column(Integer, ForeignKey("loja.id_loja"), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    loja = relationship("Loja", back_populates="estoque")
