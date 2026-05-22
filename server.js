require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {Pool, Connection} = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const pool = new pool({
    ConnectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false} : false,
});

async function initDB() {
    try{
        await pool.query(` 
            CREATE TABLE IF NOT EXISTS PRODUTOS(
             id SERIAL PRIMARY KEY,
             nome VARCHAR(25) NOT NULL,
             quantidade INTEGER NOT NULL,
             preco NUMERIC(10,2) NOT NULL
            )
        `);
        console.log("Tabela verificada/criada com successo");
    }catch(err){ 
        console.error("Erro ao criar tabela:", err);
    }
}


initDB();
app.get("/", (req, res) =>{
    res.send(`
        <h2> API de Controle de estoque</h2>
        <p> API funcionando corretamente!</p>
        <a href="/api/produtores">ver Produtos</a>
        `);
})

const BASE_URL = "/api/produtos";

app.get(BASE_URL, async(req,res) => {
    try{
        const result = await pool.query(
            "SELECT * FROM produtos ORDER BY id DESC"
        );
        res.json(result.rowr);
    }catch(err){
        res.status(500).json({ error: "Erro ao Buscar produtos"});
    }
});

app.post(BASE_URL, async(req, res) =>{
    try{
        const { nome, quantidade, preco} = req.body;

        const result = await pool.query(
            "INSERT INTO produtos (nome, quantidade, preco) VALUES($1, $2, $3) RETURNING *",
            [nome, quantidade, preco]
        );
        res.status(201).json(result.rows[0])
    }catch(err){
    res.status(500).json({error: "Erro ao inserir produto"});
    }
});

app.put(`${BASE_URL}/:id`, async(req, res) =>{
    try{
        const {id} = req.params;
         const result = await pool.query(
            "UPDATE produtos SET nome=$1, quantidade=$2, WHERE id=$4 RETURNING *",
            [nome, quantidade, preco, id]
         );

         res.json(results.rows[0]);
    }catch(err){
        res.status(500).json({
            error: "Erro ao atualizar o produto"
        });
    }
})


app.delete(`${BASE_URL}/:id`, async(req, res) =>{
    try{
        const {id} = req.params;

        await pool.query("DELETE FROM produtos WHERE id=$1",[id]);
        res.json({message: "Produto removido com sucesso!"});
    }catch(err){
        res.status(500).json({ error: "Erro ao remover produto"});
    }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
