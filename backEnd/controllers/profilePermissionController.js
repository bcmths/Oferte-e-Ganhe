const profilePermissionService = require("../services/profilePermissionService");
const perfilPermissaoSchema = require("../utils/profilePermissionsSchema");

exports.getPerfilPermissao = async (req, res) => {
  try {
    const associacoes =
      await profilePermissionService.consultarPerfilPermissao();
    res.status(200).json({
      message:
        "Consulta de associações de perfil e permissão realizada com sucesso!",
      associacoes,
    });
  } catch (erro) {
    console.error("Erro ao consultar associações de perfil e permissão:", erro);
    res.status(500).json({
      message: "Erro ao consultar associações de perfil e permissão",
      error: erro.message,
    });
  }
};

exports.createPerfilPermissao = async (req, res) => {
  const { error } = perfilPermissaoSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      message: "Erro de validação.",
      errors: error.details.map((err) => err.message),
    });
  }
  const { id_perfil, permissoes } = req.body;
  try {
    const novaAssociacao =
      await profilePermissionService.inserirPerfilPermissao(
        id_perfil,
        permissoes
      );
    res.status(201).json(novaAssociacao);
  } catch (erro) {
    console.error("Erro ao inserir associação de perfil e permissão:", erro);
    res
      .status(500)
      .json({ message: "Erro ao inserir associação de perfil e permissão" });
  }
};

exports.updatePerfilPermissao = async (req, res) => {
  const { error } = perfilPermissaoSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      message: "Erro de validação.",
      errors: error.details.map((err) => err.message),
    });
  }
  const { id_perfil } = req.params;
  const { permissoes } = req.body;

  try {
    const associacaoAtualizada =
      await profilePermissionService.editarPerfilPermissao(
        id_perfil,
        permissoes
      );

    if (associacaoAtualizada) {
      res.status(200).json({
        message: "Associações de perfil e permissões atualizadas com sucesso!",
        associacao: associacaoAtualizada,
      });
    } else {
      res.status(404).json({ message: "Perfil não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao editar associações de perfil e permissões:", erro);
    res.status(500).json({
      message: "Erro ao editar associações de perfil e permissões",
      error: erro.message,
    });
  }
};

exports.deletePerfilPermissao = async (req, res) => {
  const { id_perfil, id_permissao } = req.params;

  try {
    const associacaoDeletada =
      await profilePermissionService.deletarPerfilPermissao(
        id_perfil,
        id_permissao
      );
    if (associacaoDeletada) {
      res.status(200).json({
        message: "Associação de perfil e permissão deletada com sucesso!",
        associacao: associacaoDeletada,
      });
    } else {
      res
        .status(404)
        .json({ message: "Associação de perfil e permissão não encontrada." });
    }
  } catch (erro) {
    console.error("Erro ao deletar associação de perfil e permissão:", erro);
    res.status(500).json({
      message: "Erro ao deletar associação de perfil e permissão",
      error: erro.message,
    });
  }
};
