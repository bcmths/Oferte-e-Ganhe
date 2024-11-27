const StatusMovimentacao = require("../models/statusMovimentacaoModel");

async function consultarStatusMovimentacao() {
  try {
    const status = await StatusMovimentacao.findAll();
    return status;
  } catch (erro) {
    console.error("Erro ao buscar status de movimentação:", erro);
    throw erro;
  }
}

async function inserirStatusMovimentacao(status, descricao) {
  try {
    const novoStatus = await StatusMovimentacao.create({
      status,
      descricao,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return novoStatus;
  } catch (erro) {
    console.error("Erro ao inserir status de movimentação:", erro);
    throw erro;
  }
}

async function editarStatusMovimentacao(
  id_status_movimentacao,
  status,
  descricao
) {
  try {
    const statusMovimentacao = await StatusMovimentacao.findByPk(
      id_status_movimentacao
    );
    if (!statusMovimentacao) {
      throw new Error("Status de movimentação não encontrado");
    }

    statusMovimentacao.status = status;
    statusMovimentacao.descricao = descricao;
    statusMovimentacao.updated_at = new Date();

    await statusMovimentacao.save();
    return statusMovimentacao;
  } catch (erro) {
    console.error("Erro ao editar status de movimentação:", erro);
    throw erro;
  }
}

async function deletarStatusMovimentacao(id_status_movimentacao) {
  try {
    const statusMovimentacao = await StatusMovimentacao.findByPk(
      id_status_movimentacao
    );
    if (!statusMovimentacao) {
      throw new Error("Status de movimentação não encontrado");
    }

    await statusMovimentacao.destroy();
    return statusMovimentacao;
  } catch (erro) {
    console.error("Erro ao deletar status de movimentação:", erro);
    throw erro;
  }
}

module.exports = {
  consultarStatusMovimentacao,
  inserirStatusMovimentacao,
  editarStatusMovimentacao,
  deletarStatusMovimentacao,
};
