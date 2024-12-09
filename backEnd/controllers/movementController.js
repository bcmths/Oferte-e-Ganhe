const movementService = require("../services/movementService");

exports.createMovimentacao = async (req, res) => {
  const {
    remessa,
    tipo_movimentacao,
    data_movimentacao,
    data_prevista,
    quantidade,
    id_status,
    id_solicitacao,
  } = req.body;

  try {
    const novaMovimentacao = await movementService.inserirMovimentacao(
      remessa,
      tipo_movimentacao,
      data_movimentacao,
      data_prevista,
      quantidade,
      id_status,
      id_solicitacao
    );    
    res.status(201).json(novaMovimentacao);
  } catch (erro) {
    console.error("Erro ao inserir movimentação:", erro);
    res.status(500).json({ message: "Erro ao inserir movimentação" });
  }
};

exports.getAllMovimentacoes = async (req, res) => {
  try {
    const movimentacoes = await movementService.consultarMovimentacoes();
    res.status(200).json({
      message: "Consulta de movimentações realizada com sucesso!",
      movimentacoes,
    });
  } catch (erro) {
    console.error("Erro ao consultar movimentações:", erro);
    res.status(500).json({ message: "Erro ao consultar movimentações" });
  }
};

exports.updateMovimentacao = async (req, res) => {
  const { id_movimentacao } = req.params;
  const {
    remessa,
    tipo_movimentacao,
    data_movimentacao,
    data_prevista,
    quantidade,
    id_status,
    id_solicitacao,
  } = req.body;

  try {
    const movimentacaoAtualizada = await movementService.editarMovimentacao(
      id_movimentacao,
      remessa,
      tipo_movimentacao,
      data_movimentacao,
      data_prevista,
      quantidade,
      id_status,
      id_solicitacao
    );
    if (movimentacaoAtualizada) {
      res.status(200).json({
        message: "Movimentação atualizada com sucesso!",
        movimentacao: movimentacaoAtualizada,
      });
    } else {
      res.status(404).json({ message: "Movimentação não encontrada." });
    }
  } catch (erro) {
    console.error("Erro ao editar movimentação:", erro);
    res.status(500).json({ message: "Erro ao editar movimentação" });
  }
};

exports.deleteMovimentacao = async (req, res) => {
  const { id_movimentacao } = req.params;

  try {
    const movimentacaoDeletada = await movementService.deletarMovimentacao(
      id_movimentacao
    );
    if (movimentacaoDeletada) {
      res.status(200).json({
        message: "Movimentação deletada com sucesso!",
        movimentacao: movimentacaoDeletada,
      });
    } else {
      res.status(404).json({ message: "Movimentação não encontrada." });
    }
  } catch (erro) {
    console.error("Erro ao deletar movimentação:", erro);
    res.status(500).json({ message: "Erro ao deletar movimentação" });
  }
};
