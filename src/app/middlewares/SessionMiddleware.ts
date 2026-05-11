import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Middleware from "../../resources/interfaces/Middleware";
import ErrorView from "../../app/views/ErrorView";
import DateUtils from "../../resources/utils/Date";

export default class SessionMiddleware extends Middleware {
  public static handle(req: Request, res: Response, next: NextFunction): void {
    dotenv.config();

    const entryTime = DateUtils.obtainCurrentDateString();
    const token = req.headers["x-session-token"] as string;

    if (!token) {
      new ErrorView(res, 401, "Session token required", entryTime).send();
      return;
    }

    try {
      jwt.verify(token, process.env.API_SECRET as string);
      next();
    } catch {
      new ErrorView(res, 401, "Session expired or invalid", entryTime).send();
    }
  }
}
