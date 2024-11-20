const pool = require("../config/database");

async function consultarUsuarios() {
  const query = `SELECT * FROM usuario;`;

  try {
    const resultado = await pool.query(query);
    return resultado.rows;
  } catch (erro) {
    console.error("Erro ao buscar usuários: ", erro);
    throw erro;
  }
}

async function inserirUsuario(
  nome,
  matricula,
  email,
  senha,
  id_perfil,
  id_loja
) {
  const query = `
    INSERT INTO usuario (nome, matricula, email, senha, id_perfil, id_loja, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING *;
  `;

  const valores = [nome, matricula, email, senha, id_perfil, id_loja];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao inserir usuário:", erro);
    throw erro;
  }
}

async function editarUsuario(
  nome,
  matricula,
  email,
  senha,
  id_perfil,
  id_loja
) {
  const query = `
    UPDATE usuario
    SET nome = $1, email = $2, senha = $3, id_perfil = $4, id_loja = $5, updated_at = NOW()
    WHERE matricula = $6
    RETURNING *;
  `;

  const valores = [nome, email, senha, id_perfil, id_loja, matricula];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao editar usuário:", erro);
    throw erro;
  }
}

async function deletarUsuario(id) {
  const query = `
    DELETE FROM usuario
    WHERE id_usuario = $1
    RETURNING *;
  `;

  try {
    const resultado = await pool.query(query, [id]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao deletar usuário:", erro);
    throw erro;
  }
}

module.exports = {
  consultarUsuarios,
  inserirUsuario,
  editarUsuario,
  deletarUsuario,
};
