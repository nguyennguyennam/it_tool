import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env["DB_CONNECTION"],
  max: 10,
});

/**
 * The database object, formed by using a connection pool to not overwhelm the database,
 * even though that will never happen.
 */
export const db = drizzle({ client: pool });
