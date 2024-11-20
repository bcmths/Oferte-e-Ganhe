const pool = require("../config/database");

async function consultarSolicitacoes() {
  const query = `
    SELECT * FROM solicitacoes;
  `;
  try {
    const resultado = await pool.query(query);
    return resultado.rows;
  } catch (erro) {
    console.error("Erro ao buscar solicitações: ", erro);
    throw erro;
  }
}

async function inserirSolicitacao(quantidade_taloes, id_status, id_usuario) {
  const query = `
    INSERT INTO solicitacoes (data_solicitacao, quantidade_taloes, id_status, id_usuario, created_at, updated_at)
    VALUES (NOW(), $1, $2, $3, NOW(), NOW())
    RETURNING *;
  `;
  const valores = [quantidade_taloes, id_status, id_usuario];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao inserir solicitação:", erro);
    throw erro;
  }
}

async function editarSolicitacao(
  id_solicitacao,
  data_solicitacao,
  quantidade_taloes,
  id_status,
  id_usuario
) {
  const query = `
    UPDATE solicitacoes
    SET data_solicitacao = $1, quantidade_taloes = $2, id_status = $3, id_usuario = $4, updated_at = NOW()
    WHERE id_solicitacao = $5
    RETURNING *;
  `;
  const valores = [
    data_solicitacao,
    quantidade_taloes,
    id_status,
    id_usuario,
    id_solicitacao,
  ];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao editar solicitação:", erro);
    throw erro;
  }
}

async function deletarSolicitacao(id_solicitacao) {
  const query = `
    DELETE FROM solicitacoes
    WHERE id_solicitacao = $1
    RETURNING *;
  `;
  try {
    const resultado = await pool.query(query, [id_solicitacao]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao deletar solicitação:", erro);
    throw erro;
  }
}

module.exports = {
  consultarSolicitacoes,
  inserirSolicitacao,
  editarSolicitacao,
  deletarSolicitacao,
};
