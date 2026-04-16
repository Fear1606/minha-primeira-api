const express = require("express");
const app = express();

const sequelize = require("./models/modelsindex");
const Produto = require("./models/Produto");
const Categoria = require("./models/Categoria");

app.use(express.json());

/* =========================
   RELACIONAMENTO
========================= */
Categoria.hasMany(Produto);
Produto.belongsTo(Categoria);

/* =========================
   ROTA TESTE
========================= */
app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

/* =========================
   CRUD PRODUTOS
========================= */

// GET com filtro + paginação + ordenação
app.get("/api/produtos", async (req, res) => {
    try {
        const { nome, page = 1, limit = 5 } = req.query;

        const produtos = await Produto.findAll({
            where: nome ? { nome } : {},
            include: Categoria,
            limit: parseInt(limit),
            offset: (page - 1) * limit,
            order: [["preco", "ASC"]]
        });

        res.status(200).json(produtos);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar produtos" });
    }
});

// GET por ID
app.get("/api/produtos/:id", async (req, res) => {
    const produto = await Produto.findByPk(req.params.id, {
        include: Categoria
    });

    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.status(200).json(produto);
});

// POST
app.post("/api/produtos", async (req, res) => {
    const { nome, preco, CategoriaId } = req.body;

    if (!nome || !preco) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }

    const produto = await Produto.create({ nome, preco, CategoriaId });

    res.status(201).json(produto);
});

// PUT
app.put("/api/produtos/:id", async (req, res) => {
    const produto = await Produto.findByPk(req.params.id);

    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    await produto.update(req.body);

    res.status(200).json(produto);
});

// DELETE
app.delete("/api/produtos/:id", async (req, res) => {
    const produto = await Produto.findByPk(req.params.id);

    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    await produto.destroy();

    res.status(204).send();
});

/* =========================
   BANCO + DADOS INICIAIS
========================= */
async function start() {
    await sequelize.sync({ force: true });

    const cat1 = await Categoria.create({ nome: "Eletrônicos" });
    const cat2 = await Categoria.create({ nome: "Alimentos" });

    await Produto.bulkCreate([
        { nome: "Celular", preco: 1500, CategoriaId: cat1.id },
        { nome: "Notebook", preco: 3000, CategoriaId: cat1.id },
        { nome: "Mouse", preco: 50, CategoriaId: cat1.id },
        { nome: "Teclado", preco: 120, CategoriaId: cat1.id },
        { nome: "Monitor", preco: 900, CategoriaId: cat1.id },

        { nome: "Arroz", preco: 25, CategoriaId: cat2.id },
        { nome: "Feijão", preco: 10, CategoriaId: cat2.id },
        { nome: "Macarrão", preco: 8, CategoriaId: cat2.id },
        { nome: "Leite", preco: 6, CategoriaId: cat2.id },
        { nome: "Pão", preco: 7, CategoriaId: cat2.id },

        { nome: "TV", preco: 2500, CategoriaId: cat1.id },
        { nome: "Fone", preco: 200, CategoriaId: cat1.id },
        { nome: "Café", preco: 15, CategoriaId: cat2.id },
        { nome: "Açúcar", preco: 5, CategoriaId: cat2.id },
        { nome: "Sal", preco: 3, CategoriaId: cat2.id },

        { nome: "Tablet", preco: 1200, CategoriaId: cat1.id },
        { nome: "Biscoito", preco: 4, CategoriaId: cat2.id },
        { nome: "Queijo", preco: 20, CategoriaId: cat2.id },
        { nome: "Iogurte", preco: 8, CategoriaId: cat2.id },
        { nome: "HD Externo", preco: 400, CategoriaId: cat1.id }
    ]);

    app.listen(3000, () => {
        console.log("Servidor rodando em http://localhost:3000");
    });
}

start();