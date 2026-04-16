// IMPORTS
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

const PORT = 3000;

// ----------------------
// BANCO (SQLite)
// ----------------------
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// MODEL
const Produto = sequelize.define('Produto', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// ----------------------
// ROTAS
// ----------------------

// TESTE
app.get('/', (req, res) => {
    res.json({ mensagem: "API com banco funcionando 🚀" });
});

// GET COM FILTRO + PAGINAÇÃO
app.get('/api/produtos', async (req, res) => {
    try {
        const { categoria, ordem, direcao, pagina = 1, limite = 10 } = req.query;

        let where = {};
        if (categoria) where.categoria = categoria;

        let order = [];
        if (ordem) {
            order.push([ordem, direcao === 'desc' ? 'DESC' : 'ASC']);
        }

        const offset = (pagina - 1) * limite;

        const { count, rows } = await Produto.findAndCountAll({
            where,
            order,
            limit: parseInt(limite),
            offset: parseInt(offset)
        });

        res.json({
            dados: rows,
            total: count,
            pagina: parseInt(pagina)
        });

    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar produtos" });
    }
});

// GET POR ID
app.get('/api/produtos/:id', async (req, res) => {
    const produto = await Produto.findByPk(req.params.id);

    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json(produto);
});

// POST
app.post('/api/produtos', async (req, res) => {
    const { nome, preco, categoria } = req.body;

    if (!nome || !preco || !categoria) {
        return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    const novo = await Produto.create({ nome, preco, categoria });

    res.status(201).json(novo);
});

// PUT
app.put('/api/produtos/:id', async (req, res) => {
    const produto = await Produto.findByPk(req.params.id);

    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    const { nome, preco, categoria } = req.body;

    await produto.update({ nome, preco, categoria });

    res.json(produto);
});

// DELETE
app.delete('/api/produtos/:id', async (req, res) => {
    const produto = await Produto.findByPk(req.params.id);

    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    await produto.destroy();

    res.status(204).send();
});

// ----------------------
// INICIAR + 20 REGISTROS
// ----------------------
sequelize.sync().then(async () => {

    const count = await Produto.count();

    if (count === 0) {
        await Produto.bulkCreate([
            { nome: "Notebook", preco: 3500, categoria: "Informática" },
            { nome: "Mouse", preco: 150, categoria: "Informática" },
            { nome: "Teclado", preco: 200, categoria: "Informática" },
            { nome: "Monitor", preco: 1200, categoria: "Informática" },
            { nome: "Cadeira", preco: 900, categoria: "Móveis" },
            { nome: "Mesa", preco: 500, categoria: "Móveis" },
            { nome: "Livro JS", preco: 80, categoria: "Livros" },
            { nome: "Livro Node", preco: 95, categoria: "Livros" },
            { nome: "Headset", preco: 250, categoria: "Acessórios" },
            { nome: "Webcam", preco: 300, categoria: "Acessórios" },
            { nome: "SSD", preco: 400, categoria: "Informática" },
            { nome: "HD", preco: 300, categoria: "Informática" },
            { nome: "Fonte", preco: 350, categoria: "Informática" },
            { nome: "Gabinete", preco: 450, categoria: "Informática" },
            { nome: "Cabo HDMI", preco: 50, categoria: "Acessórios" },
            { nome: "Adaptador USB", preco: 70, categoria: "Acessórios" },
            { nome: "Livro Python", preco: 85, categoria: "Livros" },
            { nome: "Livro Java", preco: 90, categoria: "Livros" },
            { nome: "Luminária", preco: 120, categoria: "Móveis" },
            { nome: "Suporte Monitor", preco: 180, categoria: "Móveis" }
        ]);
    }

    app.listen(PORT, () => {
        console.log(`🚀 API rodando em http://localhost:${PORT}`);
    });
});