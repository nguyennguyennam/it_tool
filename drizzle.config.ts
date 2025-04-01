import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/models/",
  out: "./drizzle",
  dbCredentials: {
    user: process.env["DB_USER"],
    password: process.env["DB_PASS"],
    host: process.env["DB_HOST"] || "localhost",
    port: parseInt(process.env["DB_PORT"] || "5432"),
    database: "it_tools",
  },
});
