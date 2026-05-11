import RouteNotDeclaredError from "../errors/RouteNotDeclaredError";
import View from "./View";
import { Request, Response } from "express";

export default class Controller {
  static async get(req: Request, res: Response): Promise<View> {
    throw new RouteNotDeclaredError();
  }
  static async post(req: Request, res: Response): Promise<View> {
    throw new RouteNotDeclaredError();
  }
  static async put(req: Request, res: Response): Promise<View> {
    throw new RouteNotDeclaredError();
  }
  static async patch(req: Request, res: Response): Promise<View> {
    throw new RouteNotDeclaredError();
  }
  static async delete(req: Request, res: Response): Promise<View> {
    throw new RouteNotDeclaredError();
  }
}
