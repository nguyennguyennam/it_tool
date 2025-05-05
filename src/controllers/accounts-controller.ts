import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {
  getAccountByCredentials,
  getAccountByEmail,
  registerAccount,
} from "../services/accounts-service";
import { getToolsFormatted } from "../services/tools-service";
import { UserInfo } from "../types";

/**
 * GET /login: Retrieve the login page.
 */
export const getLoginController = expressAsyncHandler(async (req, res) => {
  res.render("layouts/main", {
    layout: {
      title: "Login",
      content: "login",
    },
    content: {
      tools: await getToolsFormatted(),
      session: req["user"],
    },
  });
});

/**
 * GET /register: Retrieve the register page.
 */
export const getRegisterController = expressAsyncHandler(async (req, res) => {
  res.render("layouts/main", {
    layout: {
      title: "Register",
      content: "register",
    },
    content: {
      tools: await getToolsFormatted(),
      session: req["user"],
    },
  });
});

/**
 * POST /login: Post the login request to the server.
 */
export const postLoginController = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(2),
  });

  const body = schema.safeParse(req.body);
  if (body.error) {
    res.render("layouts/main", {
      layout: {
        title: "Login",
        content: "login",
      },
      content: {
        tools: await getToolsFormatted(),
        session: req["user"],
        errorMessage:
          "Email is invalid or password is shorter than 2 characters.",
      },
    });
    return;
  }

  const accounts = await getAccountByEmail(body.data.email);

  // Doesn't exist.
  if (accounts.length == 0) {
    res.render("layouts/main", {
      layout: {
        title: "Login",
        content: "login",
      },
      content: {
        tools: await getToolsFormatted(),
        session: req["user"],
        errorMessage: "That email doesn't exist.",
      },
    });
    return;
  }

  // Incorrect password.
  if (!bcrypt.compareSync(body.data.password, accounts[0].password)) {
    res.render("layouts/main", {
      layout: {
        title: "Login",
        content: "login",
      },
      content: {
        tools: await getToolsFormatted(),
        session: req["user"],
        errorMessage: "Incorrect password.",
      },
    });
    return;
  }

  // Correct.
  res
    .cookie(
      "authorization",
      jwt.sign(
        {
          id: accounts[0].id,
          username: accounts[0].username,
          role: accounts[0].role,
          premium: accounts[0].premium,
          favoriteTools: [],
        } satisfies UserInfo,
        process.env.SESSION_SECRET!,
      ),
      {
        httpOnly: true,
        sameSite: process.env.SESSION_SAME_SITE as any,
        secure: Boolean(process.env.SESSION_SECURE),
      },
    )
    .redirect("/");
});

/**
 * POST /register: Post the register request to the server.
 */
export const postRegisterController = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    username: z
      .string()
      .min(2)
      .regex(/[a-zA-Z-_][a-zA-Z-_0-9]+/),
    email: z.string().email(),
    password: z.string().min(2),
  });

  const body = schema.safeParse(req.body);
  if (body.error) {
    res.render("layouts/main", {
      layout: {
        title: "Register",
        content: "register",
      },
      content: {
        tools: await getToolsFormatted(),
        session: req["user"],
        errorMessage:
          "Email is invalid or password is shorter than 2 characters.",
      },
    });
    return;
  }

  const accounts = await getAccountByCredentials(
    body.data.username,
    body.data.email,
  );

  // Account conflict
  if (accounts.length == 1) {
    res.render("layouts/main", {
      layout: {
        title: "Register",
        content: "register",
      },
      content: {
        tools: await getToolsFormatted(),
        session: req["user"],
        errorMessage: "Email or username is already taken",
      },
    });
    return;
  }

  const result = await registerAccount({
    ...body.data,
    password: bcrypt.hashSync(body.data.password, 12),
  });

  // Correct.
  res
    .cookie(
      "authorization",
      jwt.sign(
        {
          id: result[0].id,
          username: result[0].username,
          role: result[0].role,
          premium: result[0].premium,
          favoriteTools: [],
        } satisfies UserInfo,
        process.env.SESSION_SECRET!,
      ),
      {
        httpOnly: true,
        sameSite: process.env.SESSION_SAME_SITE as any,
        secure: Boolean(process.env.SESSION_SECURE),
      },
    )
    .redirect("/");
});

export const logoutController = expressAsyncHandler(async (req, res) => {
  res.clearCookie("authorization").redirect("/login");
});