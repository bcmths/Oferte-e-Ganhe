from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from db import Base

class Solicitacao(Base):
    __tablename__ = "solicitacoes"

    id_solicitacao = Column(Integer, primary_key=True, index=True, autoincrement=True)
    data_solicitacao = Column(DateTime, nullable=False, server_default=func.now())
    quantidade_taloes = Column(Integer, nullable=False)
    id_status_solicitacao = Column(Integer, ForeignKey("status_solicitacao.id_status_solicitacao"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    usuario = relationship("Usuario", back_populates="solicitacoes")
    status = relationship("StatusSolicitacao", back_populates="solicitacoes")
    movimentacoes = relationship("Movimentacoes", back_populates="solicitacao")
