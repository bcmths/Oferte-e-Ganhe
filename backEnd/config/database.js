const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: "5432",
});

pool.connect((err, client, realease) => {
  if (err) {
    return console.error("Erro ao conectar ao banco de dados:", err.stack);
  }
  console.log("Conexão estabelecida com sucesso");
  realease();
});

module.exports = pool;
