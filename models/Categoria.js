const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Categoria = sequelize.define("Categoria", {
    nome: DataTypes.STRING
});

module.exports = Categoria;