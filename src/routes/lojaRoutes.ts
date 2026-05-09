import {Router} from "express"
import * as Controller from "../controllers/lojaController"

export const routes = Router()



// ------------------------------------------------------------------- //
//                               Rotas                                 //
// ------------------------------------------------------------------- //

// GET
routes.get("/", Controller.paginaInicial) // ./public/index.html

routes.get("/sobre", Controller.saibaMais) // ../views/saibamais.ejs

routes.get("/loja", Controller.loja) // ../views/lista.ejs

routes.get("/loja/adicionar", Controller.paginaAdicionar) // ./views/adicionar.ejs

routes.get("/loja/json", Controller.lojaJson) // ./dados/lista.json

routes.get("/sucesso", Controller.paginaSucesso)

routes.get("/sucessoupdate/:id", Controller.sucessoUpdate)

routes.get("/loja/update/:id", Controller.paginaUpdate)

routes.get("/loja/:id", Controller.produtoEspecifico)

// POST
routes.post("/loja/adicionar", Controller.postLivro) // POST executado via formulário em ./views/adicionar.ejs

//PUT
routes.put("/loja/update/:id", Controller.putLivro)

//DELETE
routes.delete("/loja/:id", Controller.deleteLivro)