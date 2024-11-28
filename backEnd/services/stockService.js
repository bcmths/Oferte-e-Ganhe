const Estoque = require("../models/stockModel");
const Loja = require("../models/storeModel");

async function consultarEstoque() {
  try {
    const estoques = await Estoque.findAll({
      include: { model: Loja, as: "loja" },
    });
    return estoques;
  } catch (erro) {
    console.error("Erro ao buscar estoques:", erro);
    throw erro;
  }
}

async function inserirEstoque(
  estoque_atual,
  estoque_minimo,
  estoque_recomendado,
  id_loja
) {
  try {
    const estoqueExistente = await Estoque.findOne({
      where: { id_loja },
    });

    if (estoqueExistente) {
      throw new Error("Já existe um estoque registrado para essa loja.");
    }

    const novoEstoque = await Estoque.create({
      estoque_atual,
      estoque_minimo,
      estoque_recomendado,
      id_loja,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return novoEstoque;
  } catch (erro) {
    console.error("Erro ao inserir estoque:", erro);
    throw erro;
  }
}

async function editarEstoque(
  id_estoque,
  estoque_atual,
  estoque_minimo,
  estoque_recomendado,
  id_loja
) {
  try {
    const estoque = await Estoque.findByPk(id_estoque);
    if (!estoque) {
      throw new Error("Estoque não encontrado");
    }

    estoque.estoque_atual = estoque_atual;
    estoque.estoque_minimo = estoque_minimo;
    estoque.estoque_recomendado = estoque_recomendado;
    estoque.id_loja = id_loja;
    estoque.updated_at = new Date();

    await estoque.save();
    return estoque;
  } catch (erro) {
    console.error("Erro ao editar estoque:", erro);
    throw erro;
  }
}

async function deletarEstoque(id_estoque) {
  try {
    const estoque = await Estoque.findByPk(id_estoque);
    if (!estoque) {
      throw new Error("Estoque não encontrado");
    }

    await estoque.destroy();
    return estoque;
  } catch (erro) {
    console.error("Erro ao deletar estoque:", erro);
    throw erro;
  }
}

module.exports = {
  consultarEstoque,
  inserirEstoque,
  editarEstoque,
  deletarEstoque,
};
