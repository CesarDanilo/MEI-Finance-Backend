import { randomBytes, createHash } from "node:crypto";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEnv } from "../../config/env";
import { UnauthorizedError } from "../../shared/errors/AppError";
import { parseDurationToMs } from "../../shared/utils/parse-duration";
import { toSafeUser } from "../../shared/utils/user.mapper";
import { AuthRepository } from "./auth.repository";
import { LoginInput } from "./auth.schema";

export type AuthTokensResult = {
  user: ReturnType<typeof toSafeUser>;
  accessToken: string;
  refreshToken: string;
};

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * Autentica credenciais e emite par access + refresh token.
   * Refresh token é armazenado hasheado no banco para permitir revogação no logout.
   */
  async login(input: LoginInput): Promise<AuthTokensResult> {
    const user = await this.authRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError("Credenciais inválidas");
    }
  
    // Usuários criados via Google OAuth não possuem senha (passwordHash null).
    // Trata isso antes do compare pra satisfazer o TS e dar uma mensagem clara.
    if (!user.passwordHash) {
      throw new UnauthorizedError(
        "Este usuário não possui senha cadastrada. Faça login com Google."
      );
    }
  
    const passwordMatch = await compare(input.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedError("Credenciais inválidas");
    }
  
    return this.issueTokenPair(user.id, user);
  }

  async refresh(rawRefreshToken: string): Promise<{ accessToken: string }> {
    const tokenHash = this.hashToken(rawRefreshToken);
    const stored = await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) {
        await this.authRepository.deleteRefreshToken(tokenHash);
      }
      throw new UnauthorizedError("Refresh token inválido ou expirado");
    }

    const accessToken = this.signAccessToken(stored.userId);
    return { accessToken };
  }

  async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (!rawRefreshToken) return;
    const tokenHash = this.hashToken(rawRefreshToken);
    await this.authRepository.deleteRefreshToken(tokenHash);
  }

  async getMe(userId: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError("Usuário não encontrado");
    }
    return user;
  }

  private async issueTokenPair(
    userId: string,
    user: Parameters<typeof toSafeUser>[0]
  ): Promise<AuthTokensResult> {
    const accessToken = this.signAccessToken(userId);
    const refreshToken = randomBytes(64).toString("hex");
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(
      Date.now() + parseDurationToMs(getEnv().JWT_REFRESH_EXPIRES_IN)
    );

    await this.authRepository.createRefreshToken({
      tokenHash,
      userId,
      expiresAt,
    });

    return {
      user: toSafeUser(user),
      accessToken,
      refreshToken,
    };
  }

  private signAccessToken(userId: string): string {
    return jwt.sign({ sub: userId }, getEnv().JWT_SECRET, {
      expiresIn: getEnv().JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      algorithm: "HS256",
    });
  }

  /** Hash SHA-256 do refresh token antes de persistir — protege tokens em repouso no banco. */
  private hashToken(rawToken: string): string {
    return createHash("sha256").update(rawToken).digest("hex");
  }
}
