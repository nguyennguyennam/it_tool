import express from "express";
import { getHomeHandler, getToolHandler } from "../controllers/base-controller";
/**
 * This router for base-path routing, with no additional depths.
 *
 * Use other routers for deeper paths, calling from this, such as /a/*,
 * this router only accepts the base path mappings.
 */
const mainRouter = express.Router();


mainRouter.get("/", getHomeHandler);
mainRouter.get("/:tool", getToolHandler);

export default mainRouter;
