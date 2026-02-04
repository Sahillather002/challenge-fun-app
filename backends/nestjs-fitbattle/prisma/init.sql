-- FitBattle Database Initialization Script (Idempotent)

-- 1. Create Enum Types safely (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CompetitionType') THEN
        CREATE TYPE "CompetitionType" AS ENUM ('SOLO', 'ONE_V_ONE', 'GROUP', 'GLOBAL');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CompetitionStatus') THEN
        CREATE TYPE "CompetitionStatus" AS ENUM ('UPCOMING', 'LIVE', 'COMPLETED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FriendshipStatus') THEN
        CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SnapStatus') THEN
        CREATE TYPE "SnapStatus" AS ENUM ('PENDING', 'VIEWED', 'EXPIRED');
    END IF;
END $$;

-- 2. Create Tables (using IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS "User" (
    "id" UUID PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "username" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "age" INTEGER,
    "level" INTEGER DEFAULT 1 NOT NULL,
    "xp" INTEGER DEFAULT 0 NOT NULL,
    "coins" INTEGER DEFAULT 0 NOT NULL,
    "currentStreak" INTEGER DEFAULT 0 NOT NULL,
    "longestStreak" INTEGER DEFAULT 0 NOT NULL,
    "lastWorkout" TIMESTAMP WITH TIME ZONE,
    "streakFreezes" INTEGER DEFAULT 1 NOT NULL,
    "pushEnabled" BOOLEAN DEFAULT true NOT NULL,
    "reminderTime" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Competition" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "CompetitionType" NOT NULL,
    "status" "CompetitionStatus" DEFAULT 'UPCOMING' NOT NULL,
    "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "prizePool" INTEGER,
    "entryFee" INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Workout" (
    "id" TEXT PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "exerciseType" TEXT NOT NULL,
    "reps" INTEGER,
    "duration" INTEGER,
    "calories" INTEGER,
    "videoUrl" TEXT,
    "verified" BOOLEAN DEFAULT false NOT NULL,
    "xpEarned" INTEGER DEFAULT 0 NOT NULL,
    "coinsEarned" INTEGER DEFAULT 0 NOT NULL,
    "competitionId" TEXT REFERENCES "Competition"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "CompetitionParticipant" (
    "id" TEXT PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "competitionId" TEXT NOT NULL REFERENCES "Competition"("id") ON DELETE CASCADE,
    "score" INTEGER DEFAULT 0 NOT NULL,
    "rank" INTEGER,
    "prizeWon" INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE("userId", "competitionId")
);

CREATE TABLE IF NOT EXISTS "Friendship" (
    "id" TEXT PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "friendId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "status" "FriendshipStatus" DEFAULT 'PENDING' NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE("userId", "friendId")
);

CREATE TABLE IF NOT EXISTS "Achievement" (
    "id" TEXT PRIMARY KEY,
    "key" TEXT UNIQUE NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "xpReward" INTEGER DEFAULT 0 NOT NULL,
    "coinReward" INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "UserAchievement" (
    "id" TEXT PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "achievementId" TEXT NOT NULL REFERENCES "Achievement"("id") ON DELETE CASCADE,
    "unlockedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE("userId", "achievementId")
);

CREATE TABLE IF NOT EXISTS "Story" (
    "id" TEXT PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "caption" TEXT,
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "Snap" (
    "id" TEXT PRIMARY KEY,
    "senderId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "receiverId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "status" "SnapStatus" DEFAULT 'PENDING' NOT NULL,
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Create Indexes (using IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS "User_username_idx" ON "User"("username");
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "Workout_userId_idx" ON "Workout"("userId");
CREATE INDEX IF NOT EXISTS "Workout_competitionId_idx" ON "Workout"("competitionId");
CREATE INDEX IF NOT EXISTS "Competition_status_idx" ON "Competition"("status");
CREATE INDEX IF NOT EXISTS "Story_userId_idx" ON "Story"("userId");
CREATE INDEX IF NOT EXISTS "Story_expiresAt_idx" ON "Story"("expiresAt");
CREATE INDEX IF NOT EXISTS "Snap_senderId_idx" ON "Snap"("senderId");
CREATE INDEX IF NOT EXISTS "Snap_receiverId_idx" ON "Snap"("receiverId");
