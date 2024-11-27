const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("../models/userModel");
const StatusSolicitacao = require("../models/statusSolicitacaoModel");

const Solicitacao = sequelize.define(
  "Solicitacao",
  {
    id_solicitacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data_solicitacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    quantidade_taloes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_status_solicitacao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: StatusSolicitacao,
        key: "id_status_solicitacao",
      },
      onDelete: "SET NULL",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id_usuario",
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
    tableName: "solicitacoes",
    timestamps: false,
  }
);

Solicitacao.belongsTo(StatusSolicitacao, {
  foreignKey: "id_status_solicitacao",
  as: "status",
});

Solicitacao.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

StatusSolicitacao.hasMany(Solicitacao, { foreignKey: "id_status_solicitacao" });
Usuario.hasMany(Solicitacao, { foreignKey: "id_usuario" });

module.exports = Solicitacao;
