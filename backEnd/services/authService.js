const pool = require("../config/database");
const bcrypt = require("bcryptjs");

async function consultarUsuarioPorEmail(email) {
  const query = `
      SELECT * 
      FROM usuario
      WHERE email = $1;
    `;

  try {
    const resultado = await pool.query(query, [email]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao consultar usuário por email:", erro);
    throw erro;
  }
}

async function consultarUsuarioPorMatricula(matricula) {
  const query = `
      SELECT * 
      FROM usuario
      WHERE matricula = $1;
    `;

  try {
    const resultado = await pool.query(query, [matricula]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao consultar usuário por matrícula:", erro);
    throw erro;
  }
}

async function inserirUsuario(
  nome,
  matricula,
  email,
  senha,
  id_loja,
  id_perfil
) {
  const senhaHash = await bcrypt.hash(senha, 10);
  const query = `
    INSERT INTO usuario (nome, matricula, email, senha, id_loja, id_perfil, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING *;
  `;

  const valores = [nome, matricula, email, senhaHash, id_loja, id_perfil];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);
    throw erro;
  }
}

module.exports = {
  consultarUsuarioPorEmail,
  consultarUsuarioPorMatricula,
  inserirUsuario,
};
