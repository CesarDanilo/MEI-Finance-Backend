import { Router } from "express";
import { AuthenticateController } from "../controllers/auth/auth.controller";

const router = Router();
const authenticateController = new AuthenticateController();

router.post("/auth/login", authenticateController.execute)

export default router;