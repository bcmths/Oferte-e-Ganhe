const statusSolicitacaoService = require("../services/statusSolicitacaoService");

exports.getStatusSolicitacao = async (req, res) => {
  try {
    const statusSolicitacao =
      await statusSolicitacaoService.consultarStatusSolicitacoes();
    res.status(200).json({
      message: "Consulta de status de solicitação realizada com sucesso!",
      statusSolicitacao,
    });
  } catch (erro) {
    console.error("Erro ao consultar status de solicitação:", erro);
    res.status(500).json({
      message: "Erro ao consultar status de solicitação",
      error: erro.message,
    });
  }
};

exports.createStatusSolicitacao = async (req, res) => {
  const { status, descricao } = req.body;
  try {
    const novoStatusSolicitacao =
      await statusSolicitacaoService.inserirStatusSolicitacao(
        status,
        descricao
      );
    res.status(201).json(novoStatusSolicitacao);
  } catch (erro) {
    console.error("Erro ao inserir status de solicitação:", erro);
    res.status(500).json({ message: "Erro ao inserir status de solicitação" });
  }
};

exports.updateStatusSolicitacao = async (req, res) => {
  const { id_status_solicitacao } = req.params;
  const { status, descricao } = req.body;
  try {
    const statusSolicitacaoAtualizado =
      await statusSolicitacaoService.editarStatusSolicitacao(
        id_status_solicitacao,
        status,
        descricao
      );
    if (statusSolicitacaoAtualizado) {
      res.status(200).json({
        message: "Status de solicitação atualizado com sucesso!",
        statusSolicitacao: statusSolicitacaoAtualizado,
      });
    } else {
      res
        .status(404)
        .json({ message: "Status de solicitação não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao editar status de solicitação:", erro);
    res.status(500).json({
      message: "Erro ao editar status de solicitação",
      error: erro.message,
    });
  }
};

exports.deleteStatusSolicitacao = async (req, res) => {
  const { id_status_solicitacao } = req.params;
  try {
    const statusSolicitacaoDeletado =
      await statusSolicitacaoService.deletarStatusSolicitacao(
        id_status_solicitacao
      );
    if (statusSolicitacaoDeletado) {
      res.status(200).json({
        message: "Status de solicitação deletado com sucesso!",
        statusSolicitacao: statusSolicitacaoDeletado,
      });
    } else {
      res
        .status(404)
        .json({ message: "Status de solicitação não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao deletar status de solicitação:", erro);
    res.status(500).json({
      message: "Erro ao deletar status de solicitação",
      error: erro.message,
    });
  }
};
