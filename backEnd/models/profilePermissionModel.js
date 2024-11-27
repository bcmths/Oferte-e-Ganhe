const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Perfil, Permissao } = require("./associations");

const PerfilPermissao = sequelize.define(
  "PerfilPermissao",
  {
    id_perfil: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "perfil",
        key: "id_perfil",
      },
    },
    id_permissao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "permissao",
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
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

PerfilPermissao.associate = () => {
  PerfilPermissao.belongsTo(Perfil, {
    foreignKey: "id_perfil",
    as: "perfil",
  });

  PerfilPermissao.belongsTo(Permissao, {
    foreignKey: "id_loja",
    as: "loja",
  });
};

module.exports = PerfilPermissao;
