import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import {
  changingPremium,
  changingToolVisibility,
  createSection,
  deleteSection,
  getAllToolAdmin,
  getToolsFormatted,
  getToolsInSection,
  saveTool,
  updateSection,
} from "../services/tools-service";

/**
 * Handles admin tool list route. Fetches tools, renders admin view if user is 'admin'.
 * @param req - Express request object (includes user info in `req["user"]`).
 * @param res - Express response object (used to render view).
 */
export const getAllToolAdminHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const adminTool = await getAllToolAdmin();
    const user = req["user"];

    const sections = adminTool.reduce((acc, tool) => {
      if (!acc[tool.sections.id]) {
        acc[tool.sections.id] = {
          ...tool.sections,
          tools: [],
        };
      }

      if (tool.tools) {
        acc[tool.sections.id].tools.push(tool.tools);
      }
      return acc;
    }, {});

    res.render("layouts/main", {
      layout: {
        title: "Manage Tools",
        content: "admin/index",
      },
      content: {
        tools: await getToolsFormatted(),
        adminTools: [...Object.values(sections)],
        session: user,
      },
    });
  },
);

/**
 * GET /admin/section: The new section creation view.
 */
export const getAdminSectionController = expressAsyncHandler(
  async (req, res) => {
    res.render("layouts/main", {
      layout: {
        title: "Add new section",
        content: "admin/new-section",
      },
      content: {
        tools: await getToolsFormatted(),
        session: req["user"],
      },
    });
  },
);

/**
 * POST /admin/section: Creates a new section.
 */
export const postAdminSectionController = expressAsyncHandler(
  async (req, res) => {
    const schema = z.object({
      name: z.string(),
    });

    const body = schema.safeParse(req.body);
    if (body.error) {
      res.render("layouts/main", {
        layout: {
          title: "Add new section",
          content: "admin/new-section",
        },
        content: {
          tools: await getToolsFormatted(),
          session: req["user"],
          errorMessage: "Section name is required",
        },
      });
      return;
    }

    await createSection(body.data.name);
    res.redirect("/admin");
  },
);

/**
 * PUT /admin/section: Edits a section's name.
 */
export const putAdminSectionController = expressAsyncHandler(
  async (req, res) => {
    const schema = z.object({
      id: z.coerce.number().min(1),
      name: z.string(),
    });

    const body = schema.safeParse(req.body);
    if (body.error) {
      res.status(400).json({});
      return;
    }

    await updateSection(body.data.id, body.data.name);
    res.status(200).json();
  },
);

/**
 * DELETE /admin/section: Remove a section.
 */
export const deleteAdminSectionController = expressAsyncHandler(
  async (req, res) => {
    const schema = z.object({
      id: z.coerce.number(),
    });
    console.log(req.body);

    const body = schema.safeParse(req.body);
    if (body.error) {
      res.status(400).json({});
      return;
    }

    if ((await getToolsInSection(body.data.id)).length > 0) {
      res.status(400).json({});
      return;
    }

    await deleteSection(body.data.id);
    res.status(200).json({});
  },
);

/**
 * Handles the route for saving a new tool.
 * It extracts tool data from the request body and uses the `saveTool` service to save it.
 * After saving, it typically redirects or sends a success response.
 *
 * @param req - Express request object (expects tool data in the request body).
 * @param res - Express response object (used to send a response, e.g., redirect or JSON).
 */
export const saveToolHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const toolData = req.body;
    await saveTool(toolData);
    res.redirect("/admin"); //Redirect back to the admin tools list
  },
);

/**
 * Handles the route for changing the premium status of a tool.
 * It extracts the tool ID and the new premium status from the request body and uses the `changingPremium` service to update it.
 * After the update, it typically sends a success response.
 *
 * @param req - Express request object (expects tool ID and premium status in the request body).
 * @param res - Express response object (used to send a response, e.g., JSON).
 */
export const changingPremiumHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const toolId = req.body.id;
    const premiumStatus = req.body.premium === "true";
    await changingPremium(toolId, premiumStatus);
    res.redirect("/admin");
  },
);

/**
 * Handles the route for changing the visibility (state) of a tool.
 * It extracts the tool ID and the new visibility state from the request body and uses the `changingToolVisibility` service to update it.
 * After the update, it typically sends a success response.
 *
 * @param req - Express request object (expects tool ID and state in the request body).
 * @param res - Express response object (used to send a response, e.g., JSON).
 */
export const changingToolVisibilityHandler: RequestHandler =
  expressAsyncHandler(async (req, res) => {
    const toolId = req.body.id;
    const visibilityState = req.body.state as "enabled" | "disabled" | "hidden";
    await changingToolVisibility(toolId, visibilityState);
    res.redirect("/admin");
  });
