-- AlterTable
ALTER TABLE `person` ADD COLUMN `isFirstLogin` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `temporaryToken` VARCHAR(191) NULL,
    ADD COLUMN `tokenExpiry` DATETIME(3) NULL;
