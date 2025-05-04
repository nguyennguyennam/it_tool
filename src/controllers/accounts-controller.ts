import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { getAccountByEmail } from "../services/accounts-service";
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
      session: req.session["user"],
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
        session: req.session["user"],
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
        session: req.session["user"],
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
        session: req.session["user"],
        errorMessage: "Incorrect password.",
      },
    });
    return;
  }

  // Correct.
  req.session["user"] = {
    id: accounts[0].id,
    username: accounts[0].username,
    role: accounts[0].role,
    premium: accounts[0].premium,
    favoriteTools: [],
  } satisfies UserInfo;
  req.session.save();
  res.redirect("/");
});
