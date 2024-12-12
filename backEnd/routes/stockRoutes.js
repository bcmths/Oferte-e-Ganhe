const express = require("express");
const stockController = require("../controllers/stockController");
const verificaPermissoes = require("../middlewares/permissionMiddleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de estoques ativa");
});

router.post(
  "/cadastrar",
  verificaPermissoes("Lojas", "Edição"),
  stockController.createStock
);
router.get(
  "/all",
  verificaPermissoes("Lojas", "Leitura"),
  stockController.getStocks
);
router.put(
  "/editar/:id_estoque",
  verificaPermissoes("Lojas", "Edição"),
  stockController.updateStock
);
router.delete(
  "/deletar/:id_estoque",
  verificaPermissoes("Lojas", "Edição"),
  stockController.deleteStock
);

module.exports = router;
