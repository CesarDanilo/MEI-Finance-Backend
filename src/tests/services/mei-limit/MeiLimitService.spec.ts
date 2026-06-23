import { describe, it, expect, beforeEach, vi } from "vitest";
import { TransactionType } from "@prisma/client";
import { MeiLimitService } from "../../../modules/mei-limit/mei-limit.service";

describe("MeiLimitService", () => {
  const mockTransactionRepository = {
    sumIncomeByYear: vi.fn(),
  };

  let meiLimitService: MeiLimitService;

  beforeEach(() => {
    vi.clearAllMocks();
    meiLimitService = new MeiLimitService(mockTransactionRepository as never);
  });

  it("calcula percentual e alerta quando >= 80%", async () => {
    mockTransactionRepository.sumIncomeByYear.mockResolvedValue(70_000);

    const status = await meiLimitService.getLimitStatus("user-1", 2026);

    expect(status.accumulated).toBe(70_000);
    expect(status.limit).toBe(81_000);
    expect(status.alert).toBe(true);
    expect(status.remaining).toBe(11_000);
  });
});
