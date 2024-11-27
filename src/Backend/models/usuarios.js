const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hierarquia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
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
    pontuacao: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    pontuacaoMax: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    // Campos para salvar o progresso do Quiz
    currentQuestion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    quizScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    quizCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
  }
);

//Usuario.sync();

module.exports = Usuario;
