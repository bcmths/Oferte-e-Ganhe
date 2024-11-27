const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Perfil.associate = (models) => {
  
  Perfil.belongsToMany(models.Permissao, {
    through: "perfil_permissao",
    foreignKey: "id_perfil",
    otherKey: "id_permissao",
    as: "permissoes", 
  });
};

module.exports = Perfil;
