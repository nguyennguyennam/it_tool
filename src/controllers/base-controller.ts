import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { getToolByPath, getToolsFormatted, getAllTools } from "../services/tools-service";

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
        tools: await getToolsFormatted({}),},
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
      getToolsFormatted({}),
    ]);

    res.render("layouts/main", {
      layout: {
        title: tool.length == 0 ? "Tool not found" : tool[0].name,
        content: tool.length == 0 ? "404" : tool[0].path,
      },
      content: {
        tools: formattedTools,
        selectedTool: tool.length == 0 ? 0 : tool[0].id,
      },
    });
  },
);
