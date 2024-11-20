const express = require("express");
const router = express.Router();
const talonController = require("../controllers/talonController");

router.get("/", (req, res) => {
  res.send("Rota de movimentações ativa");
});

router.post("/cadastrar", talonController.createMovimentacao);
router.get("/all", talonController.getAllMovimentacoes);
router.put("/editar/:id_movimentacao", talonController.updateMovimentacao);
router.delete("/deletar/:id_movimentacao", talonController.deleteMovimentacao);

module.exports = router;
