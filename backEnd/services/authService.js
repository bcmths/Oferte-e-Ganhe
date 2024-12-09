const Usuario = require("../models/userModel");
const Perfil = require("../models/profileModel");
const Permissao = require("../models/permissionModel");
const Loja = require("../models/storeModel");
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

const salvarTokenDeRedefinicao = async (id_usuario, token) => {
  await Usuario.update(
    {
      reset_password_token: token,
      reset_password_expires: new Date(Date.now() + 10 * 60 * 1000),
    },
    { where: { id_usuario } }
  );
};

const consultarUsuarioPorToken = async (token) => {
  return await Usuario.findOne({
    where: {
      reset_password_token: token,
      reset_password_expires: { [Sequelize.Op.gt]: new Date() },
    },
  });
};

const removerTokenDeRedefinicao = async (id_usuario) => {
  await Usuario.update(
    {
      reset_password_token: null,
      reset_password_expires: null,
    },
    { where: { id_usuario } }
  );
};

const atualizarSenha = async (id_usuario, senha) => {
  const senhaHashed = await bcrypt.hash(senha, 10);
  await Usuario.update({ senha: senhaHashed }, { where: { id_usuario } });
};

module.exports = {
  consultarUsuarioPorEmail,
  salvarTokenDeRedefinicao,
  consultarUsuarioPorToken,
  removerTokenDeRedefinicao,
  atualizarSenha,
};
