// ------------------------------------------------------------------- //
//                               Imports                               //
// ------------------------------------------------------------------- //

import express from "express" // Express
import path from "path" // Acessar pasta ./public
import {logger} from "./middlewares/logger" // Usar o middleware logger
import {routes} from "./routes/lojaRoutes" // Acessar rotas

import { PORT, HOST } from "./variables/index" // Endereço do servidor

// ------------------------------------------------------------------- //
//                            Configuração                             //
// ------------------------------------------------------------------- //

const app = express() // Facilitar escrita do código

app.use(express.json()) // Permitir visualização e criação de arquivos JSON
app.use(express.static(path.join(__dirname, '../public'))); // Aplicação do Path para acessar a pasta ./public
app.use(express.urlencoded({ extended: true })); // Tradução de dados formatados em URL para o TypeScript.

// Logger Middleware
app.use(logger) // Aplicação do Logger

// EJS
app.set("view engine", "ejs")
app.set("views", "src/views")

// Rotas
app.use(routes);

// ------------------------------------------------------------------- //
//                             Execução                                //
// ------------------------------------------------------------------- //

// Listener
app.listen(PORT, HOST, () => {
    console.log(`-------------------------------------------------------------------`)
    console.log(`                     Servidor Iniciando...                         `)
    console.log(`-------------------------------------------------------------------`)
    console.log(``)
    console.log(`STATUS: Conectado na rede local! Acesse neste dispositivo em: http://${HOST}:${PORT} | Para acessar em outros dispositivos escreva o IP local IPv4 da máquina em que o servidor está sendo executado ao invés de '0.0.0.0'`)
    console.log(`   -------------------------------------------------------------   `)
})