import { Request, Response, NextFunction } from "express";

export const authMidleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({
            status: "error",
            message: "Acesso não autorizado: chave de API não fornecida"
        });
    }
    
    const parts = authHeader.split(" ");
    if(parts.length !== 2 || parts[0] !== 'ApiKey') {
        return res.status(401).json({
            status: "error",
            message: "Acesso não autorizado: chave de API com formato inválido"
        });
    }
    const apiKey = parts[1];

    const secretKey = process.env.API_SECRET_KEY;

    if(apiKey && apiKey === secretKey) {
        console.log("Acesso autorizado.");
        next();
    } else {
        console.log("Acesso negado: chave de API inválida.");
        return res.status(403).json({ 
            status: "error",
            message: "Acesso proibido: chave de API inválida." 
        });
    }
};
