import { Request, Response, NextFunction } from "express";

export default abstract class Middleware {
    static handle(req: Request, res: Response, next: NextFunction): void { }
}