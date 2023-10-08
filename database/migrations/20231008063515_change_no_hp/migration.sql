/*
  Warnings:

  - You are about to drop the column `noHP` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "noHP",
ADD COLUMN     "phoneNumber" VARCHAR(15);
