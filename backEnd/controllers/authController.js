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

    const permissao = usuario.perfil.permissao;

    const token = jwt.sign(
      {
        matricula: usuario.matricula,
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        id_perfil: usuario.id_perfil,
        id_loja: usuario.id_loja,
        loja: usuario.loja.nome,
        permissoes: permissao.map((p) => ({
          modulo: p.modulo,
          tipo_permissao: p.tipo_permissao,
        })),
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      domain: "127.0.0.1",
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
    });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res
      .status(500)
      .json({ message: "Erro ao fazer login", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await authService.consultarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    await authService.atualizarSenha(usuario.id_usuario, senha);

    res.status(200).json({ message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error("Erro ao redefinir senha:", err);
    res
      .status(500)
      .json({ message: "Erro ao redefinir senha", error: err.message });
  }
};

module.exports = { register, login, resetPassword };
