const express = require("express");
const router = express.Router();
const {
  register,
  login,
  resetPassword,
} = require("../controllers/authController");

router.get("/", (req, res) => {
  res.send("Rota de autenticação ativa");
});
router.post("/cadastrar", register);
router.post("/login", login);
router.patch("/trocar-senha", resetPassword);

module.exports = router;
