import { eq, not, sql } from "drizzle-orm";
import { favorites } from "../models/favorite-tools";
import { sections, tools } from "../models/tools";
import { db } from "./db-service";

/**
 * Fetch the tools from the database and reformat it into a proper form
 * for EJS to handle.
 *
 * @returns a list of sections, containing tools in each sections.
 */
export async function getToolsFormatted() {
  const query = await getAllTools();

  // We want to make this into an easy to consume data type for frontend.
  // We want to return an array of sections, where each section contains a "tools" array.
  const sectionsMap = new Map<number, Array<object>>();
  const sectionsData = new Map<number, object>();

  for (const node of query) {
    if (!sectionsData.get(node.sections.id)) {
      sectionsData.set(node.sections.id, node.sections);
      sectionsMap.set(node.sections.id, []);
    }
    sectionsMap.get(node.sections.id)!.push(node.tools);
  }

  // We want to traverse in order.
  const contentData: Array<object> = [];
  sectionsData.forEach((v, k) => {
    contentData.push({
      ...v,
      tools: sectionsMap.get(k),
    });
  });

  return contentData;
}

/**
 * Retrieves a list of tools from the database, without any post processing.
 *
 * @returns a list of unformatted tools
 */
export async function getAllTools() {
  let query = db
    .select()
    .from(tools)
    .innerJoin(sections, eq(tools.section, sections.id))
    .where(not(eq(tools.state, "hidden")));

  const results = await query.execute();
  if (!results || results.length == 0) {
    throw new Error("No tools found.");
  }
  return results;
}

/**
 * Retrieves an array of tools queried via the path string.
 *
 * @param path the path to lookup
 * @returns an array of tools matched by the path, max length 1
 */
export async function getToolByPath(path: string) {
  return db
    .select()
    .from(tools)
    .where(eq(sql`lower(${tools.path})`, path))
    .limit(1);
}

/**
 * Checks for the favorite tools of the user.
 *
 * @param userId The user to check for.
 * @returns the favorite tools of a user
 */
export async function getFavoriteTools(userId: number) {
  return db
    .select({
      id: tools.id,
      name: tools.name,
      description: tools.description,
      path: tools.path,
      state: tools.state,
      premium: tools.premium,
    })
    .from(tools)
    .innerJoin(favorites, eq(favorites.toolId, tools.id))
    .where(eq(favorites.userId, userId));
}

/**
 * Get all of the tools no matters theirs state - enabled, disabled or hidden. for admin
 *
 */
export async function getAllToolAdmin() {
  return await db
    .select()
    .from(sections)
    .leftJoin(tools, eq(tools.section, sections.id))
    .orderBy(sections.id, tools.id);
}

/**
 * Attempts to get tool by their ID.
 *
 * @param id the tool's id
 * @returns the tools array
 */
export async function getToolById(id: number) {
  return await db.select().from(tools).where(eq(tools.id, id));
}

/**
 * Saves tool to DB, sets state "enabled", queries section ID by name.
 * @param tool - Tool details (name*, desc, path*, premium, section*).
 * @returns Promise of insert result (or undefined if section not found).
 */
export async function saveTool(tool: {
  name: string;
  description: string;
  path: string;
  premium: boolean;
  enabled: boolean;
  section: number;
}) {
  return await db.insert(tools).values({
    name: tool.name,
    description: tool.description,
    path: tool.path,
    premium: tool.premium,
    section: tool.section,
    state: tool.enabled ? "enabled" : "disabled",
  });
}

/**
 * Deletes a tool.
 *
 * @param id the tool ID to delete
 * @returns the query result
 */
export async function deleteTool(id: number) {
  return await db.delete(tools).where(eq(tools.id, id));
}

/**
 * Edits a tool using a tool ID.
 *
 * @param data the tool's data
 * @returns the query result
 */
export async function editTool(data: {
  id: number;
  name: string;
  description: string;
  path: string;
  premium: boolean;
  enabled: boolean;
  section: number;
}) {
  return await db
    .update(tools)
    .set({
      name: data.name,
      description: data.description,
      path: data.path,
      premium: data.premium,
      state: data.enabled ? "enabled" : "disabled",
      section: data.section,
    })
    .where(eq(tools.id, data.id));
}

/**
 * Enables/disables a tool by ID by changing its state.
 * @param id - ID of the tool to update (number).
 * @param state - New state ('enabled', 'disabled', 'hidden').
 * @returns Promise of update operation result.
 */

export type visibility = "enabled" | "disabled" | "hidden";
export async function changingToolVisibility(id: number, state: visibility) {
  return await db.update(tools).set({ state: state }).where(eq(tools.id, id));
}

/**
 * Toggles a tool's premium status by ID.
 * @param id - ID of the tool to update (number).
 * @param premium - New premium status (boolean).
 * @returns Promise of update operation result.
 */
export async function changingPremium(id: number, premium: boolean) {
  return await db
    .update(tools)
    .set({ premium: premium })
    .where(eq(tools.id, id));
}

/**
 * Creates a new tools section.
 *
 * @param name the name of the section
 * @returns the query result
 */
export async function createSection(name: string) {
  return await db.insert(sections).values({ name });
}

/**
 * Updates the section with a new name.
 *
 * @param id the section id
 * @param name the new name
 * @returns the query result
 */
export async function updateSection(id: number, name: string) {
  return await db.update(sections).set({ name }).where(eq(sections.id, id));
}

/**
 * Returns a list of tools belonging in a section.
 *
 * @param id the section id
 * @returns the query result
 */
export async function getToolsInSection(id: number) {
  return await db.select().from(tools).where(eq(tools.section, id));
}

/**
 * Deletes a section.
 *
 * @param id the section id
 * @returns the query result
 */
export async function deleteSection(id: number) {
  return await db.delete(sections).where(eq(sections.id, id));
}
