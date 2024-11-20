const express = require("express");
const statusSolicitacaoController = require("../controllers/statusSolicitacaoController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de status de solicitação ativa");
});

router.post("/cadastrar", statusSolicitacaoController.createStatusSolicitacao);
router.get("/all", statusSolicitacaoController.getStatusSolicitacao);
router.put(
  "/editar/:id_status_solicitacao",
  statusSolicitacaoController.updateStatusSolicitacao
);
router.delete(
  "/deletar/:id_status_solicitacao",
  statusSolicitacaoController.deleteStatusSolicitacao
);

module.exports = router;
