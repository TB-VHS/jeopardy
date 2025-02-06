-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Actor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "actorname" TEXT NOT NULL,
    "spriteFile" TEXT NOT NULL DEFAULT 'actor01.png',
    "HP" INTEGER NOT NULL DEFAULT 100,
    "XP" INTEGER NOT NULL DEFAULT 0,
    "MP" INTEGER NOT NULL DEFAULT 1,
    "nextAction" TEXT
);
INSERT INTO "new_Actor" ("HP", "MP", "XP", "actorname", "id", "nextAction", "token") SELECT "HP", "MP", "XP", "actorname", "id", "nextAction", "token" FROM "Actor";
DROP TABLE "Actor";
ALTER TABLE "new_Actor" RENAME TO "Actor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
