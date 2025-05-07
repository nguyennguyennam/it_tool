import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import {
  createSection,
  deleteSection,
  deleteTool,
  editTool,
  getAllToolAdmin,
  getToolById,
  getToolsFormatted,
  getToolsInSection,
  saveTool,
  updateSection,
} from "../services/tools-service";
import { getRequestPremiumUser } from "../services/accounts-service";

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
 * GET /admin/tool: Retrieve the new tool form.
 */
export const getAdminToolController = expressAsyncHandler(async (req, res) => {
  res.render("layouts/main", {
    layout: {
      title: "New Tool",
      content: "admin/new-tool",
    },
    content: {
      tools: await getToolsFormatted(),
      session: req["user"],
    },
  });
});

/**
 * POST /admin/tool: Create a new tool.
 */
export const postAdminToolController = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string(),
    description: z.string(),
    path: z.string(),
    premium: z.coerce.boolean().default(false),
    enabled: z.coerce.boolean().default(true),
    section: z.coerce.number().min(1),
  });

  const body = schema.safeParse(req.body);
  if (body.error) {
    res.render("layouts/main", {
      layout: {
        title: "New Tool",
        content: "admin/new-tool",
      },
      content: {
        tools: await getToolsFormatted(),
        session: req["user"],
        errorMessage: "Some fields are not filled in correctly.",
      },
    });
    return;
  }

  await saveTool(body.data);
  res.redirect("/admin");
});

/**
 * DELETE /admin/tool: Deletes a tool.
 */
export const deleteAdminToolController = expressAsyncHandler(
  async (req, res) => {
    const schema = z.object({
      id: z.coerce.number().min(1),
    });

    const body = schema.safeParse(req.body);
    if (body.error) {
      res.status(400).json({});
      return;
    }

    await deleteTool(body.data.id);
    res.status(200).json({});
  },
);

/**
 * GET /admin/tool/:id: Gets the editing form for editing a tool.
 */
export const getAdminEditToolController = expressAsyncHandler(
  async (req, res) => {
    const schema = z.object({
      id: z.coerce.number().min(1),
    });

    const params = schema.safeParse(req.params);
    if (params.error) {
      res.redirect("/admin");
      return;
    }

    const tools = await getToolById(params.data.id);
    if (tools.length == 0) {
      res.redirect("/admin");
      return;
    }

    res.render("layouts/main", {
      layout: {
        title: "Edit Tool",
        content: "admin/edit-tool",
      },
      content: {
        tools: await getToolsFormatted(),
        tool: tools[0],
        session: req["user"],
      },
    });
  },
);

/**
 * POST /admin/tool/:id: Edits a tool render endpoint.
 */
export const postAdminEditToolController = expressAsyncHandler(
  async (req, res) => {
    const paramsSchema = z.object({
      id: z.coerce.number().min(1),
    });
    const bodySchema = z.object({
      id: z.coerce.number().min(1),
      name: z.string(),
      description: z.string(),
      path: z.string(),
      premium: z.coerce.boolean().default(false),
      enabled: z.coerce.boolean().default(true),
      section: z.coerce.number().min(1),
    });

    const params = paramsSchema.safeParse(req.params);
    if (params.error) {
      res.redirect("/admin");
      return;
    }

    const tools = await getToolById(params.data.id);
    if (tools.length == 0) {
      res.redirect("/admin");
      return;
    }

    const body = bodySchema.safeParse(req.body);
    if (body.error) {
      res.render("layouts/main", {
        layout: {
          title: "Edit Tool",
          content: "admin/edit-tool",
        },
        content: {
          tools: await getToolsFormatted(),
          session: req["user"],
          tool: tools[0],
          errorMessage: "Some fields have invalid values",
        },
      });
      return;
    }

    await editTool(body.data);
    res.redirect("/admin");
  },
);

export const getRequestPremiumUserHandler : RequestHandler = 
expressAsyncHandler(async (req, res) => {
    res.render("layouts/main", {
        layout: {
            layout: "Requesting Premium Users",
            content: "admin/requesting-premium-user"
        },
        content: {
            tools: await getToolsFormatted(),
            requestingUser : await getRequestPremiumUser()
        }
    })
})
