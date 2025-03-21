import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

export const userMiddleware = (req : Request, res : Response, next : NextFunction) : any => {
    try {
        const headers = req.headers.authorization;

        const token = headers?.split(" ")[1];

        if(!token) {
            return res.status(401).json(
            {message : "Auth Token Not Found!"}
            )
        }

        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as JwtPayload;
        
        if(!decoded || !decoded.id) {
            return res.status(400).json({
                message : "Unauthorized"
            })
        }
        req.userId = decoded.id;
        next();

    } catch (error : any) {
        return res.status(500).json({
            message : error.message
        })
    }
}