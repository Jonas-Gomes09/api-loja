import {Request, Response, NextFunction} from "express"

export function logger(req: Request, res: Response, next: NextFunction) {
    const agora = new Date().toLocaleTimeString()

    console.log(`[${agora}] ${req.method} executado na rota ${req.url}`)
    next()
}