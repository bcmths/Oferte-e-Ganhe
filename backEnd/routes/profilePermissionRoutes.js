const express = require("express");
const profilePermissionController = require("../controllers/profilePermissionController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de associações de perfil e permissão ativa");
});

router.post("/cadastrar", profilePermissionController.createPerfilPermissao);
router.get("/all", profilePermissionController.getPerfilPermissao);
router.put(
  "/editar/:id_perfil",
  profilePermissionController.updatePerfilPermissao
);
router.delete(
  "/deletar/:id_perfil/:id_permissao",
  profilePermissionController.deletePerfilPermissao
);

module.exports = router;
