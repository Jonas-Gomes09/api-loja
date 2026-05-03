// ------------------------------------------------------------------- //
//                            Configuração                             //
// ------------------------------------------------------------------- //

// Import
import { time } from "console"
import express, {Request, Response} from "express"
import path from "path"
import {writeFile, readFile} from "fs/promises"
import { isNumberObject } from "util/types"
import { textSpanOverlap } from "typescript"

// Configuração
const app = express()
const PORT = 3000
const HOST = '0.0.0.0'

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

// Logger Middleware
app.use((req, res, next) => {
    const agora = new Date().toLocaleTimeString()

    console.log(`[${agora}] ${req.method} executado na rota ${req.url}`)
    next()
})

// EJS
app.set("view engine", "ejs")
app.set("views", "src/views")



// ------------------------------------------------------------------- //
//                            Variáveis                                //
// ------------------------------------------------------------------- //

// Livro
interface Livro {
    id: Number
    titulo: String
    ano: Number
    genero: String
    disponivel?: Boolean
}

// /lista.json, onde estão os livros adicionados com POST.
const dadosLoja = "lista.json"

// Leitura do arquivo lista.json.
async function readLivros(): Promise<Livro[]> {
    try {
        const texto = await readFile(dadosLoja, "utf-8");
        console.log(`Dados carregados com sucesso!`)
        return JSON.parse(texto) as Livro[]; // Array
    }
    catch {
        console.log(`O arquivo "${dadosLoja}" não foi encontrado na pasta do projeto, adicione um livro em http://${HOST}:${PORT}/lista/adicionar para criar o arquivo ou o importe`)
        return [];
  }
}

// Escrever o arquivo lista.json
async function writeLivros(lista: Livro[]) {
    await writeFile(dadosLoja, JSON.stringify(lista, null, 2));
}



// ------------------------------------------------------------------- //
//                             Programa                                //
// ------------------------------------------------------------------- //

// Carregar os livros presentes em lista.json
readLivros()

// GET Página Inicial
app.get("/", async (req, res) => {
    res.render("index")
})

// GET Saiba mais
app.get("/sobre", async (req, res) => {
    res.render("saibamais")
})

// GET Loja de livros
app.get("/lista", async (req, res) => {
    const loja = await readLivros()
    try {
        res.render("lista", {lista:loja})
    }
    catch {
        res.status(500).json({sucesso: false, status: "Erro interno do servidor ao tentar executar a rota GET"})
        console.log("(/lista) Falha ao acessar banco de dados")
    }
})

// GET Loja de livros (em JSON)
app.get("/lista/json", async (req, res) => {
    const loja = await readLivros()
    try {
        res.json(loja)
    } catch {
        res.status(500).json({sucesso: false, status: "Erro interno do servidor ao tentar executar a rota GET"})
        console.log("(/lista/json) Falha ao acessar banco de dados")
    }
})

// GET Página de adicionar produto
app.get("/lista/adicionar", async (req, res) => {
    res.render("adicionar")
})

// POST Adição do produto
app.post("/lista/adicionar", async (req, res) => {

    const {titulo, ano, genero} = req.body
    const disponibilidade = req.body.checkboxDisponivel === 'on' // Confirmação na checkbox

    try {
        const loja = await readLivros()
        const nextID = loja.length > 0 ? Number(loja.length) + 1 : 1;

        const novoLivro = {id: nextID, titulo, ano, genero, disponivel: disponibilidade}

        // Validação
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
        res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor ao tentar executar a rota POST"})
        console.log("(/lista/adicionar) Falha ao adicionar produto")
    }
})

// GET Sucesso ao adicionar produto na rota POST /lista/adicionar
app.get("/sucesso", async (req, res) => {
    try {
    const loja = await readLivros()
    const ultimoValor = Number(loja.length-1) // É pra ser o item adicionado após o POST.
    const ultimoAdd = loja[ultimoValor]

    res.render("sucesso", {livro:ultimoAdd})
    } catch {
        res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor ao tentar executar rota GET"})
        console.log("(/sucesso) Falha ao carregar página de sucesso")
    }
})

// GET Livro específico (JSON)
app.get("/lista/:id", async (req, res) => {
    const ID = Number(req.params.id)
    try {
    const loja = await readLivros()
    const busca = loja.find(a => a.id === ID)

    if (busca) {res.json(busca)} 
    else {res.status(404).json({sucesso: false, mensagem: `Não há nenhum produto com o ID ${ID}`})}
    } catch {
        res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor ao tentar executar rota GET"})
        console.log(`(/lista/:id) Falha ao tentar acessar o livro com ID ${ID}`)
    }
})

// ------------------------------------------------------------------- //
//                             Execução                                //
// ------------------------------------------------------------------- //

// Listener
app.listen(PORT, HOST, () => {
    console.log(`Conectado na rede local! Acesse neste dispositivo em: http://${HOST}:${PORT} | Para acessar em outros dispositivos escreva o IP local IPv4 da máquina em que o servidor está sendo executado ao invés de '0.0.0.0'`)
})