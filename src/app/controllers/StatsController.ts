import { Request, Response } from "express";
import ApiError from "../../resources/errors/ApiError";
import NotEnoughDataError from "../../resources/errors/NotEnoughDataError";
import Controller from "../../resources/templates/Controller";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import DataView from "../views/DataView";
import ErrorView from "../views/ErrorView";
import StatsModel from "../models/StatsModel";
import UserModel from "../models/UserModel";
import ChallengeModel from "../models/ChallengeModel";
import ClassModel from "../models/ClassModel";

const controllerName = "🕹️ StatsController";

export default class StatsController extends Controller {
  static async getByUser(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "getByUser";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.user_id) {
        throw new NotEnoughDataError("user_id param is required");
      }
      Logger.write("Finding user", scope);
      const user = await UserModel.findById(req.params.user_id);
      if (!user) {
        new ErrorView(res, 404, "User not found", entryTime).send();
        return;
      }
      Logger.write("Finding stats for user", scope);
      const history = await StatsModel.findByUserId(req.params.user_id);
      Logger.write("Returning response", scope);
      new DataView(res, { total_points: user.points, history }, entryTime).send();
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

  static async getByChallenge(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "getByChallenge";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.challenge_id) {
        throw new NotEnoughDataError("challenge_id param is required");
      }
      Logger.write("Finding challenge", scope);
      const challenge = await ChallengeModel.findById(req.params.challenge_id);
      if (!challenge) {
        new ErrorView(res, 404, "Challenge not found", entryTime).send();
        return;
      }
      Logger.write("Finding stats for challenge", scope);
      const completions = await StatsModel.findByChallengeId(req.params.challenge_id);
      Logger.write("Returning response", scope);
      new DataView(res, {
        challenge_id: req.params.challenge_id,
        total_completions: completions.length,
        completions,
      }, entryTime).send();
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

  static async getByClass(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "getByClass";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.class_id) {
        throw new NotEnoughDataError("class_id param is required");
      }
      Logger.write("Finding class", scope);
      const classObj = await ClassModel.findById(req.params.class_id);
      if (!classObj) {
        new ErrorView(res, 404, "Class not found", entryTime).send();
        return;
      }
      Logger.write("Calculating class KPIs", scope);
      const kpis = await StatsModel.getClassKpis(req.params.class_id);
      Logger.write("Returning response", scope);
      new DataView(res, { class_id: req.params.class_id, ...kpis }, entryTime).send();
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
