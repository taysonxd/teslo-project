-- CreateEnum
CREATE TYPE "public"."role" AS ENUM ('user', 'admin');

-- AlterEnum
ALTER TYPE "public"."Size" ADD VALUE 'XXXL';

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
