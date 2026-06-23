import { Router } from "express";
import { userController } from "./user.controller";
import { createUserSchema } from "./user.schema";
import { validateRequest } from "../../middlewares/validateRequest";

const userRouter = Router();

/** Registro público — mantém rota /user por compatibilidade; alias /auth/register no auth router. */
userRouter.post(
  "/user",
  validateRequest({ body: createUserSchema }),
  userController.create.bind(userController)
);

userRouter.post(
  "/auth/register",
  validateRequest({ body: createUserSchema }),
  userController.create.bind(userController)
);

export { userRouter };
