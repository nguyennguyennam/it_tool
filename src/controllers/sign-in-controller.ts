import { Request, Response } from "express";
import * as sign_in from "../services/sign_in";

export const signin_Controller = async (req: Request, res: Response) => {
  try {
    if (!req.body || !("name" in req.body) || !("password" in req.body)) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    const { name, password } = req.body as { name: string; password: string };
    const result = await sign_in.signIn(name, password);
    if (result) {
      return res.status(200).json({ message: "Sign in successful", data: result });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Sign in error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
