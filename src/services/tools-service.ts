import { and, eq } from "drizzle-orm";
import { favorites } from "../models/favorite-tools";
import { sections, tools } from "../models/tools";
import { db } from "./db-service";

export async function getAllTools(params: { user?: number }) {
  let query = db
    .select()
    .from(tools)
    .innerJoin(sections, eq(tools.section, sections.id));

  if (params.user) {
    query = query.leftJoin(
      favorites,
      and(eq(favorites.toolId, tools.id), eq(favorites.userId, params.user)),
    );
  }

  return query;
}
