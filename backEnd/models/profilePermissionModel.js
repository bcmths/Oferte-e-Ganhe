const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Perfil = require("./profileModel");
const Permissao = require("./permissionModel");

const PerfilPermissao = sequelize.define(
  "PerfilPermissao",
  {
    id_perfil: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Perfil,
        key: "id_perfil",
      },
    },
    id_permissao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Permissao,
        key: "id_permissao",
      },
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
    tableName: "perfil_permissao",
    timestamps: false,
  }
);

Perfil.belongsToMany(Permissao, {
  through: PerfilPermissao,
  foreignKey: "id_perfil",
  as: "permissao",
});


Permissao.belongsToMany(Perfil, {
  through: PerfilPermissao,
  foreignKey: "id_permissao",
  as: "perfil",
});

PerfilPermissao.belongsTo(Perfil, { foreignKey: "id_perfil", as: "perfil" });
PerfilPermissao.belongsTo(Permissao, { foreignKey: "id_permissao", as: "permissao" });


module.exports = PerfilPermissao;
