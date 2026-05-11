import { Request, Response } from "express";
import ApiError from "../../resources/errors/ApiError";
import NotEnoughDataError from "../../resources/errors/NotEnoughDataError";
import Controller from "../../resources/templates/Controller";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import DataView from "../views/DataView";
import ErrorView from "../views/ErrorView";
import InstitutionModel from "../models/InstitutionModel";
import { v4 as uuidv4 } from "uuid";

const controllerName = "🕹️ InstitutionController";

export default class InstitutionController extends Controller {
  static async create(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "create";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { name, student_domain, teacher_domain } = req.body;
      if (!name || !student_domain || !teacher_domain) {
        throw new NotEnoughDataError("name, student_domain and teacher_domain are required");
      }
      const id = uuidv4();
      Logger.write("Creating institution", scope);
      await InstitutionModel.create(id, name, student_domain, teacher_domain);
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

  static async getAll(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "getAll";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      Logger.write("Finding all institutions", scope);
      const institutions = await InstitutionModel.findAll();
      Logger.write("Returning response", scope);
      new DataView(res, institutions, entryTime).send();
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
      Logger.write("Finding institution", scope);
      const institution = await InstitutionModel.findById(req.params.id);
      if (!institution) {
        new ErrorView(res, 404, "Institution not found", entryTime).send();
        return;
      }
      Logger.write("Returning response", scope);
      new DataView(res, institution, entryTime).send();
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
      const { name, student_domain, teacher_domain } = req.body;
      const fields: { name?: string; student_domain?: string; teacher_domain?: string } = {};
      if (name) fields.name = name;
      if (student_domain) fields.student_domain = student_domain;
      if (teacher_domain) fields.teacher_domain = teacher_domain;

      if (Object.keys(fields).length === 0) {
        throw new NotEnoughDataError("At least one field is required to update");
      }
      Logger.write("Finding institution", scope);
      const institution = await InstitutionModel.findById(req.params.id);
      if (!institution) {
        new ErrorView(res, 404, "Institution not found", entryTime).send();
        return;
      }
      Logger.write("Updating institution", scope);
      await InstitutionModel.updateById(req.params.id, fields);
      Logger.write("Returning response", scope);
      new DataView(res, { message: "Institution updated successfully" }, entryTime).send();
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
      Logger.write("Finding institution", scope);
      const institution = await InstitutionModel.findById(req.params.id);
      if (!institution) {
        new ErrorView(res, 404, "Institution not found", entryTime).send();
        return;
      }
      Logger.write("Deleting institution", scope);
      await InstitutionModel.deleteById(req.params.id);
      Logger.write("Returning response", scope);
      new DataView(res, { message: "Institution deleted successfully" }, entryTime).send();
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
