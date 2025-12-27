-- CreateTable
CREATE TABLE "FemboyProfileImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FemboyProfileImage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "FemboyProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RenterProfileImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RenterProfileImage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "RenterProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
