import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

/**
 * The user's role. Signifies what the user can do in this application.
 *
 * - An unregistered user is of permission level 0.
 * - A normal user is of permission level 1. They can favorite tools they like.
 * - A premium user is of permission level 2. They can access premium tools.
 * - An administrative user is of permission level 3. They can enable or disable or hide tools.
 */
export const userRole = pg.pgEnum("user_role", ["user", "premium", "admin"]);

/**
 * The basic user table, includes a simple username, password (hashed) and roles.
 */
export const users = pg.pgTable(
  "users",
  {
    id: pg.serial().primaryKey(),
    username: pg.text().notNull(),
    email: pg.text().notNull(),
    avatar: pg.text(),
    password: pg.text().notNull(),
    role: userRole().notNull().default("user"),
  },
  (table) => [
    {
      username_unique: pg.uniqueIndex("unique_index_username").on(sql`lower(${table.username})`),
      email_unique: pg.uniqueIndex("unique_index_email").on(sql`lower(${table.email})`),
    },
  ]
);
