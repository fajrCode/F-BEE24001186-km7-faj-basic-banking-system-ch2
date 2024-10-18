-- AlterTable
ALTER TABLE "bank_accounts" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "bank_account_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "identity_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);
