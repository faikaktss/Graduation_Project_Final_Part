/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `ProductPhoto` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,order]` on the table `ProductPhoto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jti]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ProductPhoto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashedToken` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jti` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."RefreshToken_token_key";

-- AlterTable
ALTER TABLE "public"."ProductPhoto" DROP COLUMN "deletedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."RefreshToken" DROP COLUMN "token",
ADD COLUMN     "hashedToken" TEXT NOT NULL,
ADD COLUMN     "jti" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "deletedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "ProductPhoto_productId_order_key" ON "public"."ProductPhoto"("productId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_jti_key" ON "public"."RefreshToken"("jti");
