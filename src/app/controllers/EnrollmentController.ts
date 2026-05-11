import { Request, Response } from "express";
import ApiError from "../../resources/errors/ApiError";
import NotEnoughDataError from "../../resources/errors/NotEnoughDataError";
import Controller from "../../resources/templates/Controller";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import DataView from "../views/DataView";
import ErrorView from "../views/ErrorView";
import EnrollmentModel from "../models/EnrollmentModel";
import ChallengeModel from "../models/ChallengeModel";
import UserModel from "../models/UserModel";

const controllerName = "🕹️ EnrollmentController";

export default class EnrollmentController extends Controller {
  static async enroll(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "enroll";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { user_id, challenge_id } = req.body;
      if (!user_id || !challenge_id) {
        throw new NotEnoughDataError("user_id and challenge_id are required");
      }
      Logger.write("Finding user", scope);
      const user = await UserModel.findById(user_id);
      if (!user) {
        new ErrorView(res, 404, "User not found", entryTime).send();
        return;
      }
      Logger.write("Finding challenge", scope);
      const challenge = await ChallengeModel.findById(challenge_id);
      if (!challenge) {
        new ErrorView(res, 404, "Challenge not found", entryTime).send();
        return;
      }
      Logger.write("Checking existing enrollment", scope);
      const existing = await EnrollmentModel.findOne(user_id, challenge_id);
      if (existing) {
        new ErrorView(res, 409, "User is already enrolled in this challenge", entryTime).send();
        return;
      }
      Logger.write("Creating enrollment", scope);
      await EnrollmentModel.create(user_id, challenge_id);
      Logger.write("Returning response", scope);
      new DataView(res, { message: "Enrolled successfully" }, entryTime).send();
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
      Logger.write("Finding enrollments by user", scope);
      const enrollments = await EnrollmentModel.findByUserId(req.params.user_id);
      Logger.write("Returning response", scope);
      new DataView(res, enrollments, entryTime).send();
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
      Logger.write("Finding enrollments by challenge", scope);
      const enrollments = await EnrollmentModel.findByChallengeId(req.params.challenge_id);
      Logger.write("Returning response", scope);
      new DataView(res, enrollments, entryTime).send();
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

  static async complete(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "complete";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { user_id, challenge_id } = req.body;
      if (!user_id || !challenge_id) {
        throw new NotEnoughDataError("user_id and challenge_id are required");
      }
      Logger.write("Finding enrollment", scope);
      const enrollment = await EnrollmentModel.findOne(user_id, challenge_id);
      if (!enrollment) {
        new ErrorView(res, 404, "Enrollment not found", entryTime).send();
        return;
      }
      if (enrollment.completed_at) {
        new ErrorView(res, 409, "Challenge already completed", entryTime).send();
        return;
      }
      Logger.write("Marking enrollment as completed", scope);
      await EnrollmentModel.markCompleted(user_id, challenge_id);
      Logger.write("Returning response", scope);
      new DataView(res, { message: "Challenge marked as completed" }, entryTime).send();
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

  static async unenroll(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "unenroll";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { user_id, challenge_id } = req.body;
      if (!user_id || !challenge_id) {
        throw new NotEnoughDataError("user_id and challenge_id are required");
      }
      Logger.write("Finding enrollment", scope);
      const enrollment = await EnrollmentModel.findOne(user_id, challenge_id);
      if (!enrollment) {
        new ErrorView(res, 404, "Enrollment not found", entryTime).send();
        return;
      }
      Logger.write("Deleting enrollment", scope);
      await EnrollmentModel.delete(user_id, challenge_id);
      Logger.write("Returning response", scope);
      new DataView(res, { message: "Unenrolled successfully" }, entryTime).send();
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
