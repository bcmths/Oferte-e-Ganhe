const Permissao = require("../models/permissionModel");
const Perfil = require("../models/profileModel");
const Loja = require("../models/storeModel");
const Usuario = require("../models/userModel");
const bcrypt = require("bcryptjs");

async function consultarUsuarioPorEmail(email) {
  try {
    const usuario = await Usuario.findOne({
      where: { email },
      include: [
        {
          model: Perfil,
          as: "perfil",
          include: [
            {
              model: Permissao,
              as: "permissao",
              through: { attributes: [] },
            },
          ],
        },
        { model: Loja, as: "loja" },
      ],
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

async function atualizarSenha(id_usuario, novaSenha) {
  const senhaHash = await bcrypt.hash(novaSenha, 10);

  try {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    usuario.senha = senhaHash;
    await usuario.save();

    return usuario;
  } catch (erro) {
    console.error("Erro ao atualizar senha:", erro);
    throw erro;
  }
}

module.exports = {
  consultarUsuarioPorEmail,
  consultarUsuarioPorMatricula,
  inserirUsuario,
  atualizarSenha,
};
