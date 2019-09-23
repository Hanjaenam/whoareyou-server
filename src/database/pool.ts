import mysql from 'mysql2/promise';

const host =
  process.env.NODE_ENV === 'production' ? process.env.DB_URL : 'localhost';

const pool = mysql.createPool({
  connectionLimit: Number(process.env.CONNECTION_LIMIT),
  host,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export const testConnection = (): Promise<void> =>
  pool
    .getConnection()
    .then(conn => {
      console.log('✅ MySQL connect success', host);
      conn.release();
    })
    .catch(error => {
      if (error) console.log('❌ MySQL connect error: ', error);
      process.exit(1);
    });

export default pool;
