const pool = require("../config/database");

async function consultarStatusMovimentacao() {
  const query = `
    SELECT * FROM status_movimentacao;
  `;
  try {
    const resultado = await pool.query(query);
    return resultado.rows;
  } catch (erro) {
    console.error("Erro ao buscar status de movimentação: ", erro);
    throw erro;
  }
}

async function inserirStatusMovimentacao(status, descricao) {
  const query = `
    INSERT INTO status_movimentacao (status, descricao, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING *;
  `;
  const valores = [status, descricao];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao inserir status de movimentação:", erro);
    throw erro;
  }
}

async function editarStatusMovimentacao(
  id_status_movimentacao,
  status,
  descricao
) {
  const query = `
    UPDATE status_movimentacao
    SET status = $1, descricao = $2, updated_at = NOW()
    WHERE id_status_movimentacao = $3
    RETURNING *;
  `;
  const valores = [status, descricao, id_status_movimentacao];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao editar status de movimentação:", erro);
    throw erro;
  }
}

async function deletarStatusMovimentacao(id_status_movimentacao) {
  const query = `
    DELETE FROM status_movimentacao
    WHERE id_status_movimentacao = $1
    RETURNING *;
  `;
  try {
    const resultado = await pool.query(query, [id_status_movimentacao]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao deletar status de movimentação:", erro);
    throw erro;
  }
}

module.exports = {
  consultarStatusMovimentacao,
  inserirStatusMovimentacao,
  editarStatusMovimentacao,
  deletarStatusMovimentacao,
};
