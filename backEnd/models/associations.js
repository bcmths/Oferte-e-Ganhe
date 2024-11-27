const Usuario = require("./userModel");
const Perfil = require("./profileModel");
const Loja = require("./storeModel");
const Movimentacoes = require("./movementModel");
const Permissao = require("./permissionModel");
const Solicitacao = require("./solicitacionModel");
const StatusMovimentacao = require("./statusMovimentacaoModel");
const StatusSolicitacao = require("./statusSolicitacaoModel");

const models = {
  Usuario,
  Perfil,
  Loja,
  Movimentacoes,
  Permissao,
  Solicitacao,
  StatusMovimentacao,
  StatusSolicitacao,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
