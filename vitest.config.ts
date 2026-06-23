import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    include: ["src/tests/**/*.spec.ts"],
    setupFiles: ["./src/tests/setup.ts"],
  },
});
