/*
  Warnings:

  - You are about to drop the column `userRole` on the `notifikasi` table. All the data in the column will be lost.
  - Added the required column `role` to the `notifikasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'pending';

-- AlterTable
ALTER TABLE "notifikasi" DROP COLUMN "userRole",
ADD COLUMN     "menuId" TEXT,
ADD COLUMN     "pesananId" TEXT,
ADD COLUMN     "role" "Role" NOT NULL;

-- CreateIndex
CREATE INDEX "notifikasi_role_idx" ON "notifikasi"("role");

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
