const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StatusSolicitacao = sequelize.define(
  "StatusSolicitacao",
  {
    id_status_solicitacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "status_solicitacao",
    timestamps: false,
  }
);

module.exports = StatusSolicitacao;
