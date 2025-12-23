-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventName" TEXT NOT NULL,
    "properties" JSONB NOT NULL,
    "studentId" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_eventName_idx" ON "event"("eventName");

-- CreateIndex
CREATE INDEX "event_studentId_idx" ON "event"("studentId");

-- CreateIndex
CREATE INDEX "event_sessionId_idx" ON "event"("sessionId");

-- CreateIndex
CREATE INDEX "event_createdAt_idx" ON "event"("createdAt");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
