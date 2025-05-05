import express from "express";
import {
  getLoginController,
  getRegisterController,
  logoutController,
  postLoginController,
  postRegisterController,
} from "../controllers/accounts-controller";
import {
  getHomeHandler,
  getPasteHandler,
  getProfileController,
  getToolHandler,
} from "../controllers/base-controller";
import {
  notFoundErrorController,
  unauthorizedErrorController,
} from "../controllers/error-controller";
import { authenticate } from "./middlewares";

/**
 * This router for base-path routing, with no additional depths.
 *
 * Use other routers for deeper paths, calling from this, such as /a/*,
 * this router only accepts the base path mappings.
 */
const mainRouter = express.Router();

mainRouter.get("/", authenticate("none"), getHomeHandler);
mainRouter.get("/404", authenticate("none"), notFoundErrorController);
mainRouter.get("/401", authenticate("none"), unauthorizedErrorController);
mainRouter.get("/paste", authenticate("none"), getPasteHandler);
mainRouter.get("/profile", authenticate("none"), getProfileController);

mainRouter
  .route("/login")
  .get(authenticate("none"), getLoginController)
  .post(postLoginController);
mainRouter
  .route("/register")
  .get(authenticate("none"), getRegisterController)
  .post(postRegisterController);

mainRouter.use("/logout", logoutController);

mainRouter.get("/:tool", authenticate("none"), getToolHandler);

export default mainRouter;
