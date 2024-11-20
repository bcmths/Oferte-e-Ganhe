const permissionService = require("../services/permissionService");

exports.getPermissoes = async (req, res) => {
  try {
    const permissoes = await permissionService.consultarPermissoes();
    res.status(200).json({
      message: "Consulta de permissões realizada com sucesso!",
      permissoes,
    });
  } catch (erro) {
    console.error("Erro ao consultar permissões:", erro);
    res.status(500).json({
      message: "Erro ao consultar permissões",
      error: erro.message,
    });
  }
};

exports.createPermissao = async (req, res) => {
  const { modulo, tipo_permissao } = req.body;
  try {
    const novaPermissao = await permissionService.inserirPermissao(modulo, tipo_permissao);
    res.status(201).json(novaPermissao);
  } catch (erro) {
    console.error("Erro ao inserir permissão:", erro);
    res.status(500).json({ message: "Erro ao inserir permissão" });
  }
};

exports.updatePermissao = async (req, res) => {
  const { id_permissao } = req.params;
  const { modulo, tipo_permissao } = req.body;

  try {
    const permissaoAtualizada = await permissionService.editarPermissao(id_permissao, modulo, tipo_permissao);
    if (permissaoAtualizada) {
      res.status(200).json({
        message: "Permissão atualizada com sucesso!",
        permissao: permissaoAtualizada,
      });
    } else {
      res.status(404).json({ message: "Permissão não encontrada." });
    }
  } catch (erro) {
    console.error("Erro ao editar permissão:", erro);
    res.status(500).json({
      message: "Erro ao editar permissão",
      error: erro.message,
    });
  }
};

exports.deletePermissao = async (req, res) => {
  const { id_permissao } = req.params;

  try {
    const permissaoDeletada = await permissionService.deletarPermissao(id_permissao);
    if (permissaoDeletada) {
      res.status(200).json({
        message: "Permissão deletada com sucesso!",
        permissao: permissaoDeletada,
      });
    } else {
      res.status(404).json({ message: "Permissão não encontrada." });
    }
  } catch (erro) {
    console.error("Erro ao deletar permissão:", erro);
    res.status(500).json({
      message: "Erro ao deletar permissão",
      error: erro.message,
    });
  }
};
