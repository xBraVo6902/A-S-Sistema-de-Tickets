/*
  Warnings:

  - Added the required column `order` to the `Priority` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `priority` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `status` ADD COLUMN `order` INTEGER NOT NULL;
