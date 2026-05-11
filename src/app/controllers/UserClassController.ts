import { Request, Response } from "express";
import ApiError from "../../resources/errors/ApiError";
import NotEnoughDataError from "../../resources/errors/NotEnoughDataError";
import Controller from "../../resources/templates/Controller";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import DataView from "../views/DataView";
import ErrorView from "../views/ErrorView";
import UserClassModel from "../models/UserClassModel";
import UserModel from "../models/UserModel";
import ClassModel from "../models/ClassModel";

const controllerName = "🕹️ UserClassController";

export default class UserClassController extends Controller {
  static async addUserToClass(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "addUserToClass";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { user_id, class_id } = req.body;
      if (!user_id || !class_id) {
        throw new NotEnoughDataError("user_id and class_id are required");
      }
      Logger.write("Finding user", scope);
      const user = await UserModel.findById(user_id);
      if (!user) {
        new ErrorView(res, 404, "User not found", entryTime).send();
        return;
      }
      Logger.write("Finding class", scope);
      const classObj = await ClassModel.findById(class_id);
      if (!classObj) {
        new ErrorView(res, 404, "Class not found", entryTime).send();
        return;
      }
      Logger.write("Checking existing relation", scope);
      const existing = await UserClassModel.findOne(user_id, class_id);
      if (existing) {
        new ErrorView(res, 409, "User is already in this class", entryTime).send();
        return;
      }
      Logger.write("Adding user to class", scope);
      await UserClassModel.create(user_id, class_id);
      Logger.write("Returning response", scope);
      new DataView(res, { message: "User added to class successfully" }, entryTime).send();
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

  static async removeUserFromClass(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "removeUserFromClass";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { user_id, class_id } = req.body;
      if (!user_id || !class_id) {
        throw new NotEnoughDataError("user_id and class_id are required");
      }
      Logger.write("Finding user-class relation", scope);
      const existing = await UserClassModel.findOne(user_id, class_id);
      if (!existing) {
        new ErrorView(res, 404, "User is not in this class", entryTime).send();
        return;
      }
      Logger.write("Removing user from class", scope);
      await UserClassModel.delete(user_id, class_id);
      Logger.write("Returning response", scope);
      new DataView(res, { message: "User removed from class successfully" }, entryTime).send();
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

  static async getClassesByUser(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "getClassesByUser";
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
      Logger.write("Finding classes for user", scope);
      const relations = await UserClassModel.findByUserId(req.params.user_id);
      Logger.write("Returning response", scope);
      new DataView(res, relations, entryTime).send();
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

  static async getUsersByClass(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "getUsersByClass";
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
      Logger.write("Finding users in class", scope);
      const relations = await UserClassModel.findByClassId(req.params.class_id);
      Logger.write("Returning response", scope);
      new DataView(res, relations, entryTime).send();
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
