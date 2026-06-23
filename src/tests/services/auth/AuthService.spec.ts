import { describe, it, expect, beforeEach, vi } from "vitest";
import { hash } from "bcryptjs";
import { AuthService } from "../../../modules/auth/auth.service";
import { UnauthorizedError } from "../../../shared/errors/AppError";
import { InMemoryUserStore } from "../../mocks/in-memory-user.store";

describe("AuthService", () => {
  let userStore: InMemoryUserStore;
  let authService: AuthService;

  const createMockAuthRepository = () => ({
    findByEmail: vi.fn((email: string) => userStore.findByEmail(email)),
    findById: vi.fn(async (id: string) => {
      const user = await userStore.findById(id);
      if (!user) return null;
      const { passwordHash: _, ...publicUser } = user;
      return publicUser;
    }),
    createRefreshToken: vi.fn(async () => ({ id: "rt-1" })),
    findRefreshTokenByHash: vi.fn(),
    deleteRefreshToken: vi.fn(),
    deleteAllRefreshTokensForUser: vi.fn(),
    deleteExpiredRefreshTokens: vi.fn(),
  });

  beforeEach(async () => {
    userStore = new InMemoryUserStore();
    authService = new AuthService(createMockAuthRepository() as never);
    await userStore.create({
      name: "João Silva",
      email: "joao@email.com",
      passwordHash: await hash("Senha123", 10),
    });
  });

  it("autentica com credenciais válidas e retorna accessToken", async () => {
    const result = await authService.login({
      email: "joao@email.com",
      password: "Senha123",
    });

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user.email).toBe("joao@email.com");
    expect(result.user).not.toHaveProperty("passwordHash");
  });

  it("lança UnauthorizedError quando usuário não existe", async () => {
    await expect(
      authService.login({ email: "naoexiste@email.com", password: "Senha123" })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("lança UnauthorizedError quando senha está incorreta", async () => {
    await expect(
      authService.login({ email: "joao@email.com", password: "SenhaErrada1" })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
