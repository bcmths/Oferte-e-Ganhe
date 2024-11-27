const Solicitacao = require("../models/solicitacionModel");
const StatusSolicitacao = require("../models/statusSolicitacaoModel");
const Usuario = require("../models/userModel");

async function consultarSolicitacoes() {
  try {
    const solicitacoes = await Solicitacao.findAll({
      include: [
        { model: StatusSolicitacao, as: "status" },
        { model: Usuario, as: "usuario" },
      ],
    });
    return solicitacoes;
  } catch (erro) {
    console.error("Erro ao consultar solicitações:", erro);
    throw erro;
  }
}

async function inserirSolicitacao(
  quantidade_taloes,
  id_status_solicitacao,
  id_usuario
) {
  try {
    const solicitacao = await Solicitacao.create({
      quantidade_taloes,
      id_status_solicitacao,
      id_usuario,
    });
    return solicitacao;
  } catch (erro) {
    console.error("Erro ao inserir solicitação:", erro);
    throw erro;
  }
}

async function editarSolicitacao(
  id_solicitacao,
  quantidade_taloes,
  id_status_solicitacao,
  id_usuario
) {
  try {
    const solicitacao = await Solicitacao.update(
      {
        quantidade_taloes,
        id_status_solicitacao,
        id_usuario,
      },
      {
        where: { id_solicitacao },
        returning: true,
      }
    );

    if (solicitacao[0] === 0) {
      throw new Error("Solicitação não encontrada ou não foi atualizada");
    }

    return solicitacao[1][0];
  } catch (erro) {
    console.error("Erro ao editar solicitação:", erro);
    throw erro;
  }
}

async function deletarSolicitacao(id_solicitacao) {
  try {
    const resultado = await Solicitacao.destroy({
      where: { id_solicitacao },
    });

    if (resultado === 0) {
      throw new Error("Solicitação não encontrada ou não foi deletada");
    }

    return { message: "Solicitação deletada com sucesso" };
  } catch (erro) {
    console.error("Erro ao deletar solicitação:", erro);
    throw erro;
  }
}

module.exports = {
  consultarSolicitacoes,
  inserirSolicitacao,
  editarSolicitacao,
  deletarSolicitacao,
};
