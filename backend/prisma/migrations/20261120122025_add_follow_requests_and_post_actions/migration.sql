-- CreateEnum
CREATE TYPE "public"."FollowRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."NotificationType" ADD VALUE 'FOLLOW_REQUEST';
ALTER TYPE "public"."NotificationType" ADD VALUE 'FOLLOW_ACCEPTED';

-- AlterTable
ALTER TABLE "public"."Follower" ADD COLUMN     "status" "public"."FollowRequestStatus" NOT NULL DEFAULT 'ACCEPTED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."SavedPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PostReport" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NotInterestedPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotInterestedPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedPost_userId_idx" ON "public"."SavedPost"("userId");

-- CreateIndex
CREATE INDEX "SavedPost_postId_idx" ON "public"."SavedPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPost_userId_postId_key" ON "public"."SavedPost"("userId", "postId");

-- CreateIndex
CREATE INDEX "PostReport_reporterId_idx" ON "public"."PostReport"("reporterId");

-- CreateIndex
CREATE INDEX "PostReport_postId_idx" ON "public"."PostReport"("postId");

-- CreateIndex
CREATE INDEX "NotInterestedPost_userId_idx" ON "public"."NotInterestedPost"("userId");

-- CreateIndex
CREATE INDEX "NotInterestedPost_postId_idx" ON "public"."NotInterestedPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "NotInterestedPost_userId_postId_key" ON "public"."NotInterestedPost"("userId", "postId");

-- CreateIndex
CREATE INDEX "Follower_followingId_status_idx" ON "public"."Follower"("followingId", "status");

-- CreateIndex
CREATE INDEX "Follower_followerId_status_idx" ON "public"."Follower"("followerId", "status");

-- AddForeignKey
ALTER TABLE "public"."SavedPost" ADD CONSTRAINT "SavedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedPost" ADD CONSTRAINT "SavedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostReport" ADD CONSTRAINT "PostReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostReport" ADD CONSTRAINT "PostReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotInterestedPost" ADD CONSTRAINT "NotInterestedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotInterestedPost" ADD CONSTRAINT "NotInterestedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
