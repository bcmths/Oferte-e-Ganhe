const express = require("express");
const stockController = require("../controllers/stockController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de estoques ativa");
});

router.post("/cadastrar", stockController.createStock);
router.get("/all", stockController.getStocks);
router.put("/editar/:id_estoque", stockController.updateStock);
router.delete("/deletar/:id_estoque", stockController.deleteStock);

module.exports = router;
