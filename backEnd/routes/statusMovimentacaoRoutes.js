const express = require("express");
const statusMovimentacaoController = require("../controllers/statusMovimentacaoController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de status de movimentação ativa");
});

router.post(
  "/cadastrar",
  statusMovimentacaoController.createStatusMovimentacao
);
router.get("/all", statusMovimentacaoController.getStatusMovimentacao);
router.put(
  "/editar/:id_status_movimentacao",
  statusMovimentacaoController.updateStatusMovimentacao
);
router.delete(
  "/deletar/:id_status_movimentacao",
  statusMovimentacaoController.deleteStatusMovimentacao
);

module.exports = router;
