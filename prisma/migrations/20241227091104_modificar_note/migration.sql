/*
  Warnings:

  - You are about to drop the column `content` on the `note` table. All the data in the column will be lost.
  - Added the required column `newValue` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prevValue` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `note` DROP COLUMN `content`,
    ADD COLUMN `newValue` TEXT NOT NULL,
    ADD COLUMN `prevValue` TEXT NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
