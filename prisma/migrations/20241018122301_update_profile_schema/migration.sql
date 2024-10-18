/*
  Warnings:

  - You are about to drop the column `identifyNumber` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `identifyTypes` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identityNumber]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identityNumber` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identityTypes` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "identifyNumber",
DROP COLUMN "identifyTypes",
ADD COLUMN     "identityNumber" INTEGER NOT NULL,
ADD COLUMN     "identityTypes" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_identityNumber_key" ON "profiles"("identityNumber");
