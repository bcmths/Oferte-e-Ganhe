const express = require("express");
const router = express.Router();
const {
  register,
  login,
  resetPassword,
} = require("../controllers/authController");

router.post("/cadastrar", register);
router.post("/login", login);
router.patch("/trocar-senha", resetPassword);

module.exports = router;
