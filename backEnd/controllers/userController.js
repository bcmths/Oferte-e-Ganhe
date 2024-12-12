const userService = require("../services/userService");
const authService = require("../services/authService");
const { creteUserSchema, updateUserSchema } = require("../utils/userSchema");

exports.registerUser = async (req, res) => {
  const { error } = creteUserSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { nome, matricula, email, senha, id_perfil, id_loja } = req.body;
  try {
    const emailExistente = await authService.consultarUsuarioPorEmail(email);
    if (emailExistente) {
      return res.status(400).json({ error: "E-mail já cadastrado!" });
    }

    const matriculaExistente = await authService.consultarUsuarioPorMatricula(
      matricula
    );
    if (matriculaExistente) {
      return res.status(400).json({ error: "Matrícula já cadastrada!" });
    }
    const novoUsuario = await userService.inserirUsuario(
      nome,
      matricula,
      email,
      senha,
      id_perfil,
      id_loja
    );
    res.status(201).json(novoUsuario);
  } catch (erro) {
    console.error("Erro ao inserir usuário:", erro);
    res.status(500).json({ message: "Erro ao inserir usuário" });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const usuarios = await userService.consultarUsuarios();
    res.status(200).json({
      message: "Consulta de usuários realizada com sucesso!",
      usuarios,
    });
  } catch (erro) {
    console.error("Erro ao consultar usuários:", erro);
    res.status(500).json({ message: "Erro ao consultar usuários" });
  }
};

exports.updateUser = async (req, res) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { nome, email, senha, id_perfil, id_loja, novaMatricula } = req.body;
  const { matricula } = req.params;

  try {
    if (senha && typeof senha !== "string") {
      return res
        .status(400)
        .json({ message: "Senha deve ser uma string válida." });
    }

    const usuarioAtualizado = await userService.editarUsuario(
      matricula,
      nome,
      novaMatricula,
      email,
      senha,
      id_perfil,
      id_loja
    );

    if (usuarioAtualizado) {
      return res.status(200).json({
        message: "Usuário atualizado com sucesso!",
        usuario: usuarioAtualizado,
      });
    } else {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao editar usuário:", erro);
    return res.status(500).json({ message: "Erro ao editar usuário" });
  }
};

exports.deleteUser = async (req, res) => {
  const { matricula } = req.params;

  try {
    const usuarioDeletado = await userService.deletarUsuario(matricula);
    if (usuarioDeletado) {
      res.status(200).json({
        message: "Usuário deletado com sucesso!",
        usuario: usuarioDeletado,
      });
    } else {
      res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao deletar usuário:", erro);
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
};
