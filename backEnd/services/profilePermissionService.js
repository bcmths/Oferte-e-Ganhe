const pool = require("../config/database");

async function consultarPerfilPermissao() {
  const query = `SELECT * FROM perfil_permissao;`;

  try {
    const resultado = await pool.query(query);
    return resultado.rows;
  } catch (erro) {
    console.error("Erro ao buscar associações de perfil e permissão: ", erro);
    throw erro;
  }
}

async function inserirPerfilPermissao(id_perfil, id_permissao) {
  const query = `
    INSERT INTO perfil_permissao (id_perfil, id_permissao, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING *;
  `;

  const valores = [id_perfil, id_permissao];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao inserir associação de perfil e permissão:", erro);
    throw erro;
  }
}

async function editarPerfilPermissao(
  id_perfil,
  id_permissao,
  novo_id_permissao
) {
  const query = `
    UPDATE perfil_permissao
    SET id_permissao = $3, updated_at = NOW()
    WHERE id_perfil = $1 AND id_permissao = $2
    RETURNING *;
  `;

  const valores = [id_perfil, id_permissao, novo_id_permissao];

  try {
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao editar associação de perfil e permissão:", erro);
    throw erro;
  }
}

async function deletarPerfilPermissao(id_perfil, id_permissao) {
  const query = `
    DELETE FROM perfil_permissao
    WHERE id_perfil = $1 AND id_permissao = $2
    RETURNING *;
  `;

  try {
    const resultado = await pool.query(query, [id_perfil, id_permissao]);
    return resultado.rows[0];
  } catch (erro) {
    console.error("Erro ao deletar associação de perfil e permissão:", erro);
    throw erro;
  }
}

module.exports = {
  consultarPerfilPermissao,
  inserirPerfilPermissao,
  editarPerfilPermissao,
  deletarPerfilPermissao,
};
