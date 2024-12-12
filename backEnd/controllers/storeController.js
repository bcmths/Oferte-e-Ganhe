const storeService = require("../services/storeService");
const {
  createStoreSchema,
  updateStoreSchema,
} = require("../utils/storeSchema");

exports.createStore = async (req, res) => {
  const { error } = createStoreSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { cod_loja, nome, cidade } = req.body;
  try {
    const novaLoja = await storeService.inserirLoja(cod_loja, nome, cidade);
    res.status(201).json(novaLoja);
  } catch (erro) {
    console.error("Erro ao inserir loja:", erro);
    res.status(500).json({ message: "Erro ao inserir loja" });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const lojas = await storeService.consultarLojas();
    res.status(200).json({
      message: "Consulta de lojas realizada com sucesso!",
      lojas,
    });
  } catch (erro) {
    console.error("Erro ao consultar lojas:", erro);
    res.status(500).json({
      message: "Erro ao consultar lojas",
      error: erro.message,
    });
  }
};

exports.updateStore = async (req, res) => {
  const { error } = updateStoreSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { id_loja } = req.params;
  const { cod_loja, nome, cidade } = req.body;
  try {
    const lojaAtualizada = await storeService.editarLoja(
      id_loja,
      cod_loja,
      nome,
      cidade
    );
    if (lojaAtualizada) {
      res.status(200).json({
        message: "Loja atualizada com sucesso!",
        loja: lojaAtualizada,
      });
    } else {
      res.status(404).json({ message: "Loja não encontrada." });
    }
  } catch (erro) {
    console.error("Erro ao editar loja:", erro);
    res.status(500).json({
      message: "Erro ao editar loja",
      error: erro.message,
    });
  }
};

exports.deleteStore = async (req, res) => {
  const { id_loja } = req.params;
  try {
    const lojaDeletada = await storeService.deletarLoja(id_loja);
    if (lojaDeletada) {
      res.status(200).json({
        message: "Loja deletada com sucesso!",
        loja: lojaDeletada,
      });
    } else {
      res.status(404).json({ message: "Loja não encontrada." });
    }
  } catch (erro) {
    console.error("Erro ao deletar loja:", erro);
    res.status(500).json({
      message: "Erro ao deletar loja",
      error: erro.message,
    });
  }
};
