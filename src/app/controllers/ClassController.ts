import { Request, Response } from "express";
import ApiError from "../../resources/errors/ApiError";
import NotEnoughDataError from "../../resources/errors/NotEnoughDataError";
import Controller from "../../resources/templates/Controller";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import DataView from "../views/DataView";
import ErrorView from "../views/ErrorView";
import ClassModel from "../models/ClassModel";
import { v4 as uuidv4 } from "uuid";

const className = "🕹️ ClassController";

export default class ClassController extends Controller {
  static async create(req: Request, res: Response): Promise<void> {
    const scope = className + ":" + "create";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { name, description, tutor_id } = req.body;
      if (!name || !tutor_id) {
        throw new NotEnoughDataError("name and tutor_id are required");
      }
      const id = uuidv4();
      Logger.write("Creating class", scope);
      await ClassModel.create(id, name, description ?? null, tutor_id);
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
    const scope = className + ":" + "getOne";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.id) {
        throw new NotEnoughDataError("id param is required");
      }
      Logger.write("Finding class", scope);
      const classObj = await ClassModel.findById(req.params.id);
      if (!classObj) {
        new ErrorView(res, 404, "Class not found", entryTime).send();
        return;
      }
      Logger.write("Returning response", scope);
      new DataView(res, classObj, entryTime).send();
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
    const scope = className + ":" + "updateOne";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.id) {
        throw new NotEnoughDataError("id param is required");
      }
      const { name, description } = req.body;
      const fields: { name?: string; description?: string } = {};
      if (name) fields.name = name;
      if (description) fields.description = description;

      if (Object.keys(fields).length === 0) {
        throw new NotEnoughDataError(
          "At least one field is required to update",
        );
      }
      Logger.write("Finding class", scope);
      const classObj = await ClassModel.findById(req.params.id);
      if (!classObj) {
        new ErrorView(res, 404, "Class not found", entryTime).send();
        return;
      }
      Logger.write("Updating class", scope);
      await ClassModel.updateById(req.params.id, fields);
      Logger.write("Returning response", scope);
      new DataView(
        res,
        { message: "Class updated successfully" },
        entryTime,
      ).send();
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
    const scope = className + ":" + "deleteOne";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.id) {
        throw new NotEnoughDataError("id param is required");
      }
      Logger.write("Finding class", scope);
      const classObj = await ClassModel.findById(req.params.id);
      if (!classObj) {
        new ErrorView(res, 404, "Class not found", entryTime).send();
        return;
      }
      Logger.write("Deleting class", scope);
      await ClassModel.deleteById(req.params.id);
      Logger.write("Returning response", scope);
      new DataView(
        res,
        { message: "Class deleted successfully" },
        entryTime,
      ).send();
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
