-- CreateTable
CREATE TABLE "House" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'VIC',
    "postcode" TEXT,
    "lat" REAL,
    "lng" REAL,
    "name" TEXT,
    "yearBuilt" INTEGER NOT NULL,
    "yearBuiltApprox" BOOLEAN NOT NULL DEFAULT false,
    "architectureFirm" TEXT,
    "style" TEXT NOT NULL DEFAULT '[]',
    "materials" TEXT NOT NULL DEFAULT '[]',
    "bedrooms" INTEGER,
    "landSizeSqm" REAL,
    "floorAreaSqm" REAL,
    "description" TEXT,
    "architecturalNotes" TEXT,
    "sourceReferences" TEXT NOT NULL DEFAULT '[]',
    "ownerContact" TEXT,
    "myNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UNREVIEWED',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Architect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "altNames" TEXT NOT NULL DEFAULT '[]',
    "biography" TEXT,
    "website" TEXT,
    "nationality" TEXT,
    "activePeriod" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "HouseArchitect" (
    "houseId" TEXT NOT NULL,
    "architectId" TEXT NOT NULL,

    PRIMARY KEY ("houseId", "architectId"),
    CONSTRAINT "HouseArchitect_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HouseArchitect_architectId_fkey" FOREIGN KEY ("architectId") REFERENCES "Architect" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "houseId" TEXT NOT NULL,
    "url" TEXT,
    "localPath" TEXT,
    "sourceType" TEXT NOT NULL,
    "sourceCitation" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Image_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "houseId" TEXT NOT NULL,
    "awardName" TEXT NOT NULL,
    "awardingBody" TEXT,
    "yearAwarded" INTEGER,
    "notes" TEXT,
    CONSTRAINT "Award_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Architect_name_key" ON "Architect"("name");
