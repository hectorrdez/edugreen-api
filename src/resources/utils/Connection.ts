import { createPool, Pool } from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_NAME, DB_PASS, DB_USER } = process.env;

export default class Connection {
    private pool: Pool;

    constructor() {
        this.pool = createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }

    async execute(sql: string, data: Array<any> = []) {
        try {
            const connection = await this.pool.getConnection();
            const [rows, fields] = await connection.execute(sql, data);
            connection.release();
            return [rows, fields];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
