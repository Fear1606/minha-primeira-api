// 1. Importar Express
const express = require('express');

// 2. Criar aplicação
const app = express();

// 3. Definir porta
const PORT = 3000;

// 4. Middleware para JSON
app.use(express.json());

// 5. Criar primeiro endpoint
app.get('/', (req, res) => {
    res.json({
        mensagem: '🎉 Minha primeira API funcionando!',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

// 6. Endpoint de informações
app.get('/info', (req, res) => {
    res.json({
        nome: 'Minha API REST',
        versao: '1.0.0',
        autor: 'Seu Nome'
    });
});

// 7. Iniciar servidor
app.listen(PORT, (80) => {
    console.log(`🚀 Servidor rodando em http://localhost:${3000}`);
});

// Banco de dados "fake" em memória
let produtos = [
    {
        id: 1,
        nome: "Notebook Dell",
        preco: 3500,
        categoria: "Informática",
        estoque: 15
    },
    {
        id: 2,
        nome: "Mouse Logitech",
        preco: 150,
        categoria: "Informática",
        estoque: 50
    },
    {
        id: 3,
        nome: "Livro JavaScript",
        preco: 89,
        categoria: "Livros",
        estoque: 30
    },
    {
        id: 4,
        nome: "Teclado Mecânico",
        preco: 450,
        categoria: "Informática",
        estoque: 20
    }
];
              
// GET /api/produtos - Listar todos
app.get('/api/produtos', (req, res) => {
    // Retorna o array completo
    res.json(produtos);
});
             // GET /api/produtos/:id - Buscar por ID
app.get('/api/produtos/:id', (req, res) => {
    // 1. Pegar ID da URL
    const id = parseInt(req.params.id);
    
    // 2. Buscar produto no array
    const produto = produtos.find(p => p.id === id);
    
    // 3. Verificar se encontrou
    if (!produto) {
        return res.status(404).json({ 
            erro: "Produto não encontrado" 
        });
    }
    
    // 4. Retornar produto encontrado
    res.json(produto);
});
        // GET /api/produtos?categoria=Informática&preco_max=500
app.get('/api/produtos', (req, res) => {
    // 1. Pegar query parameters
    const { categoria, preco_max, preco_min } = req.query;
    
    // 2. Começar com todos os produtos
    let resultado = produtos;
    
    // 3. Aplicar filtro de categoria (se fornecido)
    if (categoria) {
        resultado = resultado.filter(p => p.categoria === categoria);
    }
    
    // 4. Aplicar filtro de preço máximo
    if (preco_max) {
        resultado = resultado.filter(p => p.preco <= parseFloat(preco_max));
    }
    
    // 5. Aplicar filtro de preço mínimo
    if (preco_min) {
        resultado = resultado.filter(p => p.preco >= parseFloat(preco_min));
    }
    
    // 6. Retornar resultados filtrados
    res.json(resultado);
});
          os', (req, res) => {
    const { categoria, preco_max, preco_min, ordem, direcao } = req.query;
    
    let resultado = produtos;
    
    // ... filtros anteriores ...
    
    // Ordenação
    if (ordem) {
        resultado = resultado.sort((a, b) => {
            if (ordem === 'preco') {
                // Ordenar por preço
                return direcao === 'desc' 
                    ? b.preco - a.preco  // Decrescente
                    : a.preco - b.preco; // Crescente
            }
            
            if (ordem === 'nome') {
                // Ordenar por nome (alfabético)
                return direcao === 'desc'
                    ? b.nome.localeCompare(a.nome)
                    : a.nome.localeCompare(b.nome);
            }
        });
    }
    
    res.json(resultado);
});

// GET /api/produtos?pagina=1&limite=2
app.get('/api/produtos', (req, res) => {
    const { 
        categoria, preco_max, preco_min, 
        ordem, direcao,
        pagina = 1,      // Página padrão: 1
        limite = 10     // Itens por página: 10
    } = req.query;
    
    let resultado = produtos;
    
    // ... aplicar filtros e ordenação ...
    
    // Paginação
    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);
    
    const inicio = (paginaNum - 1) * limiteNum;
    const fim = inicio + limiteNum;
    
    const paginado = resultado.slice(inicio, fim);
    
    // Retornar com metadados
    res.json({
        dados: paginado,
        paginacao: {
            pagina_atual: paginaNum,
            itens_por_pagina: limiteNum,
            total_itens: resultado.length,
            total_paginas: Math.ceil(resultado.length / limiteNum)
        }
    });
});
             const express = require('express');
const app = express();

app.use(express.json());

// Dados em memória
let produtos = [
    { id: 1, nome: "Notebook Dell", preco: 3500, categoria: "Informática", estoque: 15 },
    { id: 2, nome: "Mouse Logitech", preco: 150, categoria: "Informática", estoque: 50 },
    { id: 3, nome: "Livro JavaScript", preco: 89, categoria: "Livros", estoque: 30 },
    { id: 4, nome: "Teclado Mecânico", preco: 450, categoria: "Informática", estoque: 20 }
];

// GET /api/produtos - Listar com filtros, ordenação e paginação
app.get('/api/produtos', (req, res) => {
    const { categoria, preco_max, preco_min, ordem, direcao, pagina = 1, limite = 10 } = req.query;
    
    let resultado = produtos;
    
    // Filtros
    if (categoria) resultado = resultado.filter(p => p.categoria === categoria);
    if (preco_max) resultado = resultado.filter(p => p.preco <= parseFloat(preco_max));
    if (preco_min) resultado = resultado.filter(p => p.preco >= parseFloat(preco_min));
    
    // Ordenação
    if (ordem) {
        resultado = resultado.sort((a, b) => {
            if (ordem === 'preco') {
                return direcao === 'desc' ? b.preco - a.preco : a.preco - b.preco;
            }
            if (ordem === 'nome') {
                return direcao === 'desc' ? b.nome.localeCompare(a.nome) : a.nome.localeCompare(b.nome);
            }
        });
    }
    
    // Paginação
    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);
    const inicio = (paginaNum - 1) * limiteNum;
    const paginado = resultado.slice(inicio, inicio + limiteNum);
    
    res.json({
        dados: paginado,
        paginacao: {
            pagina_atual: paginaNum,
            itens_por_pagina: limiteNum,
            total_itens: resultado.length,
            total_paginas: Math.ceil(resultado.length / limiteNum)
        }
    });
});

// GET /api/produtos/:id - Buscar por ID
app.get('/api/produtos/:id', (req, res) => {
    const produto = produtos.find(p => p.id === parseInt(req.params.id));
    if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(produto);
});

app.listen(3000, () => console.log('🚀 API rodando na porta 3000'));

// DELETE /api/produtos/:id - Remover produto
app.delete('/api/produtos/:id', (req, res) => {
    // 1. Pegar ID da URL
    const id = parseInt(req.params.id);
    
    // 2. Encontrar índice do produto no array
    const index = produtos.findIndex(p => p.id === id);
    
    // 3. Verificar se existe
    if (index === -1) {
        return res.status(404).json({ 
            erro: "Produto não encontrado" 
        });
    }
    
    // 4. Remover do array
    produtos.splice(index, 1);
    
    // 5. Retornar 204 No Content (sem body!)
    res.status(204).send();
});

// Estrutura do produto com campo 'deletado'
let produtos = [
    { 
        id: 1, 
        nome: "Notebook", 
        preco: 3500,
        deletado: false  ← Flag de soft delete
    }
];

// DELETE com Soft Delete
app.delete('/api/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);
    
    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }
    
    // Marcar como deletado ao invés de remover!
    produto.deletado = true;
    
    res.status(204).send();
});

// GET precisa filtrar produtos deletados!
app.get('/api/produtos', (req, res) => {
    // Só retornar produtos não deletados
    const produtosAtivos = produtos.filter(p => !p.deletado);
    res.json(produtosAtivos);
});

//completa api
const express = require('express');
const app = express();

app.use(express.json());

let produtos = [
    { id: 1, nome: "Notebook", preco: 3500, categoria: "Informática" },
    { id: 2, nome: "Mouse", preco: 150, categoria: "Informática" }
];
let proximoId = 3;

// GET /api/produtos - Listar todos
app.get('/api/produtos', (req, res) => {
    res.json(produtos);
});

// GET /api/produtos/:id - Buscar por ID
app.get('/api/produtos/:id', (req, res) => {
    const produto = produtos.find(p => p.id === parseInt(req.params.id));
    if (!produto) return res.status(404).json({ erro: "Não encontrado" });
    res.json(produto);
});

// POST /api/produtos - Criar novo
app.post('/api/produtos', (req, res) => {
    const { nome, preco, categoria } = req.body;
    
    if (!nome || !preco || !categoria) {
        return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }
    
    const novoProduto = { id: proximoId++, nome, preco, categoria };
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
});

// PUT /api/produtos/:id - Atualizar
app.put('/api/produtos/:id', (req, res) => {
    const produto = produtos.find(p => p.id === parseInt(req.params.id));
    if (!produto) return res.status(404).json({ erro: "Não encontrado" });
    
    const { nome, preco, categoria } = req.body;
    if (!nome || !preco || !categoria) {
        return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }
    
    produto.nome = nome;
    produto.preco = preco;
    produto.categoria = categoria;
    res.json(produto);
});

// DELETE /api/produtos/:id - Remover
app.delete('/api/produtos/:id', (req, res) => {
    const index = produtos.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ erro: "Não encontrado" });
    
    produtos.splice(index, 1);
    res.status(204).send();
});

app.listen(3000, () => console.log('🚀 API CRUD completa na porta 3000'));