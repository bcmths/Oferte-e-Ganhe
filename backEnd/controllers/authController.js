const authService = require("../services/authService");
const sendEmail = require("../services/emailService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/userModel");
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
        perfil: usuario.perfil.nome,
        permissoes: permissao.map((p) => ({
          modulo: p.modulo,
          tipo_permissao: p.tipo_permissao,
        })),
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    await Usuario.update(
      { active_session_token: token },
      { where: { id_usuario: usuario.id_usuario } }
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

const logout = async (req, res) => {
  const token =
    req.cookies.authToken || req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res
        .status(400)
        .json({ message: "Token de autenticação ausente." });
    }

    const decoded = jwt.verify(token, jwtSecret);

    await Usuario.update(
      { active_session_token: null },
      { where: { id_usuario: decoded.id_usuario } }
    );

    res.clearCookie("authToken", { domain: "127.0.0.1" });
    res.status(200).json({ message: "Logout realizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao realizar logout:", err);
    res.status(500).json({ message: "Erro ao realizar logout." });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await authService.consultarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const token = jwt.sign({ id_usuario: usuario.id_usuario }, jwtSecret, {
      expiresIn: "10m",
    });

    await authService.salvarTokenDeRedefinicao(usuario.id_usuario, token);

    const resetLink = `http://127.0.0.1:5500/frontEnd/src/pages/redefinicaoSenha/redefinir.html?token=${token}`;
    await sendEmail({
      email,
      subject: "Redefinição de Senha",
      message: `Olá ${usuario.nome},\n\nClique no link abaixo para redefinir sua senha:\n\n${resetLink}\n\nEste link é válido por 10 minutos.\n\nAtenciosamente,\nEquipe`,
    });

    res
      .status(200)
      .json({ message: "E-mail de redefinição de senha enviado." });
  } catch (err) {
    console.error("Erro ao solicitar redefinição de senha:", err);
    res.status(500).json({
      message: "Erro ao solicitar redefinição de senha.",
      error: err.message,
    });
  }
};

const resetPasswordWithToken = async (req, res) => {
  const { token } = req.params;
  const { senha } = req.body;

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const usuario = await authService.consultarUsuarioPorToken(token);
    if (!usuario) {
      return res.status(400).json({ message: "Token inválido ou expirado." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (senhaValida) {
      return res
        .status(400)
        .json({ message: "A nova senha não pode ser igual à antiga." });
    }

    await authService.atualizarSenha(usuario.id_usuario, senha);

    await authService.removerTokenDeRedefinicao(usuario.id_usuario);

    res.status(200).json({ message: "Senha redefinida com sucesso." });
  } catch (err) {
    console.error("Erro ao redefinir senha com token:", err);
    res.status(400).json({
      message: "Erro ao redefinir senha com token.",
      error: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPasswordWithToken,
  logout,
};
