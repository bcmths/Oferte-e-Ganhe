const express = require("express");
const profileController = require("../controllers/profileController");
const verificaPermissoes = require("../middlewares/permissionMiddleware");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de perfis ativa");
});

router.post(
  "/cadastrar",
  verificaPermissoes("Perfis", "Edição"),
  profileController.createPerfil
);
router.get(
  "/all",
  verificaPermissoes("Perfis", "Leitura"),
  profileController.getPerfis
);
router.put(
  "/editar/:id_perfil",
  verificaPermissoes("Perfis", "Edição"),
  profileController.updatePerfil
);
router.delete(
  "/deletar/:id",
  verificaPermissoes("Perfis", "Edição"),
  profileController.deletePerfil
);

module.exports = router;
