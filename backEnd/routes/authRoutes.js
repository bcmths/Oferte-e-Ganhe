const express = require("express");
const router = express.Router();
const {
  register,
  login,
  requestPasswordReset,
  resetPasswordWithToken,
  logout,
} = require("../controllers/authController");
const validateSession = require("../middlewares/validateSessionMiddleware");

router.get("/", (req, res) => {
  res.send("Rota de autenticação ativa");
});
router.post("/cadastrar", register);
router.post("/login", login);
router.post("/redefinir-senha", requestPasswordReset);
router.post("/redefinir-senha/:token", resetPasswordWithToken);
router.post("/logout", validateSession, logout);

module.exports = router;
