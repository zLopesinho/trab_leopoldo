const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    experiencia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dificuldade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    texto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    divertiu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "feedbacks",
    timestamps: true,
  }
);

//Feedback.sync();

module.exports = Feedback;
