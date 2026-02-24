-- CreateTable
CREATE TABLE `Fav` (
    `fav_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Fav_user_id_key`(`user_id`),
    PRIMARY KEY (`fav_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavItem` (
    `favItem_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fav_id` INTEGER NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `FavItem_fav_id_product_id_key`(`fav_id`, `product_id`),
    PRIMARY KEY (`favItem_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fav` ADD CONSTRAINT `Fav_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavItem` ADD CONSTRAINT `FavItem_fav_id_fkey` FOREIGN KEY (`fav_id`) REFERENCES `Fav`(`fav_id`) ON DELETE CASCADE ON UPDATE CASCADE;
