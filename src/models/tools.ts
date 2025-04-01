import * as pg from "drizzle-orm/pg-core";

/**
 * Represents the tool's visibility.
 *
 * - Enabled means that the tool is accessible to users.
 * - Disabled means that the tool is visible on the search, showing a "Disabled" state, but it is not accessible to users.
 * - Hidden means that the tool is completely hidden from the search.
 */
export const visibility = pg.pgEnum("visibility", ["enabled", "disabled", "hidden"]);

/**
 * The table for tools available in the tools set.
 */
export const tools = pg.pgTable("tools", {
  id: pg.serial().primaryKey(),
  name: pg.text().notNull(),
  description: pg.text().notNull(),
  path: pg.text().notNull().unique(),
  premium: pg.boolean().default(false),
  state: visibility().default("disabled"),
});
