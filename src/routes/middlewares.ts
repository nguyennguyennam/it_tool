import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

type AuthenticationType = "none" | "user" | "premium" | "admin";

export function authenticate(auth: AuthenticationType = "none") {
  return expressAsyncHandler(async (req, res, next) => {
    const authCookie = req.cookies?.authorization;

    if (!authCookie && auth != "none") {
      res.redirect("/401");
      return;
    }

    if (authCookie) {
      const account = jwt.verify(authCookie, process.env.SESSION_SECRET!);
      req["user"] = account;
    }

    next();
  });
}
