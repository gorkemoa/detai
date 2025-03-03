-- CreateTable
CREATE TABLE "QuestionSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "wrongAnswers" INTEGER NOT NULL DEFAULT 0,
    "emptyAnswers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    CONSTRAINT "QuestionSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuestionSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionNumber" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "isEmpty" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "QuestionDetail_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "QuestionSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
