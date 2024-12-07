/*
  Warnings:

  - You are about to drop the column `isClient` on the `person` table. All the data in the column will be lost.
  - Added the required column `role` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `person` DROP COLUMN `isClient`,
    ADD COLUMN `role` ENUM('Admin', 'User', 'Client') NOT NULL;
