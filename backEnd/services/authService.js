const Usuario = require("../models/userModel");
const bcrypt = require("bcryptjs");

async function consultarUsuarioPorEmail(email) {
  try {
    const usuario = await Usuario.findOne({
      where: { email },
    });
    return usuario;
  } catch (erro) {
    console.error("Erro ao consultar usuário por email:", erro);
    throw erro;
  }
}

async function consultarUsuarioPorMatricula(matricula) {
  try {
    const usuario = await Usuario.findOne({
      where: { matricula },
    });
    return usuario;
  } catch (erro) {
    console.error("Erro ao consultar usuário por matrícula:", erro);
    throw erro;
  }
}

async function inserirUsuario(
  nome,
  matricula,
  email,
  senha,
  id_loja,
  id_perfil
) {
  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    const novoUsuario = await Usuario.create({
      nome,
      matricula,
      email,
      senha: senhaHash,
      id_loja,
      id_perfil,
    });

    return novoUsuario;
  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);
    throw erro;
  }
}

module.exports = {
  consultarUsuarioPorEmail,
  consultarUsuarioPorMatricula,
  inserirUsuario,
};
