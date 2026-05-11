import ApiError from "../../resources/errors/ApiError";
import Model from "../../resources/templates/Model";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import Institution from "../entities/Institution";

export default class InstitutionModel extends Model {
  static async findById(id: string): Promise<Institution | null> {
    const scope = "💽 InstitutionModel:" + "findById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding institution", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM institution WHERE id = ?;`,
        [id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
      if (rows[0] === undefined) return null;
      return new Institution(rows[0].id, rows[0].name, rows[0].student_domain, rows[0].teacher_domain, rows[0].created_at);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find the institution");
    }
  }

  static async create(id: string, name: string, student_domain: string, teacher_domain: string): Promise<void> {
    const scope = "💽 InstitutionModel:" + "create";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Creating institution", scope);
      await this.connection.execute(
        `INSERT INTO institution (id, name, student_domain, teacher_domain) VALUES (?, ?, ?, ?);`,
        [id, name, student_domain, teacher_domain],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't create the institution");
    }
  }

  static async updateById(id: string, fields: { name?: string; student_domain?: string; teacher_domain?: string }): Promise<void> {
    const scope = "💽 InstitutionModel:" + "updateById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      const columns = Object.keys(fields).map((key) => `${key} = ?`).join(", ");
      const values = [...Object.values(fields), id];
      Logger.write("Updating institution", scope);
      await this.connection.execute(
        `UPDATE institution SET ${columns} WHERE id = ?;`,
        values,
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't update the institution");
    }
  }

  static async deleteById(id: string): Promise<void> {
    const scope = "💽 InstitutionModel:" + "deleteById";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Deleting institution", scope);
      await this.connection.execute(`DELETE FROM institution WHERE id = ?;`, [id]);
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't delete the institution");
    }
  }

  static async findAll(): Promise<Institution[]> {
    const scope = "💽 InstitutionModel:" + "findAll";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding all institutions", scope);
      const [rows]: any = await this.connection.execute(`SELECT * FROM institution;`);
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
      return rows.map((row: any) => new Institution(row.id, row.name, row.student_domain, row.teacher_domain, row.created_at));
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find institutions");
    }
  }

  static async findByDomain(domain: string): Promise<{ institution: Institution; role: "student" | "teacher" } | null> {
    const scope = "💽 InstitutionModel:" + "findByDomain";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding institution by domain", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM institution WHERE student_domain = ? OR teacher_domain = ?;`,
        [domain, domain],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
      if (rows[0] === undefined) return null;
      const institution = new Institution(rows[0].id, rows[0].name, rows[0].student_domain, rows[0].teacher_domain, rows[0].created_at);
      const role = rows[0].teacher_domain === domain ? "teacher" : "student";
      return { institution, role };
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't find the institution");
    }
  }
}
