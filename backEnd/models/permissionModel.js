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
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Permissao.associate = (models) => {
  Permissao.belongsToMany(models.Perfil, {
    through: "perfil_permissao",
    foreignKey: "id_permissao",
    otherKey: "id_perfil",
    as: "perfis",
  });
};

module.exports = Permissao;
