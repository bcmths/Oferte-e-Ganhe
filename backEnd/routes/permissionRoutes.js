const express = require("express");
const permissionController = require("../controllers/permissionController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Rota de permissões ativa");
});

router.post("/cadastrar", permissionController.createPermissao);
router.get("/all", permissionController.getPermissoes);
router.put("/editar/:id_permissao", permissionController.updatePermissao);
router.delete("/deletar/:id_permissao", permissionController.deletePermissao);

module.exports = router;
