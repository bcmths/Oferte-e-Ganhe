const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Perfil = require("./profileModel");
const Loja = require("./storeModel");

const Usuario = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    matricula: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_perfil: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Perfil",
        key: "id_perfil",
      },
    },
    id_loja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Loja",
        key: "id_loja",
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
    tableName: "usuario",
    timestamps: false,
  }
);

Usuario.belongsTo(Perfil, {
  foreignKey: "id_perfil",
  as: "perfil",
});

Usuario.belongsTo(Loja, {
  foreignKey: "id_loja",
  as: "loja",
});

Perfil.hasMany(Usuario, { foreignKey: "id_perfil" });
Loja.hasMany(Usuario, { foreignKey: "id_loja" });

module.exports = Usuario;
