const express = require("express");
const solicitationController = require("../controllers/solicitationController");
const verificaPermissoes = require("../middlewares/permissionMiddleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de solicitações ativa");
});

router.post(
  "/cadastrar",
  verificaPermissoes("Movimentações", "Edição"),
  solicitationController.createSolicitacao
);
router.get(
  "/all",
  verificaPermissoes("Movimentações", "Leitura"),
  solicitationController.getSolicitacoes
);
router.put(
  "/editar/:id_solicitacao",
  verificaPermissoes("Movimentações", "Edição"),
  solicitationController.updateSolicitacao
);
router.delete(
  "/deletar/:id_solicitacao",
  verificaPermissoes("Movimentações", "Edição"),
  solicitationController.deleteSolicitacao
);

module.exports = router;
