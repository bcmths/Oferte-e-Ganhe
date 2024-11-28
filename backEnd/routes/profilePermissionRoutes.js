const express = require("express");
const profilePermissionController = require("../controllers/profilePermissionController");
const verificaPermissoes = require("../middlewares/permissionMiddleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de associações de perfil e permissão ativa");
});

router.post(
  "/cadastrar",
  verificaPermissoes("Perfis", "Edição"),
  profilePermissionController.createPerfilPermissao
);
router.get(
  "/all",
  verificaPermissoes("Perfis", "Leitura"),
  profilePermissionController.getPerfilPermissao
);
router.put(
  "/editar/:id_perfil",
  verificaPermissoes("Perfis", "Edição"),
  profilePermissionController.updatePerfilPermissao
);
router.delete(
  "/deletar/:id_perfil/:id_permissao",
  verificaPermissoes("Perfis", "Edição"),
  profilePermissionController.deletePerfilPermissao
);

module.exports = router;
