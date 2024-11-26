const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StatusMovimentacao = sequelize.define(
  "StatusMovimentacao",
  {
    id_status_movimentacao: {
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
    tableName: "status_movimentacao",
    timestamps: false,
  }
);

module.exports = StatusMovimentacao;
