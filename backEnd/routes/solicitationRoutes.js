const express = require("express");
const solicitationController = require("../controllers/solicitationController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de solicitações ativa");
});

router.post("/cadastrar", solicitationController.createSolicitacao);
router.get("/all", solicitationController.getSolicitacoes);
router.put("/editar/:id_solicitacao", solicitationController.updateSolicitacao);
router.delete(
  "/deletar/:id_solicitacao",
  solicitationController.deleteSolicitacao
);

module.exports = router;
