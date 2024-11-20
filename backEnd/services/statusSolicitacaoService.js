const pool = require("../config/database");

async function consultarStatusSolicitacao() {
  const query = `
    SELECT * FROM status_solicitacao;
  `;
  try {
    const resultado = await pool.query(query);
    return resultado.rows;
  } catch (erro) {
    console.error("Erro ao buscar status de solicitação: ", erro);
    throw erro;
  }
}

async function inserirStatusSolicitacao(status, descricao) {
  const query = `
    INSERT INTO status_solicitacao (status, descricao, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING *;
  `;
  const valores = [status, descricao];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao inserir status de solicitação:", erro);
    throw erro;
  }
}

async function editarStatusSolicitacao(
  id_status_solicitacao,
  status,
  descricao
) {
  const query = `
    UPDATE status_solicitacao
    SET status = $1, descricao = $2, updated_at = NOW()
    WHERE id_status_solicitacao = $3
    RETURNING *;
  `;
  const valores = [status, descricao, id_status_solicitacao];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao editar status de solicitação:", erro);
    throw erro;
  }
}

async function deletarStatusSolicitacao(id_status_solicitacao) {
  const query = `
    DELETE FROM status_solicitacao
    WHERE id_status_solicitacao = $1
    RETURNING *;
  `;
  try {
    const resultado = await pool.query(query, [id_status_solicitacao]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao deletar status de solicitação:", erro);
    throw erro;
  }
}

module.exports = {
  consultarStatusSolicitacao,
  inserirStatusSolicitacao,
  editarStatusSolicitacao,
  deletarStatusSolicitacao,
};
