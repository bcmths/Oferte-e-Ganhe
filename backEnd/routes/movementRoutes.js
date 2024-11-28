const express = require("express");
const router = express.Router();
const movementController = require("../controllers/movementController");
const verificaPermissoes = require("../middlewares/permissionMiddleware");

router.get("/", (req, res) => {
  res.send("Rota de movimentações ativa");
});

router.post(
  "/cadastrar",
  verificaPermissoes("Movimentações", "Edição"),
  movementController.createMovimentacao
);
router.get(
  "/all",
  verificaPermissoes("Movimentações", "Leitura"),
  movementController.getAllMovimentacoes
);
router.put(
  "/editar/:id_movimentacao",
  verificaPermissoes("Movimentações", "Edição"),
  movementController.updateMovimentacao
);
router.delete(
  "/deletar/:id_movimentacao",
  verificaPermissoes("Movimentações", "Edição"),
  movementController.deleteMovimentacao
);

module.exports = router;
