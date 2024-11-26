const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("postgres", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });

module.exports = sequelize;
