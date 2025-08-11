import mysql from "mysql2/promise";
import { config } from "dotenv";
config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");
    conn.release();
  })
  .catch(err => {
    console.error("❌ ERRO AO CONECTAR COM O BANCO DE DADOS:", err.message);
  });

export interface DbClient {
  (string: TemplateStringsArray, ...values: any[]): Promise<{ rows: any[]; rowCount: number }>
}

export const sql: DbClient = async (strings, ...values) => {
  let query = "";
  strings.forEach((str, i) => {
    query += str;
    if (i < values.length) {
      query += "?";
    }
  });

  const [rows] = await pool.execute(query, values);

  return {
    rows: rows as any[],
    rowCount: Array.isArray(rows) ? rows.length : 0,
  };
};

export const connection = pool; 
