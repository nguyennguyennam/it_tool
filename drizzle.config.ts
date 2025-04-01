import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/models/",
  out: "./drizzle",
  dbCredentials: {
    url: process.env["DB_CONNECTION"]!,
    ssl: "prefer",
  },
});
