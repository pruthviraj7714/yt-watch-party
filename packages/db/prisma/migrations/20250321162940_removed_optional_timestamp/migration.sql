/*
  Warnings:

  - Made the column `currentTimestamp` on table `Party` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Party" ALTER COLUMN "currentTimestamp" SET NOT NULL;
