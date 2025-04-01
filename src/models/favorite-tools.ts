import * as pg from "drizzle-orm/pg-core";
import { tools } from "./tools";
import { users } from "./users";

/**
 * A table that represents the favorite state of a user along a tool.
 *
 * The relationship is Many-Many therefore this additional table is
 * necesasry.
 */
export const favorites = pg.pgTable("favorites", {
  userId: pg.serial("user_id").references(() => users.id),
  toolId: pg.serial("tool_id").references(() => tools.id),
});
