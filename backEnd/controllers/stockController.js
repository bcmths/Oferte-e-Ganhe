const stockService = require("../services/stockService");

exports.getStocks = async (req, res) => {
  try {
    const estoques = await stockService.consultarEstoque();
    res.status(200).json({
      message: "Consulta de estoques realizada com sucesso!",
      estoques,
    });
  } catch (erro) {
    console.error("Erro ao consultar estoques:", erro);
    res.status(500).json({
      message: "Erro ao consultar estoques",
      error: erro.message,
    });
  }
};

exports.createStock = async (req, res) => {
  const { estoque_atual, estoque_minimo, estoque_recomendado, id_loja } =
    req.body;
  try {
    const novoEstoque = await stockService.inserirEstoque(
      estoque_atual,
      estoque_minimo,
      estoque_recomendado,
      id_loja
    );
    res.status(200).json({
      message: "Estoque criado com sucesso!",
      novoEstoque,
    });
  } catch (erro) {
    console.error("Erro ao inserir estoque:", erro);
    res.status(500).json({ message: "Erro ao inserir estoque" });
  }
};

exports.updateStock = async (req, res) => {
  const { id_estoque } = req.params;
  const { estoque_atual, estoque_minimo, estoque_recomendado, id_loja } =
    req.body;
  try {
    const estoqueAtualizado = await stockService.editarEstoque(
      id_estoque,
      estoque_atual,
      estoque_minimo,
      estoque_recomendado,
      id_loja
    );
    if (estoqueAtualizado) {
      res.status(200).json({
        message: "Estoque atualizado com sucesso!",
        estoque: estoqueAtualizado,
      });
    } else {
      res.status(404).json({ message: "Estoque não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao editar estoque:", erro);
    res.status(500).json({
      message: "Erro ao editar estoque",
      error: erro.message,
    });
  }
};

exports.deleteStock = async (req, res) => {
  const { id_estoque } = req.params;
  try {
    const estoqueDeletado = await stockService.deletarEstoque(id_estoque);
    if (estoqueDeletado) {
      res.status(200).json({
        message: "Estoque deletado com sucesso!",
        estoque: estoqueDeletado,
      });
    } else {
      res.status(404).json({ message: "Estoque não encontrado." });
    }
  } catch (erro) {
    console.error("Erro ao deletar estoque:", erro);
    res.status(500).json({
      message: "Erro ao deletar estoque",
      error: erro.message,
    });
  }
};
