import expressAsyncHandler from "express-async-handler";
import { getToolsFormatted } from "../services/tools-service";

/**
 * GET /404: Shows the not found page.
 */
export const notFoundErrorController = expressAsyncHandler(async (req, res) => {
  res.render("layouts/main", {
    layout: {
      title: "Not Found",
      content: "404",
    },
    content: {
      tools: await getToolsFormatted(),
      session: req["user"],
    },
  });
});

/**
 * GET /401: Shows the unauthorized page.
 */
export const unauthorizedErrorController = expressAsyncHandler(
  async (req, res) => {
    res.render("layouts/main", {
      layout: {
        title: "Unauthorized",
        content: "400",
      },
      content: {
        tools: await getToolsFormatted(),
        session: req["user"],
      },
    });
  },
);
