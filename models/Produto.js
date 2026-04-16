const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Produto = sequelize.define("Produto", {
    nome: DataTypes.STRING,
    preco: DataTypes.FLOAT
});

module.exports = Produto;