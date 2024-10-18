/*
  Warnings:

  - You are about to drop the column `bankAccountNumber` on the `bank_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `bankName` on the `bank_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `bank_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `identityNumber` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `identityTypes` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `destinationAccountId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `sourceAccountId` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bank_account_number]` on the table `bank_accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identity_number]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bank_account_number` to the `bank_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_name` to the `bank_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `bank_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identity_number` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identity_types` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destination_account_id` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_account_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_destinationAccountId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_sourceAccountId_fkey";

-- DropIndex
DROP INDEX "bank_accounts_bankAccountNumber_key";

-- DropIndex
DROP INDEX "profiles_identityNumber_key";

-- DropIndex
DROP INDEX "profiles_userId_key";

-- AlterTable
ALTER TABLE "bank_accounts" DROP COLUMN "bankAccountNumber",
DROP COLUMN "bankName",
DROP COLUMN "userId",
ADD COLUMN     "bank_account_number" INTEGER NOT NULL,
ADD COLUMN     "bank_name" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "identityNumber",
DROP COLUMN "identityTypes",
DROP COLUMN "userId",
ADD COLUMN     "identity_number" INTEGER NOT NULL,
ADD COLUMN     "identity_types" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "destinationAccountId",
DROP COLUMN "sourceAccountId",
ADD COLUMN     "destination_account_id" INTEGER NOT NULL,
ADD COLUMN     "source_account_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_bank_account_number_key" ON "bank_accounts"("bank_account_number");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_identity_number_key" ON "profiles"("identity_number");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_source_account_id_fkey" FOREIGN KEY ("source_account_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_destination_account_id_fkey" FOREIGN KEY ("destination_account_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
