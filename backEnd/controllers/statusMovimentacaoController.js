const statusMovimentacaoService = require("../services/statusMovimentacaoService");

exports.getStatusMovimentacao = async (req, res) => {
  try {
    const statusMovimentacao =
      await statusMovimentacaoService.consultarStatusMovimentacao();
    res.status(200).json({
      message: "Consulta de status de movimentação realizada com sucesso!",
      statusMovimentacao,
    });
  } catch (erro) {
    console.error("Erro ao consultar status de movimentação:", erro);
    res.status(500).json({
      message: "Erro ao consultar status de movimentação",
      error: erro.message,
    });
  }
};

exports.createStatusMovimentacao = async (req, res) => {
  const { status, descricao } = req.body;
  try {
    const novoStatusMovimentacao =
      await statusMovimentacaoService.inserirStatusMovimentacao(
        status,
        descricao
      );
    res.status(201).json(novoStatusMovimentacao);
  } catch (erro) {
    console.error("Erro ao inserir status de movimentação:", erro);
    res.status(500).json({ message: "Erro ao inserir status de movimentação" });
  }
};

exports.updateStatusMovimentacao = async (req, res) => {
  const { id_status_movimentacao } = req.params;
  const { status, descricao } = req.body;
  try {
    const statusMovimentacaoAtualizado =
      await statusMovimentacaoService.editarStatusMovimentacao(
        id_status_movimentacao,
        status,
        descricao
      );
    if (statusMovimentacaoAtualizado) {
      res.status(200).json({
        message: "Status de movimentação atualizado com sucesso!",
        statusMovimentacao: statusMovimentacaoAtualizado,
      });
    } else {
      res
        .status(404)
        .json({ message: "Status de movimentação não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao editar status de movimentação:", erro);
    res.status(500).json({
      message: "Erro ao editar status de movimentação",
      error: erro.message,
    });
  }
};

exports.deleteStatusMovimentacao = async (req, res) => {
  const { id_status_movimentacao } = req.params;
  try {
    const statusMovimentacaoDeletado =
      await statusMovimentacaoService.deletarStatusMovimentacao(
        id_status_movimentacao
      );
    if (statusMovimentacaoDeletado) {
      res.status(200).json({
        message: "Status de movimentação deletado com sucesso!",
        statusMovimentacao: statusMovimentacaoDeletado,
      });
    } else {
      res
        .status(404)
        .json({ message: "Status de movimentação não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao deletar status de movimentação:", erro);
    res.status(500).json({
      message: "Erro ao deletar status de movimentação",
      error: erro.message,
    });
  }
};
