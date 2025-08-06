/*
  Warnings:

  - You are about to drop the `primary_addresses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."primary_addresses" DROP CONSTRAINT "primary_addresses_user_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."primary_addresses" DROP CONSTRAINT "primary_addresses_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."user_addresses" ADD COLUMN     "is_primary" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."primary_addresses";
