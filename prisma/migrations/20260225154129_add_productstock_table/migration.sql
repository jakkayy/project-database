-- CreateTable
CREATE TABLE `ProductStock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` VARCHAR(24) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProductStock_product_id_color_size_key`(`product_id`, `color`, `size`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
