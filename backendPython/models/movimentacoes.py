from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from db import Base

class Movimentacoes(Base):
    __tablename__ = "movimentacoes"

    id_movimentacao = Column(Integer, primary_key=True, index=True, autoincrement=True)
    remessa = Column(String, nullable=False)
    tipo_movimentacao = Column(String, nullable=False)
    data_movimentacao = Column(DateTime, nullable=False, server_default=func.now())
    data_prevista = Column(DateTime, nullable=False)
    quantidade = Column(Integer, nullable=False)
    id_status = Column(Integer, ForeignKey("status_movimentacao.id_status_movimentacao"), nullable=False)
    id_solicitacao = Column(Integer, ForeignKey("solicitacoes.id_solicitacao"), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    status = relationship("StatusMovimentacao", back_populates="movimentacoes")
    solicitacao = relationship("Solicitacao", back_populates="movimentacoes")
