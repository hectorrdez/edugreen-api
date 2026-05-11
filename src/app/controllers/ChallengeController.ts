import { Request, Response } from "express";
import ApiError from "../../resources/errors/ApiError";
import NotEnoughDataError from "../../resources/errors/NotEnoughDataError";
import Controller from "../../resources/templates/Controller";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import DataView from "../views/DataView";
import ErrorView from "../views/ErrorView";
import ChallengeModel from "../models/ChallengeModel";
import ClassModel from "../models/ClassModel";
import { v4 as uuidv4 } from "uuid";

const controllerName = "🕹️ ChallengeController";

export default class ChallengeController extends Controller {
  static async create(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "create";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { name, class_id, description, points } = req.body;
      if (!name || !class_id) {
        throw new NotEnoughDataError("name and class_id are required");
      }
      Logger.write("Finding class", scope);
      const classObj = await ClassModel.findById(class_id);
      if (!classObj) {
        new ErrorView(res, 404, "Class not found", entryTime).send();
        return;
      }
      const id = uuidv4();
      Logger.write("Creating challenge", scope);
      await ChallengeModel.create(id, name, class_id, points ?? 100, description ?? null);
      Logger.write("Returning response", scope);
      new DataView(res, { id }, entryTime).send();
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

  static async getOne(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "getOne";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.id) {
        throw new NotEnoughDataError("id param is required");
      }
      Logger.write("Finding challenge", scope);
      const challenge = await ChallengeModel.findById(req.params.id);
      if (!challenge) {
        new ErrorView(res, 404, "Challenge not found", entryTime).send();
        return;
      }
      Logger.write("Returning response", scope);
      new DataView(res, challenge, entryTime).send();
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
      Logger.write("Finding challenges by class", scope);
      const challenges = await ChallengeModel.findByClassId(req.params.class_id);
      Logger.write("Returning response", scope);
      new DataView(res, challenges, entryTime).send();
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

  static async updateOne(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "updateOne";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.id) {
        throw new NotEnoughDataError("id param is required");
      }
      const { name, description, points } = req.body;
      const fields: { name?: string; points?: number; description?: string } = {};
      if (name) fields.name = name;
      if (points !== undefined) fields.points = points;
      if (description) fields.description = description;

      if (Object.keys(fields).length === 0) {
        throw new NotEnoughDataError("At least one field is required to update");
      }
      Logger.write("Finding challenge", scope);
      const challenge = await ChallengeModel.findById(req.params.id);
      if (!challenge) {
        new ErrorView(res, 404, "Challenge not found", entryTime).send();
        return;
      }
      Logger.write("Updating challenge", scope);
      await ChallengeModel.updateById(req.params.id, fields);
      Logger.write("Returning response", scope);
      new DataView(res, { message: "Challenge updated successfully" }, entryTime).send();
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

  static async deleteOne(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "deleteOne";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.id) {
        throw new NotEnoughDataError("id param is required");
      }
      Logger.write("Finding challenge", scope);
      const challenge = await ChallengeModel.findById(req.params.id);
      if (!challenge) {
        new ErrorView(res, 404, "Challenge not found", entryTime).send();
        return;
      }
      Logger.write("Deleting challenge", scope);
      await ChallengeModel.deleteById(req.params.id);
      Logger.write("Returning response", scope);
      new DataView(res, { message: "Challenge deleted successfully" }, entryTime).send();
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
