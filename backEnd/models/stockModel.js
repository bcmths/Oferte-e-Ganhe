const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Loja = require("../models/storeModel");

const Estoque = sequelize.define(
  "Estoque",
  {
    id_estoque: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    estoque_atual: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estoque_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estoque_recomendado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_loja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Loja,
        key: "id_loja",
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
    tableName: "estoque",
    timestamps: false,
  }
);

Estoque.belongsTo(Loja, {
  foreignKey: "id_loja",
  as: "loja",
});

Loja.hasOne(Estoque, {
  foreignKey: "id_loja",
});

module.exports = Estoque;
