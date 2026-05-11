import ApiError from "../../resources/errors/ApiError";
import Model from "../../resources/templates/Model";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import Class from "../entities/Class";

export default class ClassModel extends Model {
  private static mapRow(row: any): Class {
    return new Class(
      row.id,
      row.name,
      row.tutor_id,
      row.description ?? null,
      row.created_at ?? null,
      row.updated_at ?? null,
    );
  }

  static async findById(id: string): Promise<Class | null> {
    const scope = "💽 ClassModel:" + "findById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding class", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM class WHERE id = ?;`,
        [id],
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
      throw new ApiError("Can't find the class");
    }
  }

  static async create(id: string, name: string, description: string | null, tutor_id: string): Promise<void> {
    const scope = "💽 ClassModel:" + "create";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Creating class", scope);
      await this.connection.execute(
        `INSERT INTO class (id, name, description, tutor_id) VALUES (?, ?, ?, ?);`,
        [id, name, description, tutor_id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't create the class");
    }
  }

  static async updateById(id: string, fields: { name?: string; description?: string }): Promise<void> {
    const scope = "💽 ClassModel:" + "updateById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      const columns = Object.keys(fields).map((key) => `${key} = ?`).join(", ");
      const values = [...Object.values(fields), id];
      Logger.write("Updating class", scope);
      await this.connection.execute(
        `UPDATE class SET ${columns} WHERE id = ?;`,
        values,
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't update the class");
    }
  }

  static async deleteById(id: string): Promise<void> {
    const scope = "💽 ClassModel:" + "deleteById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Deleting class", scope);
      await this.connection.execute(`DELETE FROM class WHERE id = ?;`, [id]);
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't delete the class");
    }
  }
}
