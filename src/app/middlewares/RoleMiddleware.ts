import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Middleware from "../../resources/interfaces/Middleware";
import ErrorView from "../../app/views/ErrorView";
import DateUtils from "../../resources/utils/Date";

type Role = "student" | "teacher" | "admin";

export default class RoleMiddleware extends Middleware {
  static allow(...roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      dotenv.config();

      const entryTime = DateUtils.obtainCurrentDateString();
      const token = req.headers["x-session-token"] as string;
      const decoded = jwt.decode(token) as jwt.JwtPayload;

      if (!decoded?.role || !roles.includes(decoded.role as Role)) {
        new ErrorView(res, 403, "Forbidden: insufficient permissions", entryTime).send();
        return;
      }

      next();
    };
  }
}
