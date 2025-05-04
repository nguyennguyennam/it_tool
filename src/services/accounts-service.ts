import { eq, sql } from "drizzle-orm";
import { users } from "../models/users";
import { db } from "./db-service";

/**
 * Attempts to lookup a user using an email.
 *
 * @param email The email address
 * @returns An accounts array
 */
export async function getAccountByEmail(email: string) {
  return await db
    .select()
    .from(users)
    .where(eq(sql`lower(${users.email})`, email.toLowerCase()))
    .limit(1);
}
