import { getAllToolAdmin, saveTool, changingPremium, changingToolVisibility } from "../services/tools-service";
import { getToolsFormatted } from "../services/tools-service";
import expressAsyncHandler from "express-async-handler";
import { RequestHandler } from "express";

/**
 * Handles admin tool list route. Fetches tools, renders admin view if user is 'admin'.
 * @param req - Express request object (includes user info in `req["user"]`).
 * @param res - Express response object (used to render view).
 */
export const getAllToolAdminHandler : RequestHandler = expressAsyncHandler (
    async (req, res) => {
        const adminTool = await getAllToolAdmin();
        const user = req["user"];
        if (user?.role == "admin")
        {
            res.render("layouts/main", {
                layout: {
                    title : "Tools list for Admin",
                    content: "admin",
                }, 
                content: {
                    tools : await getToolsFormatted(),
                    adminTool: adminTool,
                    session: user
                }
            })
        }
    }
 )

 /**
 * Handles the route for saving a new tool.
 * It extracts tool data from the request body and uses the `saveTool` service to save it.
 * After saving, it typically redirects or sends a success response.
 *
 * @param req - Express request object (expects tool data in the request body).
 * @param res - Express response object (used to send a response, e.g., redirect or JSON).
 */

 export const saveToolHandler : RequestHandler = expressAsyncHandler(async (req, res) => {
    const toolData = req.body;
    await saveTool(toolData);
    res.redirect("/admin"); //Redirect back to the admin tools list
 })


 /**
 * Handles the route for changing the premium status of a tool.
 * It extracts the tool ID and the new premium status from the request body and uses the `changingPremium` service to update it.
 * After the update, it typically sends a success response.
 *
 * @param req - Express request object (expects tool ID and premium status in the request body).
 * @param res - Express response object (used to send a response, e.g., JSON).
 */
export const changingPremiumHandler: RequestHandler = expressAsyncHandler(async (req, res) => {
    const toolId = req.body.id;
    const premiumStatus = req.body.premium === 'true';
    await changingPremium(toolId, premiumStatus);
    res.redirect("/admin"); 
  });

  /**
 * Handles the route for changing the visibility (state) of a tool.
 * It extracts the tool ID and the new visibility state from the request body and uses the `changingToolVisibility` service to update it.
 * After the update, it typically sends a success response.
 *
 * @param req - Express request object (expects tool ID and state in the request body).
 * @param res - Express response object (used to send a response, e.g., JSON).
 */
export const changingToolVisibilityHandler: RequestHandler = expressAsyncHandler(async (req, res) => {
    const toolId = req.body.id;
    const visibilityState = req.body.state as 'enabled' | 'disabled' | 'hidden';
    await changingToolVisibility(toolId, visibilityState);
    res.redirect("/admin");
  });
