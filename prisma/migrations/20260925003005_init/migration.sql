-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "departureFrom" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "tripType" TEXT NOT NULL,
    "attractions" TEXT[],
    "itinerary" JSONB NOT NULL,
    "travellingAlone" BOOLEAN NOT NULL,
    "companionCount" INTEGER NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);
