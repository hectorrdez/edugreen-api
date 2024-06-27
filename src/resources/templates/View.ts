import { Response } from "express";
import DateUtils from "../utils/Date";

export default class View {
  protected res: Response;
  protected data: {};
  protected entry: string;
  protected status: string;
  protected code: number;
  protected error: string;

  constructor(
    res: Response,
    data: {},
    entry: string,
    status: string,
    code: number,
    error: string
  ) {
    this.res = res;
    this.data = data;
    this.entry = entry;
    this.status = status;
    this.code = code;
    this.error = error;
  }

  send() {
    this.res.status(this.code).json({
      code: this.code,
      status: this.status,
      entry: this.entry,
      exit: DateUtils.obtainCurrentDateString(),
      error: this.error,
      data: this.data,
    });
  }
}
