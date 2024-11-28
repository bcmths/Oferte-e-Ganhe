const express = require("express");
const solicitationController = require("../controllers/solicitationController");
const verificaPermissoes = require("../middlewares/permissionMiddleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de solicitações ativa");
});

router.post(
  "/cadastrar",
  verificaPermissoes("Solicitações", "Edição"),
  solicitationController.createSolicitacao
);
router.get(
  "/all",
  verificaPermissoes("Solicitações", "Leitura"),
  solicitationController.getSolicitacoes
);
router.put(
  "/editar/:id_solicitacao",
  verificaPermissoes("Solicitações", "Edição"),
  solicitationController.updateSolicitacao
);
router.delete(
  "/deletar/:id_solicitacao",
  verificaPermissoes("Solicitações", "Edição"),
  solicitationController.deleteSolicitacao
);

module.exports = router;
