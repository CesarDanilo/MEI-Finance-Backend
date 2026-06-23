import { describe, it, expect, beforeEach, vi } from "vitest";
import { TransactionType } from "@prisma/client";
import { TransactionService } from "../../../modules/transaction/transaction.service";
import { ForbiddenError, NotFoundError } from "../../../shared/errors/AppError";

describe("TransactionService", () => {
  const mockTransactionRepository = {
    create: vi.fn(),
    findByIdAndUserId: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    sumIncomeByYear: vi.fn(),
    aggregateByTypeForPeriod: vi.fn(),
  };

  const mockCategoryRepository = {
    findByIdAndUserId: vi.fn(),
  };

  let transactionService: TransactionService;

  beforeEach(() => {
    vi.clearAllMocks();
    transactionService = new TransactionService(
      mockTransactionRepository as never,
      mockCategoryRepository as never
    );
  });

  it("impede acesso a transação de outro usuário (IDOR)", async () => {
    mockTransactionRepository.findByIdAndUserId.mockResolvedValue(null);

    await expect(
      transactionService.findById("tx-1", "user-1")
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("impede uso de categoria de outro usuário", async () => {
    mockCategoryRepository.findByIdAndUserId.mockResolvedValue(null);

    await expect(
      transactionService.create("user-1", {
        type: TransactionType.INCOME,
        amount: 100,
        transactionDate: new Date(),
        categoryId: "cat-other",
      })
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
