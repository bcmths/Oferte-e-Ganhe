const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");
const verificaPermissoes = require("../middlewares/permissionMiddleware");

router.use(authenticateToken);

router.get("/", verificaPermissoes("Usuário", "Leitura"), (req, res) => {
  res.send("Rota de usuários ativa");
});

router.post(
  "/cadastrar",
  verificaPermissoes("Usuário", "Edição"),
  userController.registerUser
);

router.get(
  "/all",
  verificaPermissoes("Usuário", "Leitura"),
  userController.listUsers
);

router.put(
  "/editar/:matricula",
  verificaPermissoes("Usuário", "Edição"),
  userController.updateUser
);

router.delete(
  "/deletar/:matricula",
  verificaPermissoes("Usuário", "Edição"),
  userController.deleteUser
);

module.exports = router;
