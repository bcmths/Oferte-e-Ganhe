const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/login.html"));
});

router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/dashboard.html"));
});

router.get("/perfis", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/perfis.html"));
});

router.get("/cadastrarPerfil", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/public/cadastroPerfil.html")
  );
});

router.get("/usuarios", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/usuarios.html"));
});

router.get("/cadastrarUsuario", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/public/cadastroUsuario.html")
  );
});

router.get("/recuperacao", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/public/recuperacaoSenha.html")
  );
});

router.get("/redefinicao", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/public/redefinicaoSenha.html")
  );
});

router.get("/lojas", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/lojas.html"));
});

router.get("/cadastrarLoja", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/cadastroLoja.html"));
});

router.get("/taloes", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/taloes.html"));
});

router.get("/enviarTalao", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/envioTalao.html"));
});

router.get("/receberTalao", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/public/recebimentoTalao.html")
  );
});

router.get("/estoque", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/estoque.html"));
});

module.exports = router;
