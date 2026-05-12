import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import Middleware from "../../resources/interfaces/Middleware";

export default class ApiKeyMiddleware extends Middleware {
  public static handle(req: Request, res: Response, next: NextFunction): void {
    dotenv.config();

    if (!req.headers || !req.headers.authorization) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { authorization } = req.headers;
    const { API_KEY } = process.env;

    if (authorization !== API_KEY) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  }
}
