const profileService = require("../services/profileService");
const perfilSchema = require("../utils/profileSchema");

exports.getPerfis = async (req, res) => {
  try {
    const perfis = await profileService.consultarPerfis();
    res.status(200).json({
      message: "Consulta de perfis realizada com sucesso!",
      perfis,
    });
  } catch (erro) {
    console.error("Erro ao consultar perfis:", erro);
    res.status(500).json({
      message: "Erro ao consultar perfis",
      error: erro.message,
    });
  }
};

exports.createPerfil = async (req, res) => {
  const { error } = perfilSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Erro de validação.",
      errors: error.details.map((err) => err.message),
    });
  }
  const { nome } = req.body;
  try {
    const novoPerfil = await profileService.inserirPerfil(nome);
    res.status(201).json(novoPerfil);
  } catch (erro) {
    console.error("Erro ao inserir perfil:", erro);
    res.status(500).json({ message: "Erro ao inserir perfil" });
  }
};

exports.updatePerfil = async (req, res) => {
  const { error } = perfilSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Erro de validação.",
      errors: error.details.map((err) => err.message),
    });
  }
  const { id_perfil } = req.params;
  const { nome } = req.body;

  try {
    const perfilAtualizado = await profileService.editarPerfil(id_perfil, nome);
    if (perfilAtualizado) {
      res.status(200).json({
        message: "Perfil atualizado com sucesso!",
        perfil: perfilAtualizado,
      });
    } else {
      res.status(404).json({ message: "Perfil não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao editar perfil:", erro);
    res.status(500).json({
      message: "Erro ao editar perfil",
      error: erro.message,
    });
  }
};

exports.deletePerfil = async (req, res) => {
  const { id } = req.params;

  try {
    const perfilDeletado = await profileService.deletarPerfil(id);
    if (perfilDeletado) {
      res.status(200).json({
        message: "Perfil deletado com sucesso!",
        perfil: perfilDeletado,
      });
    } else {
      res.status(404).json({ message: "Perfil não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao deletar perfil:", erro);
    res.status(500).json({
      message: "Erro ao deletar perfil",
      error: erro.message,
    });
  }
};
