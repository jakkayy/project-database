/*
  Warnings:

  - You are about to drop the column `method` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `method`,
    MODIFY `status` ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `User` ADD COLUMN `balance` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `transfer_user_id` INTEGER NULL,
    `type` ENUM('DEPOSIT', 'TRANSFER_OUT', 'TRANSFER_IN') NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
