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

# Criar as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Instância da aplicação
app = FastAPI()

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependência para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rotas principais
@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API FastAPI para Gerenciamento de Dados"}

# Rota para obter todos os usuários
@app.get("/usuarios")
def get_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(Usuario).all()
    return usuarios

# Rota para obter todas as lojas
@app.get("/lojas")
def get_lojas(db: Session = Depends(get_db)):
    lojas = db.query(Loja).all()
    return lojas

# Rota para obter todos os estoques
@app.get("/estoques")
def get_estoques(db: Session = Depends(get_db)):
    estoques = db.query(Estoque).all()
    return estoques

# Rota para obter todos os perfis
@app.get("/perfis")
def get_perfis(db: Session = Depends(get_db)):
    perfis = db.query(Perfil).all()
    return perfis

# Rota para obter todas as permissões
@app.get("/permissoes")
def get_permissoes(db: Session = Depends(get_db)):
    permissoes = db.query(Permissao).all()
    return permissoes

# Rota para obter todas as solicitações
@app.get("/solicitacoes")
def get_solicitacoes(db: Session = Depends(get_db)):
    solicitacoes = db.query(Solicitacao).all()
    return solicitacoes

# Rota para obter todas as movimentações
@app.get("/movimentacoes")
def get_movimentacoes(db: Session = Depends(get_db)):
    movimentacoes = db.query(Movimentacoes).all()
    return movimentacoes

# Rota para obter todos os status de solicitações
@app.get("/status-solicitacoes")
def get_status_solicitacoes(db: Session = Depends(get_db)):
    status_solicitacoes = db.query(StatusSolicitacao).all()
    return status_solicitacoes

# Rota para obter todos os status de movimentações
@app.get("/status-movimentacoes")
def get_status_movimentacoes(db: Session = Depends(get_db)):
    status_movimentacoes = db.query(StatusMovimentacao).all()
    return status_movimentacoes

@app.get("/associacoes")
def get_associacoes(db: Session = Depends(get_db)):
    associacoes = db.query(PerfilPermissao).all()
    return associacoes