const { Sequelize } = require("sequelize");
const database = require("../docs/database");

const sequelize = new Sequelize(
  database.name,
  database.user,
  database.password,
  {
    host: database.host,
    dialect: database.dialect,
    logging: false,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados foi estabelecida com sucesso!");
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error);
  }
}

testConnection();

module.exports = sequelize;
