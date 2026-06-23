import { Request, Response, NextFunction } from "express";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { getEnv } from "../../config/env";
import { parseDurationToMs } from "../../shared/utils/parse-duration";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

const REFRESH_COOKIE_NAME = "refresh_token";

function setRefreshCookie(res: Response, refreshToken: string): void {
  const env = getEnv();
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN),
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: getEnv().NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
  });
}

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      setRefreshCookie(res, result.refreshToken);
      res.status(200).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
      const result = await authService.refresh(rawToken ?? "");
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
      await authService.logout(rawToken);
      clearRefreshCookie(res);
      res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getMe(req.user.id);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
