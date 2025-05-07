import { eq, or, sql } from "drizzle-orm";
import { users } from "../models/users";
import { db } from "./db-service";

export async function getAccountById(id: number) {
  return await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      premium: users.premium,
      requestingPremium: users.requestingPremium,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
}

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

/**
 * Attempts to lookup a user by credentials.
 *
 * @param username The username
 * @param email The email
 * @returns An accounts array
 */
export async function getAccountByCredentials(username: string, email: string) {
  return await db
    .select()
    .from(users)
    .where(
      or(
        eq(sql`lower(${users.username})`, username),
        eq(sql`lower(${users.email})`, email),
      ),
    )
    .limit(1);
}

/**
 * Registers an account
 *
 * @param data The account data to register
 * @returns The query result
 */
export async function registerAccount(data: {
  username: string;
  email: string;
  password: string;
}) {
  return await db
    .insert(users)
    .values({
      username: data.username,
      email: data.email,
      password: data.password,
    })
    .returning();
}
