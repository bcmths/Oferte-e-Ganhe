const express = require("express");
const permissionController = require("../controllers/permissionController");
const verificaPermissoes = require("../middlewares/permissionMiddleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de permissões ativa");
});

router.post(
  "/cadastrar",
  verificaPermissoes("Perfis", "Edição"),
  permissionController.createPermissao
);
router.get(
  "/all",
  verificaPermissoes("Perfis", "Leitura"),
  permissionController.getPermissoes
);
router.put(
  "/editar/:id_permissao",
  verificaPermissoes("Perfis", "Edição"),
  permissionController.updatePermissao
);
router.delete(
  "/deletar/:id_permissao",
  verificaPermissoes("Perfis", "Edição"),
  permissionController.deletePermissao
);

module.exports = router;
