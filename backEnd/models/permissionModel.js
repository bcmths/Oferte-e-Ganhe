const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Permissao = sequelize.define(
  "Permissao",
  {
    id_permissao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    modulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo_permissao: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "permissao",
    timestamps: false,
  }
);

module.exports = Permissao;
