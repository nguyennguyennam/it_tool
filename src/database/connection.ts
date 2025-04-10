import { Pool } from "pg";
import * as toolSchema from "../models/tools";
import * as userSchema from "../models/users";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const db = async () => {
  try {
    const pool = new Pool({
      connectionString: process.env.DB_CONNECTION,
      idleTimeoutMillis: 3000,
    });

    const client = await pool.connect();
    console.log("Database connection successful!");
    client.release();
    return drizzle(pool, { schema: { ...userSchema, ...toolSchema }}); 
  } catch (err) {
    console.error("Error connecting to the database:", err);
    return null; // Return null if connection fails
  }
}

export default db;