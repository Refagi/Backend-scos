-- AlterTable
ALTER TABLE "pesanan" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "pesanan_isPaid_idx" ON "pesanan"("isPaid");
