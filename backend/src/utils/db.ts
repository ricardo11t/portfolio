import mysql from "mysql2/promise";
import { config } from "dotenv";
config();

export interface DbClient {
    (string: TemplateStringsArray, ...values: any[]): Promise<{ rows: any[]; rowCount: number }>
}

let connection: mysql.Connection;

if (process.env.PROJECT === "production") {
    connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: 3306
    });
} else if (process.env.PROJECT === "development") {
    connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1234",
        database: "portifoliodb",
        port: 3306
    });
}

export const sql: DbClient = async (strings, ...values) => {
    let query = "";
    strings.forEach((str, i) => {
        query += str;
        if(i < values.length) {
            query += "?";
        }
    });

    const [rows] = await connection.execute(query, values);

    return {
        rows: rows as any[],
        rowCount: Array.isArray(rows) ? rows.length : 0,
    };
};

export { connection };
