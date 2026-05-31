import ApiError from "../../resources/errors/ApiError";
import Model from "../../resources/templates/Model";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import Newsletter from "../entities/Newsletter";

export default class NewsletterModel extends Model {
  private static mapRow(row: any): Newsletter {
    return new Newsletter(
      row.id,
      row.email,
      Boolean(row.active),
      row.subscribed_at ?? null,
      row.unsubscribed_at ?? null,
    );
  }

  static async findByEmail(email: string): Promise<Newsletter | null> {
    const scope = "💽 NewsletterModel:" + "findByEmail";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding newsletter subscription by email", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM newsletter WHERE email = ?;`,
        [email],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
      if (rows[0] === undefined) return null;
      return this.mapRow(rows[0]);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find the newsletter subscription");
    }
  }

  static async findAll(): Promise<Newsletter[]> {
    const scope = "💽 NewsletterModel:" + "findAll";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding all newsletter subscriptions", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM newsletter;`,
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
      return rows.map((row: any) => this.mapRow(row));
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find newsletter subscriptions");
    }
  }

  static async create(id: string, email: string): Promise<void> {
    const scope = "💽 NewsletterModel:" + "create";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Creating newsletter subscription", scope);
      await this.connection.execute(
        `INSERT INTO newsletter (id, email) VALUES (?, ?);`,
        [id, email],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't create newsletter subscription");
    }
  }

  static async setActive(email: string, active: boolean): Promise<void> {
    const scope = "💽 NewsletterModel:" + "setActive";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Updating newsletter subscription status", scope);
      await this.connection.execute(
        `UPDATE newsletter SET active = ?, unsubscribed_at = ? WHERE email = ?;`,
        [active, active ? null : new Date(), email],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't update newsletter subscription status");
    }
  }
}
