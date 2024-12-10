const verificaPermissoes = (modulo, tipoPermissao) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissoes) {
      return res.status(403).json({
        message: "Usuário não autenticado ou permissões não encontradas",
      });
    }

    const temPermissao = req.user.permissoes.some(
      (permissao) =>
        permissao.modulo === modulo &&
        permissao.tipo_permissao === tipoPermissao
    );

    if (temPermissao) {
      return next();
    }

    res.status(403).json({ message: "Você não tem acesso a este recurso" });
  };
};

module.exports = verificaPermissoes;
