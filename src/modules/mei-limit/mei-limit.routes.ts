import { Router } from "express";
import { meiLimitController } from "./mei-limit.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const meiLimitRouter = Router();

meiLimitRouter.use(authMiddleware);

meiLimitRouter.get(
  "/mei-limit",
  meiLimitController.getLimit.bind(meiLimitController)
);

meiLimitRouter.get(
  "/dashboard/mei-limit",
  meiLimitController.getLimit.bind(meiLimitController)
);

export { meiLimitRouter };
