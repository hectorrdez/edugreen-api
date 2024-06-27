import { Request, Response } from "express";
import ApiError from "../../resources/errors/ApiError";
import NotEnoughDataError from "../../resources/errors/NotEnoughDataError";
import Controller from "../../resources/templates/Controller";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import DataView from "../views/DataView";
import ErrorView from "../views/ErrorView";

export default class UserController extends Controller {
  static async getOne(req: Request, res: Response): Promise<void> {
    const scope = "🕹️ UserController:" + "getOne";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      Logger.write("Getting user info", scope);
      if (req.params.id === undefined) {
        throw new NotEnoughDataError("Can't find the user without the id");
      }
      Logger.write("Returning response", scope);
      new DataView(res, { msg: "funciona!" }, entryTime).send();
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
        new ErrorView(res, err.getCode(), err.getMessage(), entryTime).send();
      } else {
        Logger.error((err as Error).message, scope);
        new ErrorView(res, 500, (err as Error).message, entryTime).send();
      }
    }
  }
}
