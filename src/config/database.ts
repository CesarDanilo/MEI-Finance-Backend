import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getEnv } from "./env";

const adapter = new PrismaPg({ connectionString: getEnv().DATABASE_URL });

/** Instância única do Prisma Client — toda persistência passa pelos repositories. */
export const prisma = new PrismaClient({ adapter });
