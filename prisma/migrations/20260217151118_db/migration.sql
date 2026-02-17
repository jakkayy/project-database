/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Address` table. All the data in the column will be lost.
  - The primary key for the `Cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Cart` table. All the data in the column will be lost.
  - The primary key for the `CartItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cartId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `CartItem` table. All the data in the column will be lost.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `OrderItem` table. All the data in the column will be lost.
  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Payment` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cart_id,product_id]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_id` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cart_id` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cartItem_id` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cart_id` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderItem_id` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_id` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_userId_fkey`;

-- DropForeignKey
ALTER TABLE `CartItem` DROP FOREIGN KEY `CartItem_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_orderId_fkey`;

-- DropIndex
DROP INDEX `Cart_userId_key` ON `Cart`;

-- DropIndex
DROP INDEX `CartItem_cartId_productId_key` ON `CartItem`;

-- AlterTable
ALTER TABLE `Address` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `userId`,
    ADD COLUMN `address_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`address_id`);

-- AlterTable
ALTER TABLE `Cart` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `userId`,
    ADD COLUMN `cart_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`cart_id`);

-- AlterTable
ALTER TABLE `CartItem` DROP PRIMARY KEY,
    DROP COLUMN `cartId`,
    DROP COLUMN `id`,
    DROP COLUMN `productId`,
    ADD COLUMN `cartItem_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `cart_id` INTEGER NOT NULL,
    ADD COLUMN `product_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`cartItem_id`);

-- AlterTable
ALTER TABLE `Order` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `userId`,
    ADD COLUMN `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`order_id`);

-- AlterTable
ALTER TABLE `OrderItem` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `orderId`,
    ADD COLUMN `orderItem_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `order_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`orderItem_id`);

-- AlterTable
ALTER TABLE `Payment` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `orderId`,
    ADD COLUMN `order_id` INTEGER NOT NULL,
    ADD COLUMN `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`payment_id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Cart_user_id_key` ON `Cart`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `CartItem_cart_id_product_id_key` ON `CartItem`(`cart_id`, `product_id`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `Cart`(`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE;
