const Loja = require("../models/storeModel");

async function consultarLojas() {
  try {
    const lojas = await Loja.findAll();
    return lojas;
  } catch (erro) {
    console.error("Erro ao buscar lojas:", erro);
    throw erro;
  }
}

async function inserirLoja(nome, cidade) {
  try {
    const novaLoja = await Loja.create({
      nome,
      cidade,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return novaLoja;
  } catch (erro) {
    console.error("Erro ao inserir loja:", erro);
    throw erro;
  }
}

async function editarLoja(id_loja, nome, cidade) {
  try {
    const loja = await Loja.findByPk(id_loja);
    if (!loja) {
      throw new Error("Loja não encontrada");
    }

    loja.nome = nome;
    loja.cidade = cidade;
    loja.updated_at = new Date();

    await loja.save();
    return loja;
  } catch (erro) {
    console.error("Erro ao editar loja:", erro);
    throw erro;
  }
}

async function deletarLoja(id_loja) {
  try {
    const loja = await Loja.findByPk(id_loja);
    if (!loja) {
      throw new Error("Loja não encontrada");
    }

    await loja.destroy();
    return loja;
  } catch (erro) {
    console.error("Erro ao deletar loja:", erro);
    throw erro;
  }
}

module.exports = {
  consultarLojas,
  inserirLoja,
  editarLoja,
  deletarLoja,
};
