const StatusSolicitacao = require("../models/statusSolicitacaoModel");

async function consultarStatusSolicitacoes() {
  try {
    const statusSolicitacoes = await StatusSolicitacao.findAll();
    return statusSolicitacoes;
  } catch (erro) {
    console.error("Erro ao buscar status de solicitações:", erro);
    throw erro;
  }
}

async function inserirStatusSolicitacao(status, descricao) {
  try {
    const statusSolicitacao = await StatusSolicitacao.create({
      status,
      descricao,
    });
    return statusSolicitacao;
  } catch (erro) {
    console.error("Erro ao inserir status de solicitação:", erro);
    throw erro;
  }
}

async function editarStatusSolicitacao(
  id_status_solicitacao,
  status,
  descricao
) {
  try {
    const statusSolicitacao = await StatusSolicitacao.findByPk(
      id_status_solicitacao
    );

    if (!statusSolicitacao) {
      throw new Error("Status de solicitação não encontrado");
    }

    statusSolicitacao.status = status;
    statusSolicitacao.descricao = descricao;
    await statusSolicitacao.save();

    return statusSolicitacao;
  } catch (erro) {
    console.error("Erro ao editar status de solicitação:", erro);
    throw erro;
  }
}

async function deletarStatusSolicitacao(id_status_solicitacao) {
  try {
    const statusSolicitacao = await StatusSolicitacao.findByPk(
      id_status_solicitacao
    );

    if (!statusSolicitacao) {
      throw new Error("Status de solicitação não encontrado");
    }

    await statusSolicitacao.destroy();

    return { id_status_solicitacao };
  } catch (erro) {
    console.error("Erro ao deletar status de solicitação:", erro);
    throw erro;
  }
}

module.exports = {
  consultarStatusSolicitacoes,
  inserirStatusSolicitacao,
  editarStatusSolicitacao,
  deletarStatusSolicitacao,
};
