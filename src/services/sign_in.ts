import { Request, Response } from "express";
import { users } from "../models/users";
import db from "../database/connection";
import { and, eq } from "drizzle-orm";

const generatePassword = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};
export const signIn = async (username: string, passoword: string) => {
  const drizzle = await db();
  if (!db) return [];
  return drizzle
    ?.select()
    .from(users)
    .where(and(eq(users.username, username), eq(users.password, passoword)));
};

export const signUp = async (user_info: Object[]) => {
  const drizzle = await db();
  if (!db) return [];
  return await drizzle
    ?.insert(users)
    .values({
      username: Object[1],
      email: Object[2],
      avatar: Object[3],
      password: Object[4],
    });
};

export const forgotPassowrd = async (email: string) => {
  const drizzle = await db();
  const otp = generatePassword();
  if (!db) return [];
  return await drizzle
    ?.update(users)
    .set({ password: otp })
    .where(eq(users.email, email));
};

export const validateOTP = async (email: string, otp: string) => {
  const drizzle = await db();
  if (!db) return [];
  return await drizzle
    ?.select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.password, otp)));
};

export const updatePassword = async (email: string, newpass: string) => {
  const drizzle = await db();
  if (!db) return [];
  return await drizzle
    ?.update(users)
    .set({ password: newpass })
    .where(eq(users.email, email));
};
