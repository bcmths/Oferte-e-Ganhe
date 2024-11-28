const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Permissao = require("./permissionModel");
const PerfilPermissao = require("./profilePermissionModel");

const Perfil = sequelize.define(
  "Perfil",
  {
    id_perfil: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
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
    tableName: "perfil",
    timestamps: false,
  }
);

module.exports = Perfil;
