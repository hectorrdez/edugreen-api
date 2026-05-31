import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../../resources/errors/ApiError";
import NotEnoughDataError from "../../resources/errors/NotEnoughDataError";
import Controller from "../../resources/templates/Controller";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import DataView from "../views/DataView";
import ErrorView from "../views/ErrorView";
import NewsletterModel from "../models/NewsletterModel";
import Mailer from "@utils/Mailer";
import NewsletterEmails from "@emails/NewsletterEmails";

const controllerName = "🕹️ NewsletterController";

export default class NewsletterController extends Controller {
  static async subscribe(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "subscribe";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { email } = req.body;
      if (!email) {
        throw new NotEnoughDataError("email is required");
      }
      Logger.write("Finding existing subscription", scope);
      const existing = await NewsletterModel.findByEmail(email);
      if (existing && existing.active) {
        new ErrorView(res, 409, "Email already subscribed", entryTime).send();
        return;
      }
      if (existing && !existing.active) {
        Logger.write("Reactivating subscription", scope);
        await NewsletterModel.setActive(email, true);
        Logger.write("Sending subscription confirmation email", scope);
        new Mailer().send(
          process.env.EMAIL_FROM as string,
          email,
          "You're subscribed to EduGreen",
          NewsletterEmails.subscribeEmail(email),
        );
        Logger.write("Returning response", scope);
        new DataView(res, { message: "Subscribed successfully" }, entryTime).send();
        return;
      }
      Logger.write("Creating new subscription", scope);
      await NewsletterModel.create(uuidv4(), email);
      Logger.write("Sending subscription confirmation email", scope);
      new Mailer().send(
        process.env.EMAIL_FROM as string,
        email,
        "You're subscribed to EduGreen",
        NewsletterEmails.subscribeEmail(email),
      );
      Logger.write("Returning response", scope);
      new DataView(res, { message: "Subscribed successfully" }, entryTime).send();
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

  static async unsubscribe(req: Request, res: Response): Promise<void> {
    const scope = controllerName + ":" + "unsubscribe";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { email } = req.body;
      if (!email) {
        throw new NotEnoughDataError("email is required");
      }
      Logger.write("Finding subscription", scope);
      const existing = await NewsletterModel.findByEmail(email);
      if (!existing || !existing.active) {
        new ErrorView(res, 404, "Subscription not found", entryTime).send();
        return;
      }
      Logger.write("Deactivating subscription", scope);
      await NewsletterModel.setActive(email, false);
      Logger.write("Returning response", scope);
      new DataView(res, { message: "Unsubscribed successfully" }, entryTime).send();
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
      Logger.write("Finding all subscriptions", scope);
      const subscribers = await NewsletterModel.findAll();
      Logger.write("Returning response", scope);
      new DataView(res, subscribers, entryTime).send();
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
