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
  matriculaAtual,
  nome,
  novaMatricula,
  email,
  senha,
  id_perfil,
  id_loja
) {
  try {
    const valoresAtualizados = { nome, email, id_perfil, id_loja };

    if (novaMatricula) {
      valoresAtualizados.matricula = novaMatricula;
    }

    if (senha) {
      if (typeof senha !== "string") {
        throw new Error("Senha deve ser uma string válida.");
      }
      console.log("Senha recebida para hashing:", senha);
      valoresAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    const [linhasAfetadas, [usuarioAtualizado]] = await Usuario.update(
      valoresAtualizados,
      {
        where: { matricula: matriculaAtual },
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

async function deletarUsuario(matricula) {
  if (!matricula) {
    throw new Error("Matrícula não fornecida para exclusão.");
  }

  try {
    const usuarioDeletado = await Usuario.destroy({
      where: { matricula },
    });

    if (!usuarioDeletado) {
      throw new Error(
        `Usuário com matrícula ${matricula} não encontrado para exclusão.`
      );
    }
    return {
      mensagem: `Usuário com matrícula ${matricula} deletado com sucesso.`,
    };
  } catch (erro) {
    console.error(`Erro ao deletar usuário com matrícula ${matricula}:`, erro);
    throw erro;
  }
}

module.exports = {
  consultarUsuarios,
  inserirUsuario,
  editarUsuario,
  deletarUsuario,
};
