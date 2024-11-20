const express = require("express");
const profileController = require("../controllers/profileController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de perfis ativa");
});

router.post("/cadastrar", profileController.createPerfil);
router.get("/all", profileController.getPerfis);
router.put("/editar/:id_perfil", profileController.updatePerfil);
router.delete("/deletar/:id", profileController.deletePerfil);

module.exports = router;
