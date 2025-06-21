/*
  Warnings:

  - You are about to drop the column `Model` on the `model` table. All the data in the column will be lost.
  - You are about to drop the column `Year` on the `year` table. All the data in the column will be lost.
  - Added the required column `model` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Year` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `model` DROP COLUMN `Model`,
    ADD COLUMN `model` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `year` DROP COLUMN `Year`,
    ADD COLUMN `year` VARCHAR(191) NOT NULL;
