/*
  Warnings:

  - You are about to drop the column `Make` on the `make` table. All the data in the column will be lost.
  - Added the required column `make` to the `Make` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `make` DROP COLUMN `Make`,
    ADD COLUMN `make` VARCHAR(191) NOT NULL;
