const pool = require("../config/database");

async function consultarPerfis() {
  const query = `
    SELECT * FROM perfil;
  `;
  try {
    const resultado = await pool.query(query);
    return resultado.rows;
  } catch (erro) {
    console.error("Erro ao buscar perfis: ", erro);
    throw erro;
  }
}

async function inserirPerfil(nome) {
  const query = `
    INSERT INTO perfil (nome, created_at, updated_at)
    VALUES ($1, NOW(), NOW())
    RETURNING *;
  `;
  const valores = [nome];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao inserir perfil:", erro);
    throw erro;
  }
}

async function editarPerfil(id_perfil, nome) {
  const query = `
    UPDATE perfil
    SET nome = $1, updated_at = NOW()
    WHERE id_perfil = $2
    RETURNING *;
  `;
  const valores = [nome, id_perfil];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao editar perfil:", erro);
    throw erro;
  }
}

async function deletarPerfil(id_perfil) {
  const query = `
    DELETE FROM perfil
    WHERE id_perfil = $1
    RETURNING *;
  `;
  try {
    const resultado = await pool.query(query, [id_perfil]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao deletar perfil:", erro);
    throw erro;
  }
}

module.exports = {
  consultarPerfis,
  inserirPerfil,
  editarPerfil,
  deletarPerfil,
};
