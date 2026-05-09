import {writeFile, readFile, mkdir} from "fs/promises"
import { Livro, PORT, HOST } from "../variables/index"

const diretorioDados = "./dados"
const dadosLoja = "./dados/lista.json"

export async function readLivros(): Promise<Livro[]> {
    try {
        const texto = await readFile(dadosLoja, "utf-8");
        console.log(`DADOS: Dados carregados com sucesso!`)
        return JSON.parse(texto) as Livro[]; // Array
    }
    catch {
        console.log(`DADOS: O arquivo "${dadosLoja}" não foi encontrado na pasta do projeto, adicione um livro em http://${HOST}:${PORT}/lista/adicionar para criar o arquivo ou o importe`)
        return [];
  }
}

export async function writeLivros(lista: Livro[]) {
    await mkdir(diretorioDados, {recursive: true})
    await writeFile(dadosLoja, JSON.stringify(lista, null, 2));
    console.log(`DADOS: Dados escritos com sucesso!`)
}