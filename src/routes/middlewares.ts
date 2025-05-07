import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { getAccountById } from "../services/accounts-service";

type AuthenticationType = "none" | "user" | "premium" | "admin";

export function authenticate(auth: AuthenticationType = "none") {
  return expressAsyncHandler(async (req, res, next) => {
    const authCookie = req.cookies?.authorization;

    if (!authCookie && auth != "none") {
      res.redirect("/401");
      return;
    }

    try {
      if (authCookie) {
        const account = jwt.verify(authCookie, process.env.SESSION_SECRET!);
        const dbAccount = await getAccountById(account["id"]);
        if (dbAccount.length == 0) {
          res.redirect("/401");
          return;
        }

        switch (auth) {
          case "user":
            break;
          case "premium":
            if (
              dbAccount[0].role == "user" &&
              (!dbAccount[0].premium ||
                dbAccount[0].premium.getTime() < Date.now())
            ) {
              res.redirect("/401");
              return;
            }
            break;
          case "admin":
            if (dbAccount[0].role != "admin") {
              res.redirect("/401");
              return;
            }
            break;
        }

        req["user"] = dbAccount[0];
      }
    } catch (e) {
      if (auth != "none") {
        res.redirect("/401");
        return;
      }
      req["user"] = null;
    }

    next();
  });
}
