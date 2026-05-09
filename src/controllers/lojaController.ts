import express, {Request, Response} from "express"
import * as Models from "../models/lojaModels"
import * as Index from "../variables/index"

// ------------------------------------------------------------------- //
//                               FUNÇÕES                               //
// ------------------------------------------------------------------- //

// Busca por ID
async function buscaPorID(ID: number) {
    const loja = await Models.readLivros()
    const busca = loja.find(a => a.id === ID)
    return busca
}



// ------------------------------------------------------------------- //
//                                 GET                                 //
// ------------------------------------------------------------------- //

// GET ./public/index.html em /
export async function paginaInicial(req: Request, res: Response) {
    try {
        res.render("index")
    } catch {
        res.status(500).json({sucesso: false, erro: "Erro interno do servidor"})
        console.log("GET (/): Falha ao acessar página inicial")
    }
}

// GET ../views/saibamais.ejs em /sobre
export async function saibaMais(req: Request, res: Response) {
    try {
        res.render("saibamais")
    } catch {
        res.status(500).json({sucesso: false, erro: "Erro interno do servidor"})
        console.log("GET (/sobre): Falha ao acessar página de Saiba Mais")
    }
}

// GET ../views/lista.ejs em /loja
export async function loja(req: Request, res: Response) {
    const loja = await Models.readLivros()
    try {
        res.render("lista", {lista:loja})
    }
    catch {
        res.status(500).json({sucesso: false, status: "Erro interno do servidor ao tentar executar a rota GET"})
        console.log("GET (/lista): Falha ao acessar banco de dados")
    }
}

// GET ../views/adicionar.ejs em /adicionar
export async function paginaAdicionar(req: Request, res: Response) {
    try {
        res.render("adicionar")
    } catch {
        res.status(500).json({sucesso: false, erro: "Erro interno do servidor"})
    }
}

// GET ./dados/lista.json em /lojaJson
export async function lojaJson(req: Request, res: Response) {
    const loja = await Models.readLivros()
    try {
        res.json(loja)
    } catch {
        res.status(500).json({sucesso: false, status: "Erro interno do servidor ao tentar executar a rota GET"})
        console.log("GET (/lista/json): Falha ao acessar banco de dados")
    }
}

// GET ../views/sucesso.ejs
export async function paginaSucesso(req: Request, res: Response) {
    try {
    const loja = await Models.readLivros()
    const ultimoValor = Number(loja.length-1) // É pra ser o item adicionado após o POST.
    const ultimoAdd = loja[ultimoValor]

    res.render("sucesso", {livro:ultimoAdd})
    } catch {
        res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor ao tentar executar rota GET"})
        console.log("GET (/sucesso): Falha ao carregar página de sucesso")
    }
}

// GET ../views/sucessoupdate.ejs
export async function sucessoUpdate(req: Request, res: Response) {
    const ID = Number(req.params.id)
    try {
    const loja = await Models.readLivros()
    const index = await loja.findIndex(a => a.id === ID)

    res.render("sucessoupdate", {livro:loja[index]})
    } catch {
        res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor ao tentar executar rota GET"})
        console.log("GET (/sucesso): Falha ao carregar página de sucesso")
    }
}

// GET ../views/update.ejs
export async function paginaUpdate(req: Request, res: Response) {
    const ID = Number(req.params.id)
    try {
    const loja = await Models.readLivros()
    const index = await loja.find(a => a.id === ID)
    
    if (index === undefined) {
        res.status(404).json({sucesso: false, erro: "Não existe livro com este ID."})
        return;
    }
    res.render("update", {livro:index})
    } catch {
        res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor ao tentar executar rota GET"})
        console.log("GET (/loja/update): Falha ao carregar página de atualizar")
    }
}

export async function produtoEspecifico(req: Request, res: Response) {
    const ID = Number(req.params.id)
    try {
    const busca = await buscaPorID(ID)

    if (busca !== null || busca !== undefined) {res.json(busca)} 
    else {res.status(404).json({sucesso: false, mensagem: `Não há nenhum produto com o ID ${ID}`})}
    } catch {
        res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor ao tentar executar rota GET"})
        console.log(`GET (/lista/${ID}): Falha ao tentar acessar o livro com ID ${ID}`)
    }
}

// ------------------------------------------------------------------- //
//                                POST                                 //
// ------------------------------------------------------------------- //

// POST executado em ../views/adicionar.ejs em /lista/adicionar
export async function postLivro(req: Request, res: Response) {

    const {titulo, autor, ano, genero} = req.body
    const disponibilidade = req.body.checkboxDisponivel === 'on' // Confirmação na checkbox

    try {
        const loja: Index.novoLivro[] = await Models.readLivros()
        const nextID = loja.length > 0 ? loja.length + 1 : 1;

        const novoLivro: Index.novoLivro = { 
            id: nextID, 
            titulo, 
            autor, 
            ano,
            genero, 
            disponivel: disponibilidade 
        };

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

        await Models.writeLivros(loja)
        res.status(201).redirect("/sucesso")
    } catch {
        res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor ao tentar executar a rota POST"})
        console.log("POST (/lista/adicionar): Falha ao adicionar produto")
    }
}

// ------------------------------------------------------------------- //
//                                 PUT                                 //
// ------------------------------------------------------------------- //



export async function putLivro(req: Request, res: Response) {
    const ID = Number(req.params.id)
    const { titulo, autor, ano, genero, disponivel } = req.body;
    const loja = await Models.readLivros()
try {
        const loja: Index.Livro[] = await Models.readLivros()
        const index = await loja.findIndex(a => a.id === ID)
        const atual = loja[index]

        if (!atual) return null;

            if (index === -1) {
            res.status(404).json({sucesso: false, erro: "Não existe livro com este ID."})
            return;
        }
            const livroAtualizado: Index.Livro = { 
                ...atual, // Mantém o que já existia
                id: ID,   // Garante que o ID não mude
                titulo: titulo ?? atual.titulo, 
                autor: autor ?? atual.autor, 
                ano: ano ?? atual.ano,
                genero: genero ?? atual.genero, 
                disponivel: disponivel !== undefined ? disponivel : atual.disponivel
            }

        loja[index] = livroAtualizado

        await Models.writeLivros(loja)
        res.redirect(`/sucessoupdate/${ID}`)
    
    } catch {
        res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor ao tentar executar a rota PUT"})
        console.log(`PUT (/loja/update/${ID}): Falha ao adicionar produto`)
    }
}

// ------------------------------------------------------------------- //
//                               DELETE                                //
// ------------------------------------------------------------------- //

export async function deleteLivro(req: Request, res:Response) {
    const ID = Number(req.params.id)
    try {
        const loja = await Models.readLivros()
        const index = loja.findIndex(a => a.id === ID)

            loja.splice(index, 1)
            await Models.writeLivros(loja)
            res.json({sucesso: true, mensagem: "Livro excluido."})
    } catch {
        console.error(`DELETE (/loja/${ID}): Falha ao tentar excluir o livro com ID ${ID}`)
        return res.status(500).json({sucesso: false, mensagem: "Erro interno do servidor ao tentar executar a rota DELETE"})
    }
}