const express = require("express");
const router = express.Router();
const movementController = require("../controllers/movementController");

router.get("/", (req, res) => {
  res.send("Rota de movimentações ativa");
});

router.post("/cadastrar", movementController.createMovimentacao);
router.get("/all", movementController.getAllMovimentacoes);
router.put("/editar/:id_movimentacao", movementController.updateMovimentacao);
router.delete("/deletar/:id_movimentacao", movementController.deleteMovimentacao);

module.exports = router;
