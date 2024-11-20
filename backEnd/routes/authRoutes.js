const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../config/database");

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const query = `SELECT * FROM Usuario WHERE email = $1`;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    const usuario = result.rows[0];

    const validPassword = await bcrypt.compare(senha, usuario.senha);
    if (!validPassword) {
      return res.status(401).json({ message: "Senha inválida!" });
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, email: usuario.email },
      process.env.JWT_SECRET || "seu-segredo",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login bem-sucedido!", token });
  } catch (erro) {
    console.error(erro);
    res
      .status(500)
      .json({ message: "Erro ao realizar login", error: erro.message });
  }
});

module.exports = router;
