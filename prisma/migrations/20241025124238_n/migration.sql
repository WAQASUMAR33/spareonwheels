-- AlterTable
ALTER TABLE `make` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `model` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `year` ALTER COLUMN `updatedAt` DROP DEFAULT;
