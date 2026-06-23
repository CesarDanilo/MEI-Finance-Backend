import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserService } from "../../../modules/user/user.service";
import { ConflictError } from "../../../shared/errors/AppError";

describe("UserService", () => {
  const mockRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    update: vi.fn(),
  };

  let userService: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = new UserService(mockRepository as never);
  });

  it("cria usuário sem expor passwordHash", async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue({
      id: "user-1",
      name: "Maria",
      email: "maria@email.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await userService.create({
      name: "Maria",
      email: "maria@email.com",
      password: "Senha123",
    });

    expect(user).not.toHaveProperty("passwordHash");
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "maria@email.com",
        passwordHash: expect.any(String),
      })
    );
  });

  it("lança ConflictError quando e-mail já existe", async () => {
    mockRepository.findByEmail.mockResolvedValue({ id: "existing" });

    await expect(
      userService.create({
        name: "Maria",
        email: "maria@email.com",
        password: "Senha123",
      })
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
