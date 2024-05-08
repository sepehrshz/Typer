/*
  Warnings:

  - The primary key for the `Lesson` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Practice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Practice` table. All the data in the column will be lost.
  - You are about to drop the column `isEnable` on the `Practice` table. All the data in the column will be lost.
  - Changed the type of `id` on the `Lesson` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lessonId` on the `Practice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Size" AS ENUM ('SMALL', 'NORMAL', 'BIG');

-- DropForeignKey
ALTER TABLE "Practice" DROP CONSTRAINT "Practice_lessonId_fkey";

-- DropIndex
DROP INDEX "Practice_userLessonId_key";

-- AlterTable
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Practice" DROP CONSTRAINT "Practice_pkey",
DROP COLUMN "id",
DROP COLUMN "isEnable",
DROP COLUMN "lessonId",
ADD COLUMN     "lessonId" INTEGER NOT NULL,
ALTER COLUMN "isComplete" SET DEFAULT false,
ADD CONSTRAINT "Practice_pkey" PRIMARY KEY ("userLessonId");

-- CreateTable
CREATE TABLE "Test" (
    "timeSizeId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "speed" INTEGER[],
    "paragraphId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("timeSizeId")
);

-- CreateTable
CREATE TABLE "Paragraph" (
    "id" INTEGER NOT NULL,
    "size" "Size" NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Paragraph_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_paragraphId_fkey" FOREIGN KEY ("paragraphId") REFERENCES "Paragraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practice" ADD CONSTRAINT "Practice_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
