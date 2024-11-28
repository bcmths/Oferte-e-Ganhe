const Perfil = require("../models/profileModel");
const Permissao = require("../models/permissionModel");
const PerfilPermissao = require("../models/profilePermissionModel");

async function consultarPerfilPermissao() {
  try {
    const perfilPermissoes = await PerfilPermissao.findAll({
      include: [
        {
          model: Perfil,
          as: "perfil",
          attributes: ["nome"],
        },
        {
          model: Permissao,
          as: "permissao",
          attributes: ["modulo", "tipo_permissao"],
        },
      ],
    });
    return perfilPermissoes;
  } catch (erro) {
    console.error("Erro ao buscar associações de perfil e permissão:", erro);
    throw erro;
  }
}
async function inserirPerfilPermissao(id_perfil, permissoes) {
  try {
    const perfil = await Perfil.findByPk(id_perfil);

    if (!perfil) {
      throw new Error("Perfil não encontrado");
    }

    for (let id_permissao of permissoes) {
      const permissao = await Permissao.findByPk(id_permissao);

      if (!permissao) {
        console.warn(
          `Permissão com id ${id_permissao} não encontrada e será ignorada.`
        );
        continue;
      }

      await perfil.addPermissao(permissao);
    }

    return { id_perfil, permissoes };
  } catch (erro) {
    console.error("Erro ao inserir associações de perfil e permissões:", erro);
    throw erro;
  }
}

async function editarPerfilPermissao(id_perfil, permissoes) {
  try {
    const perfil = await Perfil.findByPk(id_perfil);

    if (!perfil) {
      throw new Error("Perfil não encontrado");
    }

    const permissoesExistentes = await perfil.getPermissoes();

    const permissoesRemover = permissoesExistentes.filter(
      (p) => !permissoes.includes(p.id_permissao)
    );
    const permissoesAdicionar = permissoes.filter(
      (id_permissao) =>
        !permissoesExistentes.map((p) => p.id_permissao).includes(id_permissao)
    );

    for (let permissao of permissoesRemover) {
      await perfil.removePermissoes(permissao);
    }

    for (let id_permissao of permissoesAdicionar) {
      const permissao = await Permissao.findByPk(id_permissao);

      if (!permissao) {
        console.warn(
          `Permissão com id ${id_permissao} não encontrada e será ignorada.`
        );
        continue;
      }

      await perfil.addPermissoes(permissao);
    }

    return { id_perfil, permissoes };
  } catch (erro) {
    console.error("Erro ao editar associações de perfil e permissões:", erro);
    throw erro;
  }
}

async function deletarPerfilPermissao(id_perfil, id_permissao) {
  try {
    const perfil = await Perfil.findByPk(id_perfil);
    const permissao = await Permissao.findByPk(id_permissao);

    if (!perfil || !permissao) {
      throw new Error("Perfil ou Permissão não encontrado");
    }

    await perfil.removePermissao(permissao);

    return { id_perfil, id_permissao };
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
