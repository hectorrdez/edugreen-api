import ApiError from "../../resources/errors/ApiError";
import Model from "../../resources/templates/Model";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import User from "../entities/User";

export default class UserModel extends Model {
  private static mapRow(row: any): User {
    return new User(
      row.id,
      row.name,
      row.lastName,
      row.email,
      row.password,
      row.old_password ?? null,
      row.role,
      row.points ?? 0,
      row.institution_id ?? null,
      row.created_at ?? null,
      row.updated_at ?? null,
      row.last_login_at ?? null,
    );
  }

  static async findById(id: string): Promise<User | null> {
    const scope = "💽 UserModel:" + "findById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding the user", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM user WHERE id = ?;`,
        [id],
      );
      Logger.write(
        `The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`,
        scope,
      );
      if (rows[0] === undefined) return null;
      return this.mapRow(rows[0]);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find the User");
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    const scope = "💽 UserModel:" + "findByEmail";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding the user", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM user WHERE email = ?;`,
        [email],
      );
      Logger.write(
        `The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`,
        scope,
      );
      if (rows[0] === undefined) return null;
      return this.mapRow(rows[0]);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find the User");
    }
  }
  static async create(
    id: string,
    name: string,
    lastName: string,
    email: string,
    hashedPassword: string,
    role: "student" | "teacher" | "admin",
    institution_id: string | null,
  ): Promise<void> {
    const scope = "💽 UserModel:" + "create";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Creating user", scope);
      await this.connection.execute(
        `INSERT INTO user (id, name, lastName, email, password, role, institution_id) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [id, name, lastName, email, hashedPassword, role, institution_id],
      );
      Logger.write(
        `The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`,
        scope,
      );
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't create the user");
    }
  }
  static async updatePasswordById(
    id: string,
    hashedPassword: string,
  ): Promise<void> {
    const scope = "💽 UserModel:" + "updatePasswordById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Updating password for user", scope);
      await this.connection.execute(
        `UPDATE user SET password = ? WHERE id = ?;`,
        [hashedPassword, id],
      );
      Logger.write(
        `The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`,
        scope,
      );
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't update the user password");
    }
  }
  static async deleteById(id: string): Promise<void> {
    const scope = "💽 UserModel:" + "deleteById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Deleting user", scope);
      await this.connection.execute(`DELETE FROM user WHERE id = ?;`, [id]);
      Logger.write(
        `The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`,
        scope,
      );
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't delete the user");
    }
  }

  static async updateById(
    id: string,
    fields: { name?: string; lastName?: string; email?: string },
  ): Promise<void> {
    const scope = "💽 UserModel:" + "updateById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      const columns = Object.keys(fields)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(fields), id];
      Logger.write("Updating user", scope);
      await this.connection.execute(
        `UPDATE user SET ${columns} WHERE id = ?;`,
        values,
      );
      Logger.write(
        `The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`,
        scope,
      );
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't update the user");
    }
  }

  static async findChallengesByUserId(user_id: string): Promise<any[]> {
    const scope = "💽 UserModel:" + "findChallengesByUserId";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding challenges for user", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT
          c.id AS challenge_id,
          c.name AS challenge_name,
          c.description,
          c.points,
          c.class_id,
          e.enrolled_at,
          e.completed_at,
          CASE WHEN e.completed_at IS NOT NULL THEN 'completed' ELSE 'in_progress' END AS status
        FROM enrollment e
        JOIN challenge c ON e.challenge_id = c.id
        WHERE e.user_id = ?
        ORDER BY e.enrolled_at DESC;`,
        [user_id],
      );
      Logger.write(
        `The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`,
        scope,
      );
      return rows;
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find challenges for this user");
    }
  }

  static async checkIfEmailExists(email: string): Promise<any> {
    const scope = "💽 UserModel:" + "checkIfEmailExists";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding if the email exists", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT email FROM user WHERE email = ?;`,
        [email],
      );
      Logger.write(
        `The task lasted ${DateUtils.secondsDifferenceFromDate(
          entryTime,
        )} seconds`,
        scope,
      );
      if (rows[0] != undefined) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find the User");
    }
  }
}
