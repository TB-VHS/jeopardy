/*
  Warnings:

  - Made the column `mapSectionX` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mapSectionY` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PLAYER',
    "pwHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" INTEGER NOT NULL,
    "actorToken" TEXT,
    "mapSectionX" INTEGER NOT NULL,
    "mapSectionY" INTEGER NOT NULL
);
INSERT INTO "new_User" ("actorId", "actorToken", "createdAt", "email", "id", "mapSectionX", "mapSectionY", "pwHash", "role", "username") SELECT "actorId", "actorToken", "createdAt", "email", "id", "mapSectionX", "mapSectionY", "pwHash", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
