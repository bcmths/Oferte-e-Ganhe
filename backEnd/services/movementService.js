const { Movimentacoes, StatusMovimentacao, Solicitacao } = require("../models/associations");

async function consultarMovimentacoes() {
  try {
    const movimentacoes = await Movimentacoes.findAll({
      include: [
        { model: StatusMovimentacao, as: "status" },
        { model: Solicitacao, as: "solicitacao" },
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
  id_solicitacao,
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

module.exports = {
  consultarMovimentacoes,
  inserirMovimentacao,
};
