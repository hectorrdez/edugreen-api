import ApiError from "../../resources/errors/ApiError";
import Model from "../../resources/templates/Model";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import Enrollment from "../entities/Enrollment";

export default class EnrollmentModel extends Model {
  private static mapRow(row: any): Enrollment {
    return new Enrollment(
      row.user_id,
      row.challenge_id,
      row.enrolled_at ?? null,
      row.completed_at ?? null,
    );
  }

  static async findByUserId(user_id: string): Promise<Enrollment[]> {
    const scope = "💽 EnrollmentModel:" + "findByUserId";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding enrollments by user", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM enrollment WHERE user_id = ?;`,
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
      throw new ApiError("Can't find enrollments for this user");
    }
  }

  static async findByChallengeId(challenge_id: string): Promise<Enrollment[]> {
    const scope = "💽 EnrollmentModel:" + "findByChallengeId";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding enrollments by challenge", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM enrollment WHERE challenge_id = ?;`,
        [challenge_id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
      return rows.map((row: any) => this.mapRow(row));
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find enrollments for this challenge");
    }
  }

  static async findOne(user_id: string, challenge_id: string): Promise<Enrollment | null> {
    const scope = "💽 EnrollmentModel:" + "findOne";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding enrollment", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM enrollment WHERE user_id = ? AND challenge_id = ?;`,
        [user_id, challenge_id],
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
      throw new ApiError("Can't find the enrollment");
    }
  }

  static async create(user_id: string, challenge_id: string): Promise<void> {
    const scope = "💽 EnrollmentModel:" + "create";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Creating enrollment", scope);
      await this.connection.execute(
        `INSERT INTO enrollment (user_id, challenge_id) VALUES (?, ?);`,
        [user_id, challenge_id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't create the enrollment");
    }
  }

  static async markCompleted(user_id: string, challenge_id: string): Promise<void> {
    const scope = "💽 EnrollmentModel:" + "markCompleted";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Marking enrollment as completed", scope);
      await this.connection.execute(
        `UPDATE enrollment SET completed_at = NOW() WHERE user_id = ? AND challenge_id = ?;`,
        [user_id, challenge_id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't mark enrollment as completed");
    }
  }

  static async delete(user_id: string, challenge_id: string): Promise<void> {
    const scope = "💽 EnrollmentModel:" + "delete";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Deleting enrollment", scope);
      await this.connection.execute(
        `DELETE FROM enrollment WHERE user_id = ? AND challenge_id = ?;`,
        [user_id, challenge_id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't delete the enrollment");
    }
  }
}
