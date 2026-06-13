// src/tests/services/authenticate.user.service.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUserRepository } from "../../../repository/inMemory/InMemoryUserRepository";
import { AuthenticateUserService } from "../../../services/auth/authenticate.user.service";

let userRepository: InMemoryUserRepository;
let sut: AuthenticateUserService;

describe("AuthenticateUserService", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    userRepository = new InMemoryUserRepository();
    sut = new AuthenticateUserService(userRepository);
  });

  it("deve autenticar com credenciais válidas e retornar token", async () => {
    await userRepository.create({
      name: "João Silva",
      email: "joao@email.com",
      passwordHash: await hash("Senha123", 6),
    });

    const result = await sut.execute("joao@email.com", "Senha123");

    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("joao@email.com");
    expect(result.user).not.toHaveProperty("passwordHash");
  });

  it("deve lançar erro quando usuário não existe", async () => {
    await expect(
      sut.execute("naoexiste@email.com", "Senha123")
    ).rejects.toThrow("Invalid credentials");
  });

  it("deve lançar erro quando senha está incorreta", async () => {
    await userRepository.create({
      name: "João Silva",
      email: "joao@email.com",
      passwordHash: await hash("Senha123", 6),
    });

    await expect(
      sut.execute("joao@email.com", "SenhaErrada1")
    ).rejects.toThrow("Invalid credentials");
  });

  it("deve lançar erro quando email é inválido", async () => {
    await expect(
      sut.execute("email-invalido", "Senha123")
    ).rejects.toThrow();
  });

  it("deve lançar erro quando password está vazia", async () => {
    await expect(
      sut.execute("joao@email.com", "")
    ).rejects.toThrow();
  });

  it("deve retornar user sem passwordHash exposto", async () => {
    await userRepository.create({
      name: "João Silva",
      email: "joao@email.com",
      passwordHash: await hash("Senha123", 6),
    });

    const result = await sut.execute("joao@email.com", "Senha123");

    expect(result.user).toEqual({
      id: expect.any(String),
      name: "João Silva",
      email: "joao@email.com",
    });
  });
});