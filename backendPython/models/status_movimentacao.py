from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from db import Base

class StatusMovimentacao(Base):
    __tablename__ = "status_movimentacao"

    id_status_movimentacao = Column(Integer, primary_key=True, index=True, autoincrement=True)
    status = Column(String, nullable=False)
    descricao = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    movimentacoes = relationship("Movimentacoes", back_populates="status")
