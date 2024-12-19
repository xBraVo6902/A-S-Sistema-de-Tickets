/*
  Warnings:

  - The values [Hardware,Software,Other] on the enum `Ticket_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `ticket` MODIFY `type` ENUM('Bug', 'Feature', 'Question') NOT NULL;
