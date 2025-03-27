/*
  Warnings:

  - A unique constraint covering the columns `[participantId,partyId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Participant_participantId_partyId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Participant_participantId_partyId_key" ON "Participant"("participantId", "partyId");
