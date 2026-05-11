import DateUtils from "@utils/Date";
import Controller from "../../resources/templates/Controller";
import NotEnoughDataError from "@errors/NotEnoughDataError";
import UserModel from "@models/UserModel";
import InstitutionModel from "@models/InstitutionModel";
import { Request, Response } from "express";
import DataView from "@views/DataView";
import Logger from "@utils/Logger";
import ErrorView from "@views/ErrorView";
import ApiError from "@errors/ApiError";
import InfoNotFoundError from "@errors/InfoNotFoundError";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const className = "🕹️ AuthController";

export default class AuthController extends Controller {
  static async login(req: Request, res: Response): Promise<void> {
    const scope = className + ":" + "login";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new NotEnoughDataError("email and password are required");
      }

      Logger.write("Finding user by email", scope);
      const user = await UserModel.findByEmail(email);
      if (!user) {
        throw new InfoNotFoundError();
      }

      Logger.write("Checking password", scope);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        new ErrorView(res, 401, "Invalid credentials", entryTime).send();
        return;
      }

      Logger.write("Generating tokens", scope);
      const sessionToken = jwt.sign(
        {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        process.env.API_SECRET as string,
        { expiresIn: "1h" },
      );
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.API_REFRESH_SECRET as string,
        { expiresIn: "7d" },
      );

      Logger.write("Returning response", scope);
      new DataView(
        res,
        { id: user.id, sessionToken, refreshToken },
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
  static async refreshSession(req: Request, res: Response): Promise<void> {
    const scope = className + ":" + "refreshSession";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (!req.body.refreshToken) {
        throw new NotEnoughDataError("refreshToken is required");
      }

      let decoded: jwt.JwtPayload;
      try {
        decoded = jwt.verify(
          req.body.refreshToken,
          process.env.API_REFRESH_SECRET as string,
        ) as jwt.JwtPayload;
      } catch {
        new ErrorView(
          res,
          401,
          "Invalid or expired refresh token",
          entryTime,
        ).send();
        return;
      }

      Logger.write("Finding user by id", scope);
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        throw new InfoNotFoundError();
      }

      Logger.write("Generating new access token", scope);
      const sessionToken = jwt.sign(
        {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        process.env.API_SECRET as string,
        { expiresIn: "1h" },
      );

      Logger.write("Returning response", scope);
      new DataView(res, { sessionToken }, entryTime).send();
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
  static async createUser(req: Request, res: Response): Promise<void> {
    const scope = className + ":" + "createUser";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      const { name, lastName, email, password } = req.body;
      if (!name || !lastName || !email || !password) {
        throw new NotEnoughDataError(
          "name, lastName, email and password are required",
        );
      }

      Logger.write("Checking if email is already in use", scope);
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser !== null) {
        new ErrorView(res, 409, "Email is already in use", entryTime).send();
        return;
      }

      Logger.write("Hashing password", scope);
      const hashedPassword = await bcrypt.hash(password, 10);

      Logger.write("Detecting institution by email domain", scope);
      const domain = email.split("@")[1];
      const institutionMatch = await InstitutionModel.findByDomain(domain);
      const role = institutionMatch?.role ?? "student";
      const institution_id = institutionMatch?.institution.id ?? null;

      const id = uuidv4();
      Logger.write("Creating user in database", scope);
      await UserModel.create(
        id,
        name,
        lastName,
        email,
        hashedPassword,
        role,
        institution_id,
      );

      Logger.write("Generating tokens", scope);
      const sessionToken = jwt.sign(
        { id, name, lastName, email, role },
        process.env.API_SECRET as string,
        { expiresIn: "1h" },
      );
      const refreshToken = jwt.sign(
        { id },
        process.env.API_REFRESH_SECRET as string,
        { expiresIn: "7d" },
      );

      Logger.write("Returning response", scope);
      new DataView(res, { id, role, sessionToken, refreshToken }, entryTime).send();
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
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    const scope = className + ":" + "forgotPassword";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      Logger.write("Getting user info", scope);
      if (req.body.email === undefined) {
        throw new NotEnoughDataError("Can't find the user without the email");
      }
      Logger.write("Email exists, generating token", scope);
      const user = await UserModel.findByEmail(req.body.email);
      if (!user) {
        throw new InfoNotFoundError();
      }
      const passwordToken = jwt.sign(
        { id: user.id, email: req.body.email },
        process.env.API_SECRET as string,
        { expiresIn: "5m" },
      );
      Logger.write("Returning response", scope);
      new DataView(res, { passwordToken }, entryTime).send();
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
  static async changePassword(req: Request, res: Response): Promise<void> {
    const scope = className + ":" + "changePassword";
    const entryTime = DateUtils.obtainCurrentDateString();
    try {
      if (req.params.token === undefined) {
        throw new NotEnoughDataError("Token is required");
      }
      if (req.body.password === undefined) {
        throw new NotEnoughDataError("New password is required");
      }

      Logger.write("Verifying token", scope);
      let decoded: jwt.JwtPayload;
      try {
        decoded = jwt.verify(
          req.params.token,
          process.env.API_SECRET as string,
        ) as jwt.JwtPayload;
      } catch {
        new ErrorView(res, 401, "Invalid or expired token", entryTime).send();
        return;
      }

      Logger.write("Finding user by email", scope);
      const user = await UserModel.findByEmail(decoded.email);
      if (user === null) {
        throw new InfoNotFoundError();
      }

      Logger.write("Hashing new password", scope);
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      Logger.write("Updating password in database", scope);
      await UserModel.updatePasswordById(user.id, hashedPassword);

      Logger.write("Password updated successfully", scope);
      new DataView(
        res,
        { message: "Password updated successfully" },
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
