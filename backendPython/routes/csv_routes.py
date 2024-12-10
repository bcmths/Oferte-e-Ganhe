from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import StringIO
import pandas as pd
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
from db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/generate_csv/usuarios")
def generate_csv(db: Session = Depends(get_db)):
    """
    Gera um arquivo CSV com os dados dos usuários, incluindo loja e perfil.
    """
    usuarios = db.query(Usuario).join(Usuario.loja).join(Usuario.perfil).all()

    usuarios_data = [
        {
            "Matrícula": usuario.matricula,
            "Nome": usuario.nome,
            "E-mail": usuario.email,
            "Loja": usuario.loja.nome,
            "Perfil": usuario.perfil.nome,
            "Criado em": usuario.created_at,
            "Editado em": usuario.updated_at,
        }
        for usuario in usuarios
    ]

    df = pd.DataFrame(usuarios_data)

    csv_file = StringIO()
    df.to_csv(csv_file, index=False)
    csv_file.seek(0)

    response = StreamingResponse(csv_file, media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=usuarios.csv"
    return response

@router.get("/generate_csv/lojas")
def generate_csv(db: Session = Depends(get_db)):
    """
    Gera um arquivo CSV com os dados das lojas.
    """
    lojas = db.query(Loja).all()

    lojas_data = [
        {
            "Código da Loja": loja.cod_loja,
            "Nome": loja.nome,
            "Cidade": loja.cidade,            
        }
        for loja in lojas
    ]

    df = pd.DataFrame(lojas_data)

    csv_file = StringIO()
    df.to_csv(csv_file, index=False)
    csv_file.seek(0)

    response = StreamingResponse(csv_file, media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=lojas.csv"
    return response

@router.get("/generate_csv/perfis")
def generate_csv(db: Session = Depends(get_db)):
    """
    Gera um arquivo CSV com os dados dos perfis, incluindo os módulos e tipos de permissões associadas.
    """
    perfis = (
        db.query(Perfil)
        .join(PerfilPermissao)
        .join(Permissao)
        .all()
    )

    perfis_data = []
    for perfil in perfis:
        permissoes_dict = {}
        for permissao in perfil.permissoes:
            if permissao.modulo not in permissoes_dict:
                permissoes_dict[permissao.modulo] = []
            permissoes_dict[permissao.modulo].append(permissao.tipo_permissao)

        permissoes_formatadas = [
            f"{modulo}: {', '.join(tipos)}"
            for modulo, tipos in permissoes_dict.items()
        ]

        perfis_data.append({
            "Perfil": perfil.nome,
            "Permissões": "; ".join(permissoes_formatadas),
            "Criado em": perfil.created_at,
            "Editado em": perfil.updated_at,
        })

    df = pd.DataFrame(perfis_data)

    csv_file = StringIO()
    df.to_csv(csv_file, index=False)
    csv_file.seek(0)

    response = StreamingResponse(csv_file, media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=perfis.csv"
    return response


@router.get("/generate_csv/envio_taloes")
def generate_csv(db: Session = Depends(get_db)):
    """
    Gera um arquivo CSV com os dados das movimentações de envio de talões, incluindo status, loja e solicitação.
    """
    movimentacoes = (
        db.query(Movimentacoes)
        .join(Solicitacao)
        .filter(Movimentacoes.tipo_movimentacao == "Envio")
        .all()
    )

    movimentacoes_data = []
    for movimentacao in movimentacoes:
        movimentacoes_data.append({
            "ID da Solicitação": movimentacao.solicitacao.id_solicitacao,
            "Remessa": movimentacao.remessa,
            "Tipo de Movimentação": movimentacao.tipo_movimentacao,
            "Data da Movimentação": movimentacao.data_movimentacao,
            "Data Prevista": movimentacao.data_prevista,
            "Quantidade": movimentacao.quantidade,
            "Loja": movimentacao.solicitacao.usuario.loja.nome,
            "Funcionário": movimentacao.solicitacao.usuario.nome,
            "Status da Solicitação": movimentacao.solicitacao.status.status,
            "Criado em": movimentacao.created_at,
            "Editado em": movimentacao.updated_at,
        })

    df = pd.DataFrame(movimentacoes_data)

    csv_file = StringIO()
    df.to_csv(csv_file, index=False)
    csv_file.seek(0)

    response = StreamingResponse(csv_file, media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=envio_taloes.csv"
    return response

@router.get("/generate_csv/recebimento_taloes")
def generate_csv(db: Session = Depends(get_db)):
    """
    Gera um arquivo CSV com os dados das movimentações de recebimento de talões, incluindo status, loja e solicitação.
    """
    movimentacoes = (
        db.query(Movimentacoes)
        .join(Solicitacao)
        .filter(Movimentacoes.tipo_movimentacao == "Recebimento")
        .all()
    )

    movimentacoes_data = []
    for movimentacao in movimentacoes:
        movimentacoes_data.append({
            "ID da Solicitação": movimentacao.solicitacao.id_solicitacao,
            "Remessa": movimentacao.remessa,
            "Tipo de Movimentação": movimentacao.tipo_movimentacao,
            "Data da Movimentação": movimentacao.data_movimentacao,
            "Data Prevista": movimentacao.data_prevista,
            "Quantidade": movimentacao.quantidade,
            "Loja": movimentacao.solicitacao.usuario.loja.nome,
            "Funcionário": movimentacao.solicitacao.usuario.nome,
            "Status da Solicitação": movimentacao.solicitacao.status.status,
            "Criado em": movimentacao.created_at,
            "Editado em": movimentacao.updated_at,
        })

    df = pd.DataFrame(movimentacoes_data)

    csv_file = StringIO()
    df.to_csv(csv_file, index=False)
    csv_file.seek(0)

    response = StreamingResponse(csv_file, media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=recebimento_taloes.csv"
    return response

@router.get("/generate_csv/estoques")
def generate_csv(db: Session = Depends(get_db)):
    """
    Gera um arquivo CSV com os dados de estoque, incluindo informações da loja.
    """
    estoques = db.query(Estoque).join(Estoque.loja).all()

    estoques_data = []
    for estoque in estoques:
        estoques_data.append({
            "Loja": estoque.loja.nome,
            "Estoque Atual": estoque.estoque_atual,
            "Estoque Mínimo": estoque.estoque_minimo,
            "Estoque Recomendado": estoque.estoque_recomendado,
            "Criado em": estoque.created_at,
            "Editado em": estoque.updated_at,
        })

    df = pd.DataFrame(estoques_data)

    csv_file = StringIO()
    df.to_csv(csv_file, index=False)
    csv_file.seek(0)

    response = StreamingResponse(csv_file, media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=estoques.csv"
    return response

@router.get("/generate_csv/solicitacoes")
def generate_csv(db: Session = Depends(get_db)):
    """
    Gera um arquivo CSV com os dados das solicitações, incluindo informações do usuário e status.
    """
    solicitacoes = (
        db.query(Solicitacao)
        .join(Solicitacao.usuario)
        .join(Solicitacao.status)
        .all()
    )

    solicitacoes_data = []
    for solicitacao in solicitacoes:
        solicitacoes_data.append({
            "ID Solicitação": solicitacao.id_solicitacao,
            "Usuário": solicitacao.usuario.nome,
            "Matrícula": solicitacao.usuario.matricula,
            "Loja": solicitacao.usuario.loja.nome,
            "Quantidade de Talões": solicitacao.quantidade_taloes,
            "Status": solicitacao.status.status,
            "Criado em": solicitacao.created_at,
            "Editado em": solicitacao.updated_at,
        })

    df = pd.DataFrame(solicitacoes_data)

    csv_file = StringIO()
    df.to_csv(csv_file, index=False)
    csv_file.seek(0)

    response = StreamingResponse(csv_file, media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=solicitacoes.csv"
    return response
