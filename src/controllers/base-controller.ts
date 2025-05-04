import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { getToolByPath, getToolsFormatted } from "../services/tools-service";

/**
 * GET /: Retrieves the home page.
 *
 * The home page should contain a list of all tools available. Which also
 * provides a list of favorite tools.
 */
export const getHomeHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    res.render("layouts/main", {
      layout: {
        title: "IT Tools",
        content: "home",
      },
      content: {
        tools: await getToolsFormatted(),
        session: req["user"],
      },
    });
  },
);

/**
 * GET /paste?text=: Displays the text encoded in the
 */
export const getPasteHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const decoded = atob((req.query?.text as string) ?? "");

    res.render("layouts/main", {
      layout: {
        title: "Paste",
        content: "paste",
      },
      content: {
        tools: await getToolsFormatted(),
        selectedTool: 0,
        session: req["user"],
        paste: decoded,
      },
    });
  },
);

/**
 * GET /:tool: Retrieve the tool at the path.
 */
export const getToolHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const [tool, formattedTools] = await Promise.all([
      getToolByPath(req.params.tool),
      getToolsFormatted(),
    ]);

    // Render tool not found.
    if (tool.length == 0) {
      res.render("layouts/main", {
        layout: {
          title: "Tool not found",
          content: "404",
        },
        content: {
          tools: formattedTools,
          selectedTool: 0,
          session: req["user"],
        },
      });
      return;
    }

    const user = req["user"];

    // Disable access if:
    // - The tool is not enabled, and the user is not an admin.
    // - Tool is premium but user is not logged in or not authorized.
    if (
      user?.role != "admin" &&
      (tool[0].state != "enabled" ||
        (tool[0].premium &&
          (!user || !user.premium || user.premium.getTime() < Date.now())))
    ) {
      res.render("layouts/main", {
        layout: {
          title: "Unauthorized",
          content: "401",
        },
        content: {
          tools: formattedTools,
          session: req["user"],
        },
      });
      return;
    }

    res.render("layouts/main", {
      layout: {
        title: tool[0].name,
        content: tool[0].path,
      },
      content: {
        tools: formattedTools,
        selectedTool: tool[0].id,
        session: req["user"],
      },
    });
  },
);
