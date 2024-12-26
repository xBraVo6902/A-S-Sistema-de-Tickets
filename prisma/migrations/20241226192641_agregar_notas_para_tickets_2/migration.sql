/*
  Warnings:

  - Added the required column `ticketId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `note` ADD COLUMN `ticketId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
