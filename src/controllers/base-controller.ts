import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { getAllTools } from "../services/tools-service";

/**
 * GET /: Retrieves the home page.
 *
 * The home page should contain a list of all tools available. Which also
 * provides a list of favorite tools.
 */
export const getHomeHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const query = await getAllTools({});

    // We want to make this into an easy to consume data type for frontend.
    // We want to return an array of sections, where each section contains a "tools" array.
    const sectionsMap = new Map<number, Array<object>>();
    const sectionsData = new Map<number, object>();

    for (const node of query) {
      if (!sectionsData.get(node.sections.id)) {
        sectionsData.set(node.sections.id, node.sections);
        sectionsMap.set(node.sections.id, []);
      }
      sectionsMap.get(node.sections.id)!.push(node.tools);
    }

    // We want to traverse in order.
    const contentData: Array<object> = [];
    sectionsData.forEach((v, k) => {
      contentData.push({
        ...v,
        tools: sectionsMap.get(k),
      });
    });

    res.render("layouts/main", {
      layout: {
        title: "IT Tools",
        content: "home",
      },
      content: {
        tools: contentData,
      },
    });
  },
);
