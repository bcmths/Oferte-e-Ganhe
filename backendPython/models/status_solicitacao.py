from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from db import Base

class StatusSolicitacao(Base):
    __tablename__ = "status_solicitacao"

    id_status_solicitacao = Column(Integer, primary_key=True, index=True, autoincrement=True)
    status = Column(String, nullable=False)
    descricao = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    solicitacoes = relationship("Solicitacao", back_populates="status")
