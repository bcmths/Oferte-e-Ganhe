const authService = require("../services/authService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const register = async (req, res) => {
  const { nome, matricula, email, senha, id_loja, id_perfil } = req.body;

  try {
    const emailExistente = await authService.consultarUsuarioPorEmail(email);
    if (emailExistente) {
      return res.status(400).json({ message: "E-mail já cadastrado!" });
    }

    const matriculaExistente = await authService.consultarUsuarioPorMatricula(
      matricula
    );
    if (matriculaExistente) {
      return res.status(400).json({ message: "Matrícula já cadastrada!" });
    }

    const novoUsuario = await authService.inserirUsuario(
      nome,
      matricula,
      email,
      senha,
      id_loja,
      id_perfil
    );

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      usuario: novoUsuario,
    });
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res
      .status(500)
      .json({ message: "Erro ao registrar usuário", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await authService.consultarUsuarioPorEmail(email);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ message: "Senha inválida." });
    }

    const token = jwt.sign(
      {
        matricula: usuario.matricula,
        id_perfil: usuario.id_perfil,
        id_loja: usuario.id_loja,
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    console.log(token);
    

    res.status(200).json({ token });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res
      .status(500)
      .json({ message: "Erro ao fazer login", error: err.message });
  }
};

module.exports = { register, login };
