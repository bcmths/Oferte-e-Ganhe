const userService = require("../services/userService");

exports.registerUser = async (req, res) => {
  const { nome, matricula, email, senha, id_perfil, id_loja } = req.body;
  try {
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
  const { nome, email, senha, id_perfil, id_loja } = req.body;
  const { matricula } = req.params;

  try {
    const usuarioAtualizado = await userService.editarUsuario(
      nome,
      matricula,
      email,
      senha,
      id_perfil,
      id_loja
    );
    if (usuarioAtualizado) {
      res.status(200).json({
        message: "Usuário atualizado com sucesso!",
        usuario: usuarioAtualizado,
      });
    } else {
      res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao editar usuário:", erro);
    res.status(500).json({ message: "Erro ao editar usuário" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioDeletado = await userService.deletarUsuario(id);
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
