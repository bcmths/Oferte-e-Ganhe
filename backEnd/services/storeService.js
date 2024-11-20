const pool = require("../config/database");

async function consultarLojas() {
  const query = `
    SELECT * FROM loja;
  `;
  try {
    const resultado = await pool.query(query);
    return resultado.rows;
  } catch (erro) {
    console.error("Erro ao buscar lojas: ", erro);
    throw erro;
  }
}

async function inserirLoja(nome, cidade) {
  const query = `
    INSERT INTO loja (nome, cidade, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING *;
  `;
  const valores = [nome, cidade];
  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao inserir loja:", erro);
    throw erro;
  }
}

async function editarLoja(id_loja, nome, cidade) {
  const query = `
    UPDATE loja
    SET nome = $1, cidade = $2, updated_at = NOW()
    WHERE id_loja = $3
    RETURNING *;
  `;
  const valores = [nome, cidade, id_loja];
  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao editar loja:", erro);
    throw erro;
  }
}

async function deletarLoja(id_loja) {
  const query = `
    DELETE FROM loja
    WHERE id_loja = $1
    RETURNING *;
  `;
  try {
    const resultado = await pool.query(query, [id_loja]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao deletar loja:", erro);
    throw erro;
  }
}

module.exports = {
  consultarLojas,
  inserirLoja,
  editarLoja,
  deletarLoja,
};
