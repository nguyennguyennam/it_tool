import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.render("pages/login", {
    title: "Login",
    content: "Welcome to IT Tool",
    message: "Please login to continue",
    layout: "layouts/main",
    session: req.session,
  });
});

//Routing for checking user's account while logging in
/**
 * Takes the username and password from the request body, checks if the user exists in the database, and if so, sets the session variables and redirects to the dashboard.
 */
router.post("/login", (req: Request, res: Response) => {});
