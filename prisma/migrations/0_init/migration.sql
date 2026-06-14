-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'seller', 'customer');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'non_active', 'pending');

-- CreateEnum
CREATE TYPE "MenuCategory" AS ENUM ('Makanan_Berat', 'Cemilan', 'Minuman');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('menunggu', 'ditolak', 'diterima', 'dimasak', 'siap', 'selesai');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCESS', 'REFRESH', 'VERIFY_EMAIL', 'RESET_PASSWORD', 'UPDATE_EMAIL');

-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('info', 'success', 'warning', 'error');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'customer',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "avatar" TEXT,
    "storeName" VARCHAR(150),
    "description" TEXT,
    "location" VARCHAR(200),
    "isOpen" BOOLEAN DEFAULT true,
    "openLabel" VARCHAR(100),
    "logo" TEXT,
    "image" TEXT,
    "qrisImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "newEmail" TEXT,
    "expires" TIMESTAMP(3) NOT NULL,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "category" "MenuCategory" NOT NULL,
    "image" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "stock" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesanan" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'menunggu',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "slot" VARCHAR(50),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_pesanan" (
    "id" TEXT NOT NULL,
    "pesananId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "adminId" TEXT,
    "menuName" VARCHAR(150) NOT NULL,
    "menuPrice" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "subtotal" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detail_pesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifikasi" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotifType" NOT NULL DEFAULT 'info',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "pesananId" TEXT,
    "menuId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "tokens_userId_idx" ON "tokens"("userId");

-- CreateIndex
CREATE INDEX "menu_sellerId_idx" ON "menu"("sellerId");

-- CreateIndex
CREATE INDEX "menu_category_idx" ON "menu"("category");

-- CreateIndex
CREATE UNIQUE INDEX "pesanan_orderNumber_key" ON "pesanan"("orderNumber");

-- CreateIndex
CREATE INDEX "pesanan_customerId_idx" ON "pesanan"("customerId");

-- CreateIndex
CREATE INDEX "pesanan_sellerId_idx" ON "pesanan"("sellerId");

-- CreateIndex
CREATE INDEX "pesanan_status_idx" ON "pesanan"("status");

-- CreateIndex
CREATE INDEX "pesanan_isPaid_idx" ON "pesanan"("isPaid");

-- CreateIndex
CREATE INDEX "pesanan_createdAt_idx" ON "pesanan"("createdAt");

-- CreateIndex
CREATE INDEX "detail_pesanan_pesananId_idx" ON "detail_pesanan"("pesananId");

-- CreateIndex
CREATE INDEX "detail_pesanan_menuId_idx" ON "detail_pesanan"("menuId");

-- CreateIndex
CREATE INDEX "notifikasi_userId_isRead_idx" ON "notifikasi"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifikasi_role_idx" ON "notifikasi"("role");

-- CreateIndex
CREATE INDEX "notifikasi_createdAt_idx" ON "notifikasi"("createdAt");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_pesanan" ADD CONSTRAINT "detail_pesanan_pesananId_fkey" FOREIGN KEY ("pesananId") REFERENCES "pesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_pesanan" ADD CONSTRAINT "detail_pesanan_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_pesanan" ADD CONSTRAINT "detail_pesanan_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

