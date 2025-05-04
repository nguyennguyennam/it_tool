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
