const Usuario = require("../models/userModel");
const Perfil = require("../models/profileModel");
const Loja = require("../models/storeModel");
const bcrypt = require("bcryptjs");

async function consultarUsuarios() {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        {
          model: Perfil,
          as: "perfil",
        },
        {
          model: Loja,
          as: "loja",
        },
      ],
    });
    return usuarios;
  } catch (erro) {
    console.error("Erro ao buscar usuários: ", erro);
    throw erro;
  }
}

async function inserirUsuario(
  nome,
  matricula,
  email,
  senha,
  id_perfil,
  id_loja
) {
  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      matricula,
      email,
      senha: senhaHash,
      id_perfil,
      id_loja,
    });

    return novoUsuario;
  } catch (erro) {
    console.error("Erro ao inserir usuário:", erro);
    throw erro;
  }
}

async function editarUsuario(
  id_usuario,
  nome,
  matricula,
  email,
  senha,
  id_perfil,
  id_loja
) {
  try {
    const valoresAtualizados = { nome, matricula, email, id_perfil, id_loja };
    if (senha) {
      valoresAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    const [linhasAfetadas, [usuarioAtualizado]] = await Usuario.update(
      valoresAtualizados,
      {
        where: { id_usuario },
        returning: true,
      }
    );

    if (linhasAfetadas === 0) {
      throw new Error("Usuário não encontrado para atualização.");
    }

    return usuarioAtualizado;
  } catch (erro) {
    console.error("Erro ao editar usuário:", erro);
    throw erro;
  }
}

async function deletarUsuario(id_usuario) {
  try {
    const usuarioDeletado = await Usuario.destroy({
      where: { id_usuario },
    });

    if (!usuarioDeletado) {
      throw new Error("Usuário não encontrado para exclusão.");
    }

    return { mensagem: "Usuário deletado com sucesso." };
  } catch (erro) {
    console.error("Erro ao deletar usuário:", erro);
    throw erro;
  }
}

module.exports = {
  consultarUsuarios,
  inserirUsuario,
  editarUsuario,
  deletarUsuario,
};
