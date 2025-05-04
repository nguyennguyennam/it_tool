import express from "express";
import {
  getLoginController,
  logoutController,
  postLoginController,
} from "../controllers/accounts-controller";
import {
  getHomeHandler,
  getPasteHandler,
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


mainRouter.get("/", getHomeHandler);
mainRouter.get("/:tool", getToolHandler);
mainRouter.get("/", authenticate("none"), getHomeHandler);
mainRouter.get("/404", authenticate("none"), notFoundErrorController);
mainRouter.get("/401", authenticate("none"), unauthorizedErrorController);
mainRouter.get("/paste", authenticate("none"), getPasteHandler);

mainRouter
  .route("/login")
  .get(authenticate("none"), getLoginController)
  .post(postLoginController);
mainRouter.use("/logout", logoutController);

mainRouter.get("/:tool", authenticate("none"), getToolHandler);

export default mainRouter;
