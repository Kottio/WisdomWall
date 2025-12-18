/*
  Warnings:

  - You are about to drop the `Advice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdviceComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdviceLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Advice" DROP CONSTRAINT "Advice_studentId_fkey";

-- DropForeignKey
ALTER TABLE "AdviceComment" DROP CONSTRAINT "AdviceComment_adviceId_fkey";

-- DropForeignKey
ALTER TABLE "AdviceComment" DROP CONSTRAINT "AdviceComment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "AdviceLike" DROP CONSTRAINT "AdviceLike_adviceId_fkey";

-- DropForeignKey
ALTER TABLE "AdviceLike" DROP CONSTRAINT "AdviceLike_studentId_fkey";

-- DropTable
DROP TABLE "Advice";

-- DropTable
DROP TABLE "AdviceComment";

-- DropTable
DROP TABLE "AdviceLike";

-- DropTable
DROP TABLE "Student";

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "gitHubUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advice" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "resourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "advice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advice_like" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,
    "adviceId" INTEGER NOT NULL,

    CONSTRAINT "advice_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advice_comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" INTEGER NOT NULL,
    "adviceId" INTEGER NOT NULL,

    CONSTRAINT "advice_comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_username_key" ON "student"("username");

-- CreateIndex
CREATE UNIQUE INDEX "advice_like_studentId_adviceId_key" ON "advice_like"("studentId", "adviceId");

-- AddForeignKey
ALTER TABLE "advice" ADD CONSTRAINT "advice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advice_like" ADD CONSTRAINT "advice_like_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advice_like" ADD CONSTRAINT "advice_like_adviceId_fkey" FOREIGN KEY ("adviceId") REFERENCES "advice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advice_comment" ADD CONSTRAINT "advice_comment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advice_comment" ADD CONSTRAINT "advice_comment_adviceId_fkey" FOREIGN KEY ("adviceId") REFERENCES "advice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
