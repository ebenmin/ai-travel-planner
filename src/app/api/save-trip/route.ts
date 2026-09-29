import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const {
    destination,
    departureFrom,
    duration,
    budget,
    travelingAlone,
    tripType,
    attractions,
    companionCount,
    itinerary,
  } = body;

  try {
    const trip = await prisma.trip.create({
      data: {
        destination,
        departureFrom,
        duration,
        budget,
        tripType,
        attractions,
        itinerary,
        travelingAlone: travelingAlone ?? false,
        companionCount: companionCount === "" ? 0 : companionCount,
      },
    });
    return NextResponse.json({ success: true, trip });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to save trip" });
  }
}
