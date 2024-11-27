const { Permissao } = require("../models/associations");

async function consultarPermissoes() {
  try {
    const permissoes = await Permissao.findAll();
    return permissoes;
  } catch (erro) {
    console.error("Erro ao buscar permissões:", erro);
    throw erro;
  }
}

async function inserirPermissao(modulo, tipo_permissao) {
  try {
    const novaPermissao = await Permissao.create({
      modulo,
      tipo_permissao,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return novaPermissao;
  } catch (erro) {
    console.error("Erro ao inserir permissão:", erro);
    throw erro;
  }
}

async function editarPermissao(id_permissao, modulo, tipo_permissao) {
  try {
    const permissao = await Permissao.findByPk(id_permissao);
    if (!permissao) {
      throw new Error("Permissão não encontrada");
    }

    permissao.modulo = modulo;
    permissao.tipo_permissao = tipo_permissao;
    permissao.updated_at = new Date();

    await permissao.save();
    return permissao;
  } catch (erro) {
    console.error("Erro ao editar permissão:", erro);
    throw erro;
  }
}

async function deletarPermissao(id_permissao) {
  try {
    const permissao = await Permissao.findByPk(id_permissao);
    if (!permissao) {
      throw new Error("Permissão não encontrada");
    }

    await permissao.destroy();
    return permissao;
  } catch (erro) {
    console.error("Erro ao deletar permissão:", erro);
    throw erro;
  }
}

module.exports = {
  consultarPermissoes,
  inserirPermissao,
  editarPermissao,
  deletarPermissao,
};
