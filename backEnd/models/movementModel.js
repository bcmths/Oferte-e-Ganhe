const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const StatusMovimentacao = require("./statusMovimentacaoModel");
const Solicitacao = require("./solicitacionModel");

const Movimentacoes = sequelize.define(
  "Movimentacoes",
  {
    id_movimentacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    remessa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo_movimentacao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_movimentacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    data_prevista: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: StatusMovimentacao,
        key: "id_status_movimentacao",
      },
      onDelete: "SET NULL",
    },
    id_solicitacao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Solicitacao,
        key: "id_solicitacao",
      },
      onDelete: "CASCADE",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "movimentacoes",
    timestamps: false,
  }
);

Movimentacoes.belongsTo(StatusMovimentacao, {
  foreignKey: "id_status",
  as: "status",
});

Movimentacoes.belongsTo(Solicitacao, {
  foreignKey: "id_solicitacao",
  as: "solicitacao",
});


module.exports = Movimentacoes;
