const pool = require("../config/database");

async function consultarPermissoes() {
  const query = `SELECT * FROM permissao;`;

  try {
    const resultado = await pool.query(query);
    return resultado.rows;
  } catch (erro) {
    console.error("Erro ao buscar permissões:", erro);
    throw erro;
  }
}

async function inserirPermissao(modulo, tipo_permissao) {
  const query = `
    INSERT INTO permissao (modulo, tipo_permissao, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING *;
  `;

  const valores = [modulo, tipo_permissao];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao inserir permissão:", erro);
    throw erro;
  }
}

async function editarPermissao(id_permissao, modulo, tipo_permissao) {
  const query = `
    UPDATE permissao
    SET modulo = $1, tipo_permissao = $2, updated_at = NOW()
    WHERE id_permissao = $3
    RETURNING *;
  `;

  const valores = [modulo, tipo_permissao, id_permissao];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao editar permissão:", erro);
    throw erro;
  }
}

async function deletarPermissao(id_permissao) {
  const query = `
    DELETE FROM permissao
    WHERE id_permissao = $1
    RETURNING *;
  `;

  try {
    const resultado = await pool.query(query, [id_permissao]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao deletar permissão:", erro);
    throw erro;
  }
}

module.exports = {
  consultarPermissoes,
  inserirPermissao,
  editarPermissao,
  deletarPermissao,
};
