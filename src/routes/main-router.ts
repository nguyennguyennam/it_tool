import express from "express";
import {
  getLoginController,
  getRegisterController,
  logoutController,
  postLoginController,
  postRegisterController,
} from "../controllers/accounts-controller";
import {
  deleteAdminSectionController,
  deleteAdminToolController,
  getAdminEditToolController,
  getAdminSectionController,
  getAdminToolController,
  getAllToolAdminHandler,
  getRequestPremiumUserHandler,
  postAdminEditToolController,
  postAdminSectionController,
  postAdminToolController,
  postRequestPremiumAdminController,
  putAdminSectionController,
} from "../controllers/admin-controller";
import {
  getHomeHandler,
  getPasteHandler,
  getProfileController,
  getToolHandler,
  postFavoriteToolHandler,
  postRequestPremiumHandler,
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
mainRouter.post("/favorite", authenticate("user"), postFavoriteToolHandler);
mainRouter.post("/premium", authenticate("user"), postRequestPremiumHandler);

mainRouter.route("/admin").get(authenticate("admin"), getAllToolAdminHandler);
mainRouter
  .route("/admin/user")
  .get(authenticate("admin"), getRequestPremiumUserHandler)
  .post(authenticate("admin"), postRequestPremiumAdminController);
mainRouter
  .route("/admin/section")
  .get(authenticate("admin"), getAdminSectionController)
  .post(authenticate("admin"), postAdminSectionController)
  .put(authenticate("admin"), putAdminSectionController)
  .delete(authenticate("admin"), deleteAdminSectionController);
mainRouter
  .route("/admin/tool")
  .get(authenticate("admin"), getAdminToolController)
  .post(authenticate("admin"), postAdminToolController)
  .delete(authenticate("admin"), deleteAdminToolController);
mainRouter
  .route("/admin/tool/:id")
  .get(authenticate("admin"), getAdminEditToolController)
  .post(authenticate("admin"), postAdminEditToolController);

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
