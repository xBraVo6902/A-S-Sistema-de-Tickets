-- AlterTable
ALTER TABLE `ticket` MODIFY `priority` ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL;
