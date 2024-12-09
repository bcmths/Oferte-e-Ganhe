const Movimentacoes = require("../models/movementModel");
const StatusMovimentacao = require("../models/statusMovimentacaoModel");
const Solicitacao = require("../models/solicitacionModel");
const Usuario = require("../models/userModel");
const Loja = require("../models/storeModel");

async function consultarMovimentacoes() {
  try {
    const movimentacoes = await Movimentacoes.findAll({
      include: [
        { model: StatusMovimentacao, as: "status" },
        {
          model: Solicitacao,
          as: "solicitacao",
          include: {
            model: Usuario,
            as: "usuario",
            include: { model: Loja, as: "loja" },
          },
        },
      ],
    });
    return movimentacoes;
  } catch (erro) {
    console.error("Erro ao consultar movimentações:", erro);
    throw erro;
  }
}

async function inserirMovimentacao(
  remessa,
  tipo_movimentacao,
  data_movimentacao,
  data_prevista,
  quantidade,
  id_status,
  id_solicitacao
) {
  try {
    const movimentacao = await Movimentacoes.create({
      remessa,
      tipo_movimentacao,
      data_movimentacao,
      data_prevista,
      quantidade,
      id_status,
      id_solicitacao,
    });
    return movimentacao;
  } catch (erro) {
    console.error("Erro ao inserir movimentação:", erro);
    throw erro;
  }
}

async function editarMovimentacao(
  id_movimentacao,
  remessa,
  tipo_movimentacao,
  data_movimentacao,
  data_prevista,
  quantidade,
  id_status,
  id_solicitacao
) {
  try {
    const valoresAtualizados = {
      remessa,
      tipo_movimentacao,
      data_movimentacao,
      data_prevista,
      quantidade,
      id_status,
      id_solicitacao,
    };

    const [linhasAfetadas, [movimentacaoAtualizada]] =
      await Movimentacoes.update(valoresAtualizados, {
        where: { id_movimentacao },
        returning: true,
      });

    if (linhasAfetadas === 0) {
      throw new Error("Movimentação não encontrada para atualização.");
    }

    return movimentacaoAtualizada;
  } catch (erro) {
    console.error("Erro ao editar movimentação:", erro);
    throw erro;
  }
}

async function deletarMovimentacao(id_movimentacao) {
  try {
    const movimentacaoDeletada = await Movimentacoes.destroy({
      where: { id_movimentacao },
    });

    if (!movimentacaoDeletada) {
      throw new Error("Movimentação não encontrada para exclusão.");
    }

    return { mensagem: "Movimentação deletada com sucesso." };
  } catch (erro) {
    console.error("Erro ao deletar movimentação:", erro);
    throw erro;
  }
}

module.exports = {
  consultarMovimentacoes,
  inserirMovimentacao,
  editarMovimentacao,
  deletarMovimentacao,
};
