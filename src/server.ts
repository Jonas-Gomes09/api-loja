// Importando

import { time } from "console"
import express, {Request, Response} from "express"
import path from "path"
import {writeFile, readFile} from "fs/promises"
import { isNumberObject } from "util/types"
import { textSpanOverlap } from "typescript"

// Configuração
const app = express()
const PORT = 6767
const HOST = '0.0.0.0'

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const agora = new Date().toLocaleTimeString()

    console.log(`[${agora}] ${req.method} executado na rota ${req.url}`)
    next()
})

app.set("view engine", "ejs")
app.set("views", "src/views")

// Variáveis

interface Livro {
    id: Number
    titulo: String
    ano: Number
    genero: String
    disponivel?: Boolean
}

const dadosLoja = "lista.json"

// Leitura do arquivo lista.json.
async function readLivros(): Promise<Livro[]> {
    try {
        const texto = await readFile(dadosLoja, "utf-8");
        return JSON.parse(texto) as Livro[];
    }
    catch {
        console.log(`O arquivo ${dadosLoja} ainda não existe.`)
        return [];
  }
}

// Escrever o arquivo lista.json
async function writeLivros(lista: Livro[]) {
    await writeFile(dadosLoja, JSON.stringify(lista, null, 2));
}

readLivros()





// Página Inicial
app.get("/", async (req, res) => {
    res.render("index")
})

// Saiba mais
app.get("/sobre", async (req, res) => {
    res.render("saibamais")
})

// Loja
app.get("/lista", async (req, res) => {
    const loja = await readLivros()
    try {
        res.render("lista", {lista:loja})
    }
    catch {
        res.status(500).json({sucesso: false, status: "Erro interno do servidor"})
        console.log("Falha ao acessar banco de dados")
    }
})

app.get("/lista/json", async (req, res) => {
    const loja = await readLivros()
    try {
        res.json(loja)
    } catch {
        res.status(500).json({sucesso: false, status: "Erro interno do servidor"})
        console.log("Falha ao acessar banco de dados")
    }
})

// Adicionar Produto (Página)
app.get("/lista/adicionar", async (req, res) => {
    res.render("adicionar")
})

// Adicionar Produto (Rota POST)
app.post("/lista/adicionar", async (req, res) => {

    const {titulo, ano, genero} = req.body
    const disponibilidade = req.body.checkboxDisponivel === 'on' // Confirmação na checkbox

    try {
        const loja = await readLivros()
        const nextID = loja.length > 0 ? Number(loja.length) + 1 : 1;

        const novoLivro = {id: nextID, titulo, ano, genero, disponivel: disponibilidade}


        const erros: String[] = []
        if (typeof titulo !== "string" || !titulo) {
            erros.push("O nome é obrigatório!")
        }
        if (typeof genero !== "string" || !genero) {
            erros.push("O gênero é obrigatório")
        }

        if (erros.length > 0) {
            res.status(400).json({sucesso: false, erros})
        } else loja.push(novoLivro)

        await writeLivros(loja)
        res.redirect("/sucesso")
    } catch {
        res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor"})
    }
})

// Sucesso ao adicionar
app.get("/sucesso", async (req, res) => {
    try {
    const loja = await readLivros()
    const ultimoValor = Number(loja.length-1)
    const ultimoAdd = loja[ultimoValor]

    res.render("sucesso", {livro:ultimoAdd})
    } catch {
        res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor"})
    }
})

// Página do livro
app.get("/lista/:id", async (req, res) => {
    const loja = await readLivros()
    const ID = Number(req.params.id)
    const busca = loja.find(a => a.id === ID)

    if (busca) {res.render("livro", {livro:busca})} 
    else {res.status(404).render("livroerro", {ID})}
})

// Listener
app.listen(PORT, HOST, () => {
    console.log(`Connected! Hosted at: http://${HOST}:${PORT}`)
})