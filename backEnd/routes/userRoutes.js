const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");

router.use(authenticateToken);

router.get("/", (req, res) => {
  res.send("Rota de usuários ativa");
});

router.post("/cadastrar", userController.registerUser);
router.get("/all", userController.listUsers);
router.put("/editar/:matricula", userController.updateUser);
router.delete("/deletar/:id", userController.deleteUser);

module.exports = router;
