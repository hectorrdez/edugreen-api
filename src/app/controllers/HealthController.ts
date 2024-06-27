import { Request, Response } from "express";
import ApiError from "../../resources/errors/ApiError";
import Controller from "../../resources/templates/Controller";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import DataView from "../views/DataView";
import ErrorView from "../views/ErrorView";
import { configDotenv } from "dotenv";

export default class HealthController extends Controller {
  static async get(req: Request, res: Response): Promise<any> {
    const scope = "🕹️ HealthController:" + "get";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      configDotenv();
      const { API_PORT } = process.env;
      Logger.write("System checking health...", scope);
      Logger.write("Returning the response", scope);
      return new DataView(
        res,
        {
          name: "api-gateway",
          url: `http://localhost:${API_PORT}`,
          online: true,
        },
        entryTime
      ).send();
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
        return new ErrorView(
          res,
          err.getCode(),
          err.getMessage(),
          entryTime
        ).send();
      } else {
        Logger.error((err as Error).message, scope);
        return new ErrorView(
          res,
          500,
          (err as Error).message,
          entryTime
        ).send();
      }
    }
  }
}
