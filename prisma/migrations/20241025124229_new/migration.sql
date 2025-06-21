/*
  Warnings:

  - Added the required column `makeId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `make` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `model` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `makeId` INTEGER NOT NULL,
    ADD COLUMN `modelId` INTEGER NOT NULL,
    ADD COLUMN `yearId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `year` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `fk_makeId` FOREIGN KEY (`makeId`) REFERENCES `Make`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `fk_modelId` FOREIGN KEY (`modelId`) REFERENCES `Model`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `fk_yearId` FOREIGN KEY (`yearId`) REFERENCES `Year`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
