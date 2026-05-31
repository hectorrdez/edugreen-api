import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import ApiError from "../../resources/errors/ApiError";
import NotEnoughDataError from "../../resources/errors/NotEnoughDataError";
import Controller from "../../resources/templates/Controller";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import DataView from "../views/DataView";
import ErrorView from "../views/ErrorView";
import ChallengeModel from "../models/ChallengeModel";
import ClassModel from "../models/ClassModel";
import UserModel from "../models/UserModel";
import Mailer from "@utils/Mailer";
import ClassEmails from "@emails/ClassEmails";
import { v4 as uuidv4 } from "uuid";

const controllerName = "🕹️ ChallengeController";

function deleteImageFile(imagePath: string | null): void {
  if (!imagePath) return;
  fs.unlink(path.join(process.cwd(), imagePath), () => {});
}

export default class ChallengeController extends Controller {
  static async create(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "create";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { name, class_id, description, points, end_date } = req.body;
      if (!name || !class_id) {
        if (req.file) deleteImageFile(`/uploads/challenges/${req.file.filename}`);
        throw new NotEnoughDataError("name and class_id are required");
      }
      Logger.write("Finding class", scope);
      const classObj = await ClassModel.findById(class_id);
      if (!classObj) {
        if (req.file) deleteImageFile(`/uploads/challenges/${req.file.filename}`);
        new ErrorView(res, 404, "Class not found", entryTime).send();
        return;
      }
      const id = uuidv4();
      const resolvedPoints = points ? Number(points) : 100;
      const autoEnroll = req.body.auto_enroll === "true" || req.body.auto_enroll === true;
      const imagePath = req.file ? `/uploads/challenges/${req.file.filename}` : (req.body.image ?? null);
      Logger.write("Creating challenge", scope);
      await ChallengeModel.create(id, name, class_id, resolvedPoints, autoEnroll, description ?? null, imagePath, end_date ?? null);
      const [challenge, tutor] = await Promise.all([
        ChallengeModel.findById(id),
        UserModel.findById(classObj.tutor_id),
      ]);
      if (tutor) {
        Logger.write("Sending challenge creation notification", scope);
        new Mailer().send(
          process.env.EMAIL_FROM as string,
          tutor.email,
          `Challenge "${name}" created in ${classObj.name}`,
          ClassEmails.challengeCreatedEmail(tutor.name, name, classObj.name, resolvedPoints, description ?? null),
        );
      }
      Logger.write("Returning response", scope);
      new DataView(res, challenge!, entryTime).send();
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
      const user_id = req.query.user_id as string | undefined;
      Logger.write("Finding challenge", scope);
      const challenge = user_id
        ? await ChallengeModel.findByIdWithUserStatus(req.params.id, user_id)
        : await ChallengeModel.findById(req.params.id);
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
      const user_id = req.query.user_id as string | undefined;
      const scope_param = (req.query.scope as string | undefined) ?? "class";
      if (scope_param === "user" && !user_id) {
        throw new NotEnoughDataError("user_id is required when scope is 'user'");
      }
      Logger.write("Finding challenges by class", scope);
      const challenges =
        !user_id
          ? await ChallengeModel.findByClassId(req.params.class_id)
          : scope_param === "user"
            ? await ChallengeModel.findByClassIdEnrolledByUser(req.params.class_id, user_id)
            : await ChallengeModel.findByClassIdWithEnrollment(req.params.class_id, user_id);
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
      const { name, description, points, end_date } = req.body;
      const fields: { name?: string; points?: number; auto_enroll?: boolean; description?: string; image?: string | null; end_date?: string | null } = {};
      if (name) fields.name = name;
      if (points !== undefined) fields.points = Number(points);
      if (description) fields.description = description;
      if (req.body.auto_enroll !== undefined) fields.auto_enroll = req.body.auto_enroll === "true" || req.body.auto_enroll === true;
      if (end_date !== undefined) fields.end_date = end_date === "null" || end_date === null ? null : end_date;

      if (req.file) {
        fields.image = `/uploads/challenges/${req.file.filename}`;
      } else if (req.body.image === "null" || req.body.image === null) {
        fields.image = null;
      } else if (req.body.image !== undefined) {
        fields.image = req.body.image;
      }

      if (Object.keys(fields).length === 0) {
        if (req.file) deleteImageFile(`/uploads/challenges/${req.file.filename}`);
        throw new NotEnoughDataError("At least one field is required to update");
      }
      Logger.write("Finding challenge", scope);
      const challenge = await ChallengeModel.findById(req.params.id);
      if (!challenge) {
        if (req.file) deleteImageFile(`/uploads/challenges/${req.file.filename}`);
        new ErrorView(res, 404, "Challenge not found", entryTime).send();
        return;
      }
      if (req.file && challenge.image) {
        deleteImageFile(challenge.image);
      } else if (fields.image === null && challenge.image) {
        deleteImageFile(challenge.image);
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
      deleteImageFile(challenge.image);
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

  static async uploadImage(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "uploadImage";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.params.id) {
        if (req.file) deleteImageFile(`/uploads/challenges/${req.file.filename}`);
        throw new NotEnoughDataError("id param is required");
      }
      if (!req.file) {
        throw new NotEnoughDataError("image file is required");
      }
      Logger.write("Finding challenge", scope);
      const challenge = await ChallengeModel.findById(req.params.id);
      if (!challenge) {
        deleteImageFile(`/uploads/challenges/${req.file.filename}`);
        new ErrorView(res, 404, "Challenge not found", entryTime).send();
        return;
      }
      if (challenge.image) deleteImageFile(challenge.image);
      const imagePath = `/uploads/challenges/${req.file.filename}`;
      Logger.write("Updating image", scope);
      await ChallengeModel.updateById(req.params.id, { image: imagePath });
      Logger.write("Returning response", scope);
      new DataView(res, { image: imagePath }, entryTime).send();
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

  static async deleteImage(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "deleteImage";
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
      if (!challenge.image) {
        new ErrorView(res, 404, "Challenge has no image", entryTime).send();
        return;
      }
      deleteImageFile(challenge.image);
      Logger.write("Clearing image field", scope);
      await ChallengeModel.updateById(req.params.id, { image: null });
      Logger.write("Returning response", scope);
      new DataView(res, { message: "Image deleted successfully" }, entryTime).send();
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
