/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Priority` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Status` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Priority_name_key` ON `Priority`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Status_name_key` ON `Status`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Type_name_key` ON `Type`(`name`);
