import { Router } from "express";
import { reportsController } from "./reports.controller";
import { reportsQuerySchema } from "./reports.schema";
import { validateRequest } from "../../middlewares/validateRequest";
import { authMiddleware } from "../../middlewares/authMiddleware";

const reportsRouter = Router();

reportsRouter.use(authMiddleware);

reportsRouter.get(
  "/reports",
  validateRequest({ query: reportsQuerySchema }),
  reportsController.getReport.bind(reportsController)
);

reportsRouter.get(
  "/reports/monthly",
  validateRequest({ query: reportsQuerySchema }),
  reportsController.getReport.bind(reportsController)
);

export { reportsRouter };
