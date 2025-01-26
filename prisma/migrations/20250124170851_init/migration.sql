-- CreateTable
CREATE TABLE "Actor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "actorname" TEXT NOT NULL,
    "HP" INTEGER NOT NULL DEFAULT 100,
    "XP" INTEGER NOT NULL DEFAULT 0,
    "MP" INTEGER NOT NULL DEFAULT 1,
    "nextAction" TEXT
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "usage" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "MapTile" (
    "coordX" INTEGER NOT NULL,
    "coordY" INTEGER NOT NULL,
    "terrain" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',

    PRIMARY KEY ("coordX", "coordY")
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PLAYER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" INTEGER NOT NULL,
    "actorToken" TEXT,
    "mapSectionX" INTEGER,
    "mapSectionY" INTEGER
);

-- CreateTable
CREATE TABLE "GameLogic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "turn" INTEGER NOT NULL DEFAULT 1,
    "locked" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
