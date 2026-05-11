import { Request, Response } from "express";
import ApiError from "../../resources/errors/ApiError";
import NotEnoughDataError from "../../resources/errors/NotEnoughDataError";
import Controller from "../../resources/templates/Controller";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import DataView from "../views/DataView";
import ErrorView from "../views/ErrorView";
import UserModel from "../models/UserModel";

export default class UserController extends Controller {
  static async checkUserExists(req: Request, res: Response): Promise<void> {
    const scope = "🕹️ UserController:" + "checkUserExists";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.query.email) {
        throw new NotEnoughDataError("email query param is required");
      }
      Logger.write("Checking if user exists by email", scope);
      const exists = await UserModel.checkIfEmailExists(
        req.query.email as string,
      );
      Logger.write("Returning response", scope);
      new DataView(res, { exists }, entryTime).send();
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
    const scope = "🕹️ UserController:" + "deleteOne";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.id) {
        throw new NotEnoughDataError("id param is required");
      }
      Logger.write("Finding user", scope);
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        new ErrorView(res, 404, "User not found", entryTime).send();
        return;
      }
      Logger.write("Deleting user", scope);
      await UserModel.deleteById(req.params.id);
      Logger.write("Returning response", scope);
      new DataView(res, { message: "User deleted successfully" }, entryTime).send();
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
    const scope = "🕹️ UserController:" + "updateOne";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.id) {
        throw new NotEnoughDataError("id param is required");
      }
      const { name, lastName, email } = req.body;
      const fields: { name?: string; lastName?: string; email?: string } = {};
      if (name) fields.name = name;
      if (lastName) fields.lastName = lastName;
      if (email) fields.email = email;

      if (Object.keys(fields).length === 0) {
        throw new NotEnoughDataError(
          "At least one field is required to update",
        );
      }

      Logger.write("Finding user", scope);
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new NotEnoughDataError("User not found");
      }

      if (email) {
        Logger.write("Checking email availability", scope);
        const emailTaken = await UserModel.checkIfEmailExists(email);
        if (emailTaken) {
          new ErrorView(res, 409, "Email is already in use", entryTime).send();
          return;
        }
      }

      Logger.write("Updating user", scope);
      await UserModel.updateById(req.params.id, fields);
      Logger.write("Returning response", scope);
      new DataView(
        res,
        { message: "User updated successfully" },
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
  static async getChallenges(req: Request, res: Response): Promise<void> {
    const scope = "🕹️ UserController:" + "getChallenges";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.id) {
        throw new NotEnoughDataError("id param is required");
      }
      Logger.write("Checking user exists", scope);
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        new ErrorView(res, 404, "User not found", entryTime).send();
        return;
      }
      Logger.write("Fetching challenges for user", scope);
      const data = await UserModel.findChallengesByUserId(req.params.id);
      Logger.write("Returning response", scope);
      new DataView(res, { data }, entryTime).send();
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
    const scope = "🕹️ UserController:" + "getOne";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      Logger.write("Getting user info", scope);
      if (req.params.id === undefined) {
        throw new NotEnoughDataError("Can't find the user without the id");
      }
      const response = await UserModel.findById(req.params.id);
      if (!response) {
        new ErrorView(res, 404, "User not found", entryTime).send();
        return;
      }
      Logger.write("Returning response", scope);
      new DataView(res, response, entryTime).send();
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
