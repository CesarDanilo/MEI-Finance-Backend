import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface TokenPayload {
    sub: string
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) return res.status(401).json({ message: "Unauthorized" })

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload

        req.user = { id: decoded.sub }

        next()
    } catch {
        return res.status(401).json({ message: "Invalid token" })
    }
}