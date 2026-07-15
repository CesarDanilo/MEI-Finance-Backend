import { Router } from "express";
import { authController } from "./auth.controller";
import { loginSchema } from "./auth.schema";
import { validateRequest } from "../../middlewares/validateRequest";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { loginRateLimiter } from "../../middlewares/rateLimiter";
import { googleCallback, redirectToGoogle } from "./controllers/google-auth.controller";

const authRouter = Router();

authRouter.post(
  "/auth/login",
  loginRateLimiter,
  validateRequest({ body: loginSchema }),
  authController.login.bind(authController)
);

authRouter.post("/auth/refresh", authController.refresh.bind(authController));

authRouter.post("/auth/logout", authController.logout.bind(authController));

authRouter.get(
  "/auth/me",
  authMiddleware,
  authController.me.bind(authController)
);

authRouter.get('/auth/google', redirectToGoogle)
authRouter.get('/auth/google/callback', googleCallback)

export { authRouter };
