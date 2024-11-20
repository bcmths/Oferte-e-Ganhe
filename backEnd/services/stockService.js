const pool = require("../config/database");

async function consultarEstoque() {
  const query = `SELECT * FROM estoque;`;
  try {
    const resultado = await pool.query(query);
    return resultado.rows;
  } catch (erro) {
    console.error("Erro ao buscar estoques: ", erro);
    throw erro;
  }
}

async function inserirEstoque(
  estoque_atual,
  estoque_minimo,
  estoque_recomendado,
  id_loja
) {
  const query = `
    INSERT INTO estoque (estoque_atual, estoque_minimo, estoque_recomendado, id_loja, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING *;
  `;
  const valores = [estoque_atual, estoque_minimo, estoque_recomendado, id_loja];
  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao inserir estoque: ", erro);
    throw erro;
  }
}

async function editarEstoque(
  id_estoque,
  estoque_atual,
  estoque_minimo,
  estoque_recomendado,
  id_loja
) {
  const query = `
    UPDATE estoque
    SET estoque_atual = $1, estoque_minimo = $2, estoque_recomendado = $3, id_loja = $4, updated_at = NOW()
    WHERE id_estoque = $5
    RETURNING *;
  `;
  const valores = [
    estoque_atual,
    estoque_minimo,
    estoque_recomendado,
    id_loja,
    id_estoque,
  ];
  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao editar estoque: ", erro);
    throw erro;
  }
}

async function deletarEstoque(id_estoque) {
  const query = `
    DELETE FROM estoque
    WHERE id_estoque = $1
    RETURNING *;
  `;
  try {
    const resultado = await pool.query(query, [id_estoque]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao deletar estoque: ", erro);
    throw erro;
  }
}

module.exports = {
  consultarEstoque,
  inserirEstoque,
  editarEstoque,
  deletarEstoque,
};
