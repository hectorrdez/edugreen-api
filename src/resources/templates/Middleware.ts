import { NextFunction, Response, Request } from "express";
import MethodNotImplementedError from "../errors/MethodNotImplementedError";

export default class Middleware {
    public static handle(req: Request, res: Response, next: NextFunction): void {
        throw new MethodNotImplementedError();
    }
}