import "dotenv/config";
import { loadEnv } from "./config/env";
import { logger } from "./config/logger";
import { app } from "./app";
import { prisma } from "./config/database";

loadEnv();

const PORT = loadEnv().PORT;

async function bootstrap() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to start server");
    process.exit(1);
  }
}

bootstrap();
