import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { requestPremium } from "../services/accounts-service";
import {
  getFavoriteTools,
  getToolByPath,
  getToolsFormatted,
  toggleFavorite,
} from "../services/tools-service";

/**
 * GET /: Retrieves the home page.
 *
 * The home page should contain a list of all tools available. Which also
 * provides a list of favorite tools.
 */
export const getHomeHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const [toolsFormatted, favoriteTools] = await Promise.all([
      getToolsFormatted(),
      getFavoriteTools(req["user"]?.id ?? 0),
    ]);

    res.render("layouts/main", {
      layout: {
        title: "IT Tools",
        content: "home",
      },
      content: {
        tools: toolsFormatted,
        favoriteTools: favoriteTools,
        session: req["user"],
      },
    });
  },
);

/**
 * POST /favorite: Toggles a tool's favoritism.
 */
export const postFavoriteToolHandler = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    id: z.coerce.number().min(1),
  });

  const body = schema.safeParse(req.body);
  if (body.error) {
    res.status(400).json({});
    return;
  }

  await toggleFavorite(req["user"].id, body.data.id);
  res.status(200).json({});
});

/**
 * POST /premium: Applies for a premium subscription.
 */
export const postRequestPremiumHandler = expressAsyncHandler(
  async (req, res) => {
    const user = req["user"];
    await requestPremium(user.id);
    res.redirect("/profile");
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

export const getProfileController = expressAsyncHandler(async (req, res) => {
  const user = req["user"];
  if (!user) {
    res.redirect("/login");
    return;
  }

  res.render("layouts/main", {
    layout: {
      title: "Profile",
      content: "profile",
    },
    content: {
      tools: await getToolsFormatted(),
      selectedTool: 0,
      session: req["user"],
    },
  });
});

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
