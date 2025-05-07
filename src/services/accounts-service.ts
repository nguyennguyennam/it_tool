import { and, eq, or, sql } from "drizzle-orm";
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

/**
 * Extends the premium subscription of a user by 7 days starting from today.
 *
 * @param user the user id
 */
export async function extendPremium(user: number) {
  const current = await getAccountById(user);
  if (current.length == 0) {
    return;
  }

  await db
    .update(users)
    .set({
      premium: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      requestingPremium: false,
    })
    .where(eq(users.id, user));
}

/**
 * Marks the user's requesting premium state as true.
 *
 * @param user the user id
 */
export async function requestPremium(user: number) {
  await db
    .update(users)
    .set({ requestingPremium: true })
    .where(eq(users.id, user));
}

/**
 * Fetch all of the users need requestingPremium
 *
 */
export async function getRequestPremiumUser() {
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
    .where(and(eq(users.requestingPremium, true), eq(users.role, "user")));
}
