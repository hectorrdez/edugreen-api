import ApiError from "../../resources/errors/ApiError";
import Model from "../../resources/templates/Model";
import DateUtils from "../../resources/utils/Date";
import Logger from "../../resources/utils/Logger";
import Stats from "../entities/Stats";

export default class StatsModel extends Model {
  private static mapRow(row: any): Stats {
    return new Stats(
      row.user_id,
      row.challenge_id,
      row.points,
      row.earned_at ?? null,
    );
  }

  static async findByUserId(user_id: string): Promise<Stats[]> {
    const scope = "💽 StatsModel:" + "findByUserId";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding stats by user", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM stats WHERE user_id = ? ORDER BY earned_at DESC;`,
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
      throw new ApiError("Can't find stats for this user");
    }
  }

  static async findByChallengeId(challenge_id: string): Promise<Stats[]> {
    const scope = "💽 StatsModel:" + "findByChallengeId";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Finding stats by challenge", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT * FROM stats WHERE challenge_id = ? ORDER BY earned_at DESC;`,
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
      throw new ApiError("Can't find stats for this challenge");
    }
  }

  static async delete(user_id: string, challenge_id: string): Promise<void> {
    const scope = "💽 StatsModel:" + "delete";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Deleting stats record", scope);
      await this.connection.execute(
        `DELETE FROM stats WHERE user_id = ? AND challenge_id = ?;`,
        [user_id, challenge_id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't delete the stats record");
    }
  }

  static async create(user_id: string, challenge_id: string, points: number): Promise<void> {
    const scope = "💽 StatsModel:" + "create";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Creating stats record", scope);
      await this.connection.execute(
        `INSERT INTO stats (user_id, challenge_id, points) VALUES (?, ?, ?);`,
        [user_id, challenge_id, points],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't create the stats record");
    }
  }

  static async getPlatformKpis(): Promise<{
    total_users: number;
    total_institutions: number;
    total_classes: number;
    total_challenges: number;
    total_enrollments: number;
    completed_enrollments: number;
    completion_rate: number;
  }> {
    const scope = "💽 StatsModel:" + "getPlatformKpis";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Calculating platform KPIs", scope);
      const [
        [usersRows],
        [institutionsRows],
        [classesRows],
        [challengesRows],
        [enrollmentsRows],
        [completedRows],
      ]: any = await Promise.all([
        this.connection.execute(`SELECT COUNT(*) AS total FROM user;`),
        this.connection.execute(`SELECT COUNT(*) AS total FROM institution;`),
        this.connection.execute(`SELECT COUNT(*) AS total FROM class;`),
        this.connection.execute(`SELECT COUNT(*) AS total FROM challenge;`),
        this.connection.execute(`SELECT COUNT(*) AS total FROM enrollment;`),
        this.connection.execute(`SELECT COUNT(*) AS total FROM enrollment WHERE completed_at IS NOT NULL;`),
      ]);

      const total_users = usersRows[0].total;
      const total_institutions = institutionsRows[0].total;
      const total_classes = classesRows[0].total;
      const total_challenges = challengesRows[0].total;
      const total_enrollments = enrollmentsRows[0].total;
      const completed_enrollments = completedRows[0].total;
      const completion_rate = total_enrollments > 0
        ? Math.round((completed_enrollments / total_enrollments) * 100)
        : 0;

      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
      return {
        total_users,
        total_institutions,
        total_classes,
        total_challenges,
        total_enrollments,
        completed_enrollments,
        completion_rate,
      };
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't calculate platform KPIs");
    }
  }

  static async getClassRanking(class_id: string): Promise<{ user_id: string; name: string; lastName: string; email: string; total_points: number; rank: number }[]> {
    const scope = "💽 StatsModel:" + "getClassRanking";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Calculating class ranking", scope);
      const [rows]: any = await this.connection.execute(
        `SELECT
          u.id AS user_id,
          u.name,
          u.lastName,
          u.email,
          COALESCE(SUM(s.points), 0) AS total_points,
          RANK() OVER (ORDER BY COALESCE(SUM(s.points), 0) DESC) AS \`rank\`
        FROM user_class uc
        JOIN user u ON uc.user_id = u.id
        LEFT JOIN stats s ON s.user_id = u.id
          AND s.challenge_id IN (SELECT id FROM challenge WHERE class_id = ?)
        WHERE uc.class_id = ? AND u.role = 'student'
        GROUP BY u.id, u.name, u.lastName, u.email
        ORDER BY total_points DESC;`,
        [class_id, class_id],
      );
      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
      return rows.map((row: any) => ({
        user_id: row.user_id,
        name: row.name,
        lastName: row.lastName,
        email: row.email,
        total_points: Number(row.total_points),
        rank: Number(row.rank),
      }));
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't calculate class ranking");
    }
  }

  static async getClassKpis(class_id: string): Promise<{
    total_students: number;
    total_challenges: number;
    total_enrollments: number;
    completed_enrollments: number;
    completion_rate: number;
    participation_rate: number;
    total_points_awarded: number;
  }> {
    const scope = "💽 StatsModel:" + "getClassKpis";
    const entryTime = DateUtils.obtainCurrentDate();
    try {
      Logger.write("Calculating class KPIs", scope);
      const [
        [studentsRows],
        [challengesRows],
        [enrollmentsRows],
        [completedRows],
        [participantsRows],
        [pointsRows],
      ]: any = await Promise.all([
        this.connection.execute(
          `SELECT COUNT(*) AS total FROM user_class WHERE class_id = ?;`,
          [class_id],
        ),
        this.connection.execute(
          `SELECT COUNT(*) AS total FROM challenge WHERE class_id = ?;`,
          [class_id],
        ),
        this.connection.execute(
          `SELECT COUNT(*) AS total FROM enrollment e
           JOIN challenge c ON e.challenge_id = c.id
           WHERE c.class_id = ?;`,
          [class_id],
        ),
        this.connection.execute(
          `SELECT COUNT(*) AS total FROM enrollment e
           JOIN challenge c ON e.challenge_id = c.id
           WHERE c.class_id = ? AND e.completed_at IS NOT NULL;`,
          [class_id],
        ),
        this.connection.execute(
          `SELECT COUNT(DISTINCT e.user_id) AS total FROM enrollment e
           JOIN challenge c ON e.challenge_id = c.id
           WHERE c.class_id = ?;`,
          [class_id],
        ),
        this.connection.execute(
          `SELECT COALESCE(SUM(s.points), 0) AS total FROM stats s
           JOIN challenge c ON s.challenge_id = c.id
           WHERE c.class_id = ?;`,
          [class_id],
        ),
      ]);

      const total_students = studentsRows[0].total;
      const total_challenges = challengesRows[0].total;
      const total_enrollments = enrollmentsRows[0].total;
      const completed_enrollments = completedRows[0].total;
      const active_students = participantsRows[0].total;
      const total_points_awarded = Number(pointsRows[0].total);

      const completion_rate = total_enrollments > 0
        ? Math.round((completed_enrollments / total_enrollments) * 100)
        : 0;
      const participation_rate = total_students > 0
        ? Math.round((active_students / total_students) * 100)
        : 0;

      Logger.write(`The task lasted ${DateUtils.secondsDifferenceFromDate(entryTime)} seconds`, scope);
      return {
        total_students,
        total_challenges,
        total_enrollments,
        completed_enrollments,
        completion_rate,
        participation_rate,
        total_points_awarded,
      };
    } catch (err) {
      if (err instanceof ApiError) {
        Logger.error(err.getMessage(), scope);
      } else {
        Logger.error((err as Error).message, scope);
      }
      throw new ApiError("Can't calculate class KPIs");
    }
  }
}
