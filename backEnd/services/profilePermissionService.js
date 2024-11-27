const { Perfil, Permissao } = require("../models/associations");

async function consultarPerfilPermissao() {
  try {
    const perfilPermissoes = await Perfil.findAll({
      include: {
        model: Permissao,
        as: "permissoes",
      },
    });
    return perfilPermissoes;
  } catch (erro) {
    console.error("Erro ao buscar associações de perfil e permissão:", erro);
    throw erro;
  }
}

async function inserirPerfilPermissao(id_perfil, id_permissao) {
  try {
    const perfil = await Perfil.findByPk(id_perfil);
    const permissao = await Permissao.findByPk(id_permissao);

    if (!perfil || !permissao) {
      throw new Error("Perfil ou Permissão não encontrado");
    }

    await perfil.addPermissao(permissao);

    return { id_perfil, id_permissao };
  } catch (erro) {
    console.error("Erro ao inserir associação de perfil e permissão:", erro);
    throw erro;
  }
}

async function editarPerfilPermissao(
  id_perfil,
  id_permissao,
  novo_id_permissao
) {
  try {
    const perfil = await Perfil.findByPk(id_perfil);
    const permissao = await Permissao.findByPk(id_permissao);
    const novaPermissao = await Permissao.findByPk(novo_id_permissao);

    if (!perfil || !permissao || !novaPermissao) {
      throw new Error("Perfil ou Permissão não encontrado");
    }

    await perfil.removePermissao(permissao);
    await perfil.addPermissao(novaPermissao);

    return { id_perfil, id_permissao, novo_id_permissao };
  } catch (erro) {
    console.error("Erro ao editar associação de perfil e permissão:", erro);
    throw erro;
  }
}

async function deletarPerfilPermissao(id_perfil, id_permissao) {
  try {
    const perfil = await Perfil.findByPk(id_perfil);
    const permissao = await Permissao.findByPk(id_permissao);

    if (!perfil || !permissao) {
      throw new Error("Perfil ou Permissão não encontrado");
    }

    await perfil.removePermissao(permissao);

    return { id_perfil, id_permissao };
  } catch (erro) {
    console.error("Erro ao deletar associação de perfil e permissão:", erro);
    throw erro;
  }
}

module.exports = {
  consultarPerfilPermissao,
  inserirPerfilPermissao,
  editarPerfilPermissao,
  deletarPerfilPermissao,
};
