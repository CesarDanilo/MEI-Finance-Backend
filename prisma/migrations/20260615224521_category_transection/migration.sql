/*
  Warnings:

  - You are about to drop the column `color` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the `refresh_tokens` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."refresh_tokens" DROP CONSTRAINT "refresh_tokens_userId_fkey";

-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "color",
DROP COLUMN "icon",
DROP COLUMN "type",
ADD COLUMN     "type" "public"."TransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "transactionDate" SET DATA TYPE DATE;

-- DropTable
DROP TABLE "public"."refresh_tokens";

-- DropEnum
DROP TYPE "public"."CategoryType";
