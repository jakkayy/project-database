-- AlterTable
ALTER TABLE `ProductStock` ADD COLUMN `shop_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `ProductStock_shop_id_idx` ON `ProductStock`(`shop_id`);

-- AddForeignKey
ALTER TABLE `ProductStock` ADD CONSTRAINT `ProductStock_shop_id_fkey` FOREIGN KEY (`shop_id`) REFERENCES `Shop`(`shop_id`) ON DELETE SET NULL ON UPDATE CASCADE;
