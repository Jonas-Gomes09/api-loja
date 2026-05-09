// ------------------------------------------------------------------- //
//                            Variáveis                                //
// ------------------------------------------------------------------- //

export interface Livro {
    id: number
    titulo: string
    autor: string
    ano: number
    genero: string
    disponivel?: boolean
}

export interface novoLivro {
    id: number, 
    titulo: string, 
    autor: string, 
    ano: number, 
    genero: string, 
    disponivel?: boolean
}

export interface updateLivro {
    id: number, 
    titulo?: string, 
    autor?: string, 
    ano?: number, 
    genero?: string, 
    disponivel?: boolean
}

export const PORT = 3000
export const HOST = '0.0.0.0'