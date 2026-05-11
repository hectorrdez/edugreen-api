import ApiError from "../../resources/errors/ApiError";
import Model from "../../resources/templates/Model";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import UserClass from "../entities/UserClass";

export default class UserClassModel extends Model {
  private static mapRow(row: any): UserClass {
    return new UserClass(
      row.user_id,
      row.class_id,
      row.joined_at ?? null,
    );
  }

  static async findOne(user_id: string, class_id: string): Promise<UserClass | null> {
    const scope = "💽 UserClassModel:" + "findOne";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding user-class relation", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM user_class WHERE user_id = ? AND class_id = ?;`,
        [user_id, class_id],
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
      throw new ApiError("Can't find the user-class relation");
    }
  }

  static async findByUserId(user_id: string): Promise<UserClass[]> {
    const scope = "💽 UserClassModel:" + "findByUserId";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding classes for user", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM user_class WHERE user_id = ?;`,
        [user_id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
      return rows.map((row: any) => this.mapRow(row));
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find classes for this user");
    }
  }

  static async findByClassId(class_id: string): Promise<UserClass[]> {
    const scope = "💽 UserClassModel:" + "findByClassId";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding users in class", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM user_class WHERE class_id = ?;`,
        [class_id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
      return rows.map((row: any) => this.mapRow(row));
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find users for this class");
    }
  }

  static async create(user_id: string, class_id: string): Promise<void> {
    const scope = "💽 UserClassModel:" + "create";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Adding user to class", scope);
      await this.connection.execute(
        `INSERT INTO user_class (user_id, class_id) VALUES (?, ?);`,
        [user_id, class_id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't add user to class");
    }
  }

  static async delete(user_id: string, class_id: string): Promise<void> {
    const scope = "💽 UserClassModel:" + "delete";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Removing user from class", scope);
      await this.connection.execute(
        `DELETE FROM user_class WHERE user_id = ? AND class_id = ?;`,
        [user_id, class_id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't remove user from class");
    }
  }
}
