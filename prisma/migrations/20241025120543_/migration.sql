/*
  Warnings:

  - You are about to alter the column `year` on the `year` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `year` MODIFY `year` INTEGER NOT NULL;
