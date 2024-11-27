const Perfil = require("../models/profileModel"); 


async function consultarPerfis() {
  try {
    const perfis = await Perfil.findAll(); 
    return perfis;
  } catch (erro) {
    console.error("Erro ao buscar perfis:", erro);
    throw erro;
  }
}


async function inserirPerfil(nome) {
  try {
    const novoPerfil = await Perfil.create({
      nome,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return novoPerfil;
  } catch (erro) {
    console.error("Erro ao inserir perfil:", erro);
    throw erro;
  }
}


async function editarPerfil(id_perfil, nome) {
  try {
    const perfil = await Perfil.findByPk(id_perfil); 
    if (!perfil) {
      throw new Error("Perfil não encontrado");
    }

    perfil.nome = nome;
    perfil.updated_at = new Date();

    await perfil.save(); 
    return perfil;
  } catch (erro) {
    console.error("Erro ao editar perfil:", erro);
    throw erro;
  }
}


async function deletarPerfil(id_perfil) {
  try {
    const perfil = await Perfil.findByPk(id_perfil); 
    if (!perfil) {
      throw new Error("Perfil não encontrado");
    }

    await perfil.destroy(); 
    return perfil;
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
