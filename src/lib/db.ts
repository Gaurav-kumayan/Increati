import { Pool } from "pg";

// Define the database connection configuration
const config = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  max: Number(process.env.PG_MAX_CONNECTIONS) || 10,
  database: process.env.PG_DATABASE,
  ssl: process.env.PG_SSL_CA
    ? { rejectUnauthorized: true, ca: process.env.PG_SSL_CA.replace(/\\n/g, "\n") }
    : false,
};

// Define a global type for pool management
type PgGlobal = { pool?: Pool };

// Ensure the pool persists in development mode to avoid excessive connections
const globalForPg = globalThis as unknown as PgGlobal;

export const pool = globalForPg.pool ?? new Pool(config);

if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool;
}