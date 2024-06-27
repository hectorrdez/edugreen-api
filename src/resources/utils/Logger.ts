import Console from "./Console";
import DateUtils from "./Date";
import fs from "fs";

export default class Logger {
  public static logFileName: string;
  public static errorFileName: string;
  private static createdErroFile: boolean = false;

  public static init() {
    fs.appendFileSync(
      Logger.logFileName,
      `timestamp|scope|type|content` + "\n"
    );
  }

  public static async write(
    text: string,
    scope: string = "⚡ API",
    type: string = "INFO"
  ): Promise<void> {
    const logMessage = `[${DateUtils.obtainCurrentDateString()}][${scope}]${type}: ${text}`;

    fs.appendFileSync(
      Logger.logFileName,
      `${DateUtils.obtainCurrentDateString()}|${scope}|${type}|${text}` + "\n"
    );
    Console.write(logMessage);
  }
  public static async error(
    text: string,
    scope: string = "⚡ API"
  ): Promise<void> {
    if (!this.createdErroFile) {
      fs.appendFileSync(
        Logger.errorFileName,
        `timestamp|scope|type|content` + "\n"
      );
      this.createdErroFile = true;
    }
    fs.appendFileSync(
      Logger.errorFileName,
      `${DateUtils.obtainCurrentDateString()}|${scope}|ERROR|${text}` + "\n"
    );
    this.write(text, scope, "ERROR");
  }
}
