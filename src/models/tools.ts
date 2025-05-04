import * as pg from "drizzle-orm/pg-core";

/**
 * Represents the tool's visibility.
 *
 * - Enabled means that the tool is accessible to users.
 * - Disabled means that the tool is visible on the search, showing a "Disabled" state, but it is not accessible to users.
 * - Hidden means that the tool is completely hidden from the search.
 */
export const visibility = pg.pgEnum("visibility", [
  "enabled",
  "disabled",
  "hidden",
]);

/**
 * Represents a section for tools. A tool can belong to a section, or no sections,
 * which eventually gets classified as "Uncatergorized".
 */
export const sections = pg.pgTable("sections", {
  id: pg.serial().primaryKey(),
  name: pg.text(),
});

/**
 * The table for tools available in the tools set.
 */
export const tools = pg.pgTable("tools", {
  id: pg.serial().primaryKey(),
  name: pg.text().notNull(),
  description: pg.text().notNull(),
  path: pg.text().notNull().unique(),
  premium: pg.boolean().default(false),
  state: visibility().default("enabled"),
  section: pg.serial("section_id").references(() => sections.id),
});
