const pool = require("../config/database");

async function consultarMovimentacoes() {
  const query = `SELECT * FROM movimentacoes;`;

  try {
    const resultado = await pool.query(query);
    return resultado.rows;
  } catch (erro) {
    console.error("Erro ao buscar movimentações: ", erro);
    throw erro;
  }
}

async function inserirMovimentacao(
  remessa,
  tipo_movimentacao,
  data_movimentacao,
  data_prevista,
  quantidade,
  id_status,
  id_solicitacao,
  id_usuario
) {
  const query = `
    INSERT INTO movimentacoes (remessa, tipo_movimentacao, data_movimentacao, data_prevista, quantidade, id_status, id_solicitacao, id_usuario, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    RETURNING *;
  `;
  const valores = [
    remessa,
    tipo_movimentacao,
    data_movimentacao,
    data_prevista,
    quantidade,
    id_status,
    id_solicitacao,
    id_usuario,
  ];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao inserir movimentação:", erro);
    throw erro;
  }
}

async function editarMovimentacao(
  id_movimentacao,
  remessa,
  tipo_movimentacao,
  data_movimentacao,
  data_prevista,
  quantidade,
  id_status,
  id_solicitacao,
  id_usuario
) {
  const query = `
    UPDATE movimentacoes
    SET remessa = $1, tipo_movimentacao = $2, data_movimentacao = $3, data_prevista = $4, quantidade = $5, id_status = $6, id_solicitacao = $7, id_usuario = $8, updated_at = NOW()
    WHERE id_movimentacao = $9
    RETURNING *;
  `;
  const valores = [
    remessa,
    tipo_movimentacao,
    data_movimentacao,
    data_prevista,
    quantidade,
    id_status,
    id_solicitacao,
    id_usuario,
    id_movimentacao,
  ];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao editar movimentação: ", erro);
    throw erro;
  }
}

async function deletarMovimentacao(id_movimentacao) {
  const query = `
    DELETE FROM movimentacoes
    WHERE id_movimentacao = $1
    RETURNING *;
  `;

  try {
    const resultado = await pool.query(query, [id_movimentacao]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao deletar movimentação: ", erro);
    throw erro;
  }
}

module.exports = {
  consultarMovimentacoes,
  inserirMovimentacao,
  editarMovimentacao,
  deletarMovimentacao,
};
