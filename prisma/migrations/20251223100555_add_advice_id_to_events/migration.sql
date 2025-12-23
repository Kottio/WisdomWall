-- AlterTable
ALTER TABLE "event" ADD COLUMN     "adviceId" INTEGER;

-- CreateIndex
CREATE INDEX "event_adviceId_idx" ON "event"("adviceId");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_adviceId_fkey" FOREIGN KEY ("adviceId") REFERENCES "advice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
