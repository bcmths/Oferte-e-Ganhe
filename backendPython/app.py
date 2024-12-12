from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db import engine, SessionLocal, Base
from models.usuario import Usuario
from models.loja import Loja
from models.estoque import Estoque
from models.perfil import Perfil
from models.permissao import Permissao
from models.perfil_permissao import PerfilPermissao
from models.solicitacao import Solicitacao
from models.movimentacoes import Movimentacoes
from models.status_solicitacao import StatusSolicitacao
from models.status_movimentacao import StatusMovimentacao
from routes.csv_routes import router as csv_router
from sqlalchemy.orm import joinedload

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(csv_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API FastAPI para Gerenciamento de Dados"}

@app.get("/usuarios")
def get_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(Usuario).options(joinedload(Usuario.perfil)).all()
    return usuarios

@app.get("/lojas")
def get_lojas(db: Session = Depends(get_db)):
    lojas = db.query(Loja).all()
    return lojas

@app.get("/estoques")
def get_estoques(db: Session = Depends(get_db)):
    estoques = db.query(Estoque).all()
    return estoques

@app.get("/perfis")
def get_perfis(db: Session = Depends(get_db)):
    perfis = db.query(Perfil).all()
    return perfis

@app.get("/permissoes")
def get_permissoes(db: Session = Depends(get_db)):
    permissoes = db.query(Permissao).all()
    return permissoes

@app.get("/solicitacoes")
def get_solicitacoes(db: Session = Depends(get_db)):
    solicitacoes = db.query(Solicitacao).options(
        joinedload(Solicitacao.status),
        joinedload(Solicitacao.usuario)
    ).all()
    return solicitacoes

@app.get("/movimentacoes")
def get_movimentacoes(db: Session = Depends(get_db)):
    movimentacoes = db.query(Movimentacoes).all()
    return movimentacoes

@app.get("/status-solicitacoes")
def get_status_solicitacoes(db: Session = Depends(get_db)):
    status_solicitacoes = db.query(StatusSolicitacao).all()
    return status_solicitacoes

@app.get("/status-movimentacoes")
def get_status_movimentacoes(db: Session = Depends(get_db)):
    status_movimentacoes = db.query(StatusMovimentacao).all()
    return status_movimentacoes

@app.get("/associacoes")
def get_associacoes(db: Session = Depends(get_db)):
    associacoes = db.query(PerfilPermissao).all()
    return associacoes