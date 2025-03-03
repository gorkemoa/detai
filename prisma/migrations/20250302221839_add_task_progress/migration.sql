-- CreateTable
CREATE TABLE "TaskProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "percentage" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "TaskProgress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
