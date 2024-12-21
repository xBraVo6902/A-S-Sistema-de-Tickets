/*
  Warnings:

  - You are about to drop the column `priority` on the `ticket` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ticket` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ticket` table. All the data in the column will be lost.
  - Added the required column `priorityId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` DROP COLUMN `priority`,
    DROP COLUMN `status`,
    DROP COLUMN `type`,
    ADD COLUMN `priorityId` INTEGER NOT NULL,
    ADD COLUMN `statusId` INTEGER NOT NULL,
    ADD COLUMN `typeId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `lucideIcon` VARCHAR(191) NOT NULL,
    `hexColor` CHAR(7) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `lucideIcon` VARCHAR(191) NOT NULL,
    `hexColor` CHAR(7) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Priority` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `lucideIcon` VARCHAR(191) NOT NULL,
    `hexColor` CHAR(7) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `Type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_priorityId_fkey` FOREIGN KEY (`priorityId`) REFERENCES `Priority`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
