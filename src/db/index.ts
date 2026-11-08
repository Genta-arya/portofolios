import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import * as dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;

// Buat pool koneksi MySQL dengan timeout ramah-serverless (3.5s) agar tidak menyebabkan timeout 500 di Vercel
const pool = dbUrl
  ? mysql.createPool({
      uri: dbUrl,
      waitForConnections: true,
      connectionLimit: 4,
      queueLimit: 0,
      connectTimeout: 3500,
      enableKeepAlive: true,
    })
  : mysql.createPool({
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 3306,
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'gentha_portfolio_db',
      waitForConnections: true,
      connectionLimit: 4,
      queueLimit: 0,
      connectTimeout: 3500,
      enableKeepAlive: true,
    });

export const db = drizzle(pool, { schema, mode: 'default' });
export { pool };
