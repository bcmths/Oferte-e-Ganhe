const solicitationService = require("../services/solicitationService");
const { solicitacaoSchema } = require("../utils/solicitationSchema");

exports.getSolicitacoes = async (req, res) => {
  try {
    const solicitacoes = await solicitationService.consultarSolicitacoes();
    res.status(200).json({
      message: "Consulta de solicitações realizada com sucesso!",
      solicitacoes,
    });
  } catch (erro) {
    console.error("Erro ao consultar solicitações:", erro);
    res.status(500).json({
      message: "Erro ao consultar solicitações",
      error: erro.message,
    });
  }
};

exports.createSolicitacao = async (req, res) => {
  const { error } = solicitacaoSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      message: "Erro de validação.",
      errors: error.details.map((err) => err.message),
    });
  }
  const { quantidade_taloes, id_status_solicitacao, id_usuario } = req.body;
  try {
    const novaSolicitacao = await solicitationService.inserirSolicitacao(
      quantidade_taloes,
      id_status_solicitacao,
      id_usuario
    );
    res.status(201).json(novaSolicitacao);
  } catch (erro) {
    console.error("Erro ao inserir solicitação:", erro);
    res.status(500).json({ message: "Erro ao inserir solicitação" });
  }
};

exports.updateSolicitacao = async (req, res) => {
  const { error } = solicitacaoSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      message: "Erro de validação.",
      errors: error.details.map((err) => err.message),
    });
  }
  const { id_solicitacao } = req.params;
  const { quantidade_taloes, id_status_solicitacao, id_usuario } = req.body;

  try {
    const solicitacaoAtualizada = await solicitationService.editarSolicitacao(
      id_solicitacao,
      quantidade_taloes,
      id_status_solicitacao,
      id_usuario
    );
    if (solicitacaoAtualizada) {
      res.status(200).json({
        message: "Solicitação atualizada com sucesso!",
        solicitacao: solicitacaoAtualizada,
      });
    } else {
      res.status(404).json({ message: "Solicitação não encontrada." });
    }
  } catch (erro) {
    console.error("Erro ao editar solicitação:", erro);
    res.status(500).json({
      message: "Erro ao editar solicitação",
      error: erro.message,
    });
  }
};

exports.deleteSolicitacao = async (req, res) => {
  const { id_solicitacao } = req.params;

  try {
    const solicitacaoDeletada = await solicitationService.deletarSolicitacao(
      id_solicitacao
    );
    if (solicitacaoDeletada) {
      res.status(200).json({
        message: "Solicitação deletada com sucesso!",
        solicitacao: solicitacaoDeletada,
      });
    } else {
      res.status(404).json({ message: "Solicitação não encontrada." });
    }
  } catch (erro) {
    console.error("Erro ao deletar solicitação:", erro);
    res.status(500).json({
      message: "Erro ao deletar solicitação",
      error: erro.message,
    });
  }
};
