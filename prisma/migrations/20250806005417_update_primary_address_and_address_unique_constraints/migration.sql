/*
  Warnings:

  - A unique constraint covering the columns `[latitude,longitude,dong,ho]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `primary_addresses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `primary_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."addresses_coordinate";

-- DropIndex
DROP INDEX "public"."users_unique_name";

-- DropIndex
DROP INDEX "public"."users_unique_password";

-- DropIndex
DROP INDEX "public"."users_unique_pin_number";

-- AlterTable
ALTER TABLE "public"."primary_addresses" ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "addresses_coordinate_dong_ho" ON "public"."addresses"("latitude", "longitude", "dong", "ho");

-- CreateIndex
CREATE UNIQUE INDEX "primary_addresses_user_id_key" ON "public"."primary_addresses"("user_id");

-- AddForeignKey
ALTER TABLE "public"."primary_addresses" ADD CONSTRAINT "primary_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
