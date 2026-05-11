import ApiError from "../../resources/errors/ApiError";
import Model from "../../resources/templates/Model";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import Challenge from "../entities/Challenge";

export default class ChallengeModel extends Model {
  private static mapRow(row: any): Challenge {
    return new Challenge(
      row.id,
      row.name,
      row.class_id,
      row.points,
      row.description ?? null,
      row.created_at ?? null,
      row.updated_at ?? null,
    );
  }

  static async findById(id: string): Promise<Challenge | null> {
    const scope = "💽 ChallengeModel:" + "findById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding challenge", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM challenge WHERE id = ?;`,
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
      throw new ApiError("Can't find the challenge");
    }
  }

  static async findByClassId(class_id: string): Promise<Challenge[]> {
    const scope = "💽 ChallengeModel:" + "findByClassId";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding challenges by class", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM challenge WHERE class_id = ?;`,
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
      throw new ApiError("Can't find challenges for this class");
    }
  }

  static async create(id: string, name: string, class_id: string, points: number, description: string | null): Promise<void> {
    const scope = "💽 ChallengeModel:" + "create";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Creating challenge", scope);
      await this.connection.execute(
        `INSERT INTO challenge (id, name, class_id, points, description) VALUES (?, ?, ?, ?, ?);`,
        [id, name, class_id, points, description],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't create the challenge");
    }
  }

  static async updateById(id: string, fields: { name?: string; points?: number; description?: string }): Promise<void> {
    const scope = "💽 ChallengeModel:" + "updateById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      const columns = Object.keys(fields).map((key) => `${key} = ?`).join(", ");
      const values = [...Object.values(fields), id];
      Logger.write("Updating challenge", scope);
      await this.connection.execute(
        `UPDATE challenge SET ${columns} WHERE id = ?;`,
        values,
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't update the challenge");
    }
  }

  static async deleteById(id: string): Promise<void> {
    const scope = "💽 ChallengeModel:" + "deleteById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Deleting challenge", scope);
      await this.connection.execute(`DELETE FROM challenge WHERE id = ?;`, [id]);
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't delete the challenge");
    }
  }
}
