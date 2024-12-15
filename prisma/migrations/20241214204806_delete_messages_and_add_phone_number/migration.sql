/*
  Warnings:

  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_personId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_ticketId_fkey`;

-- AlterTable
ALTER TABLE `person` ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `message`;

-- CreateIndex
CREATE UNIQUE INDEX `Person_phone_key` ON `Person`(`phone`);
