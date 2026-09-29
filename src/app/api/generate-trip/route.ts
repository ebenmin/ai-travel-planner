import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
let wInt = +5000;

export async function POST(request: Request) {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  let tryI = 0;

  const formData = await request.json();
  const {
    destination,
    budget,
    attractions,
    departureFrom,
    duration,
    travelingAlone,
    tripType,
    companionCount,
  } = formData;

  while (tryI < 3) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
        systemInstruction:
          "You are an expert travel agent. Respond ONLY with valid JSON, no markdown formatting, no code fences, no explanatory text before or after. The JSON must match this exact structure: an object with a days array; each day has day (number), title (string), and activities (array); each activity has time, title, description, and cost (all strings).",
      });

      const prompt = travelingAlone
        ? `Plan a trip for a person travelling alone on a budget of ${budget} US Dollars to ${destination} departing from ${departureFrom} for a duration of ${duration} focusing on a ${tripType} with attractions such as ${attractions.join(", ")}.`
        : `Plan a trip for a person travelling with ${companionCount} people on a budget of ${budget} US Dollars to ${destination} departing from ${departureFrom} for a duration of ${duration} focusing on a ${tripType} with attractions such as ${attractions.join(", ")}.`;

      const result = await model.generateContent(prompt);

      const rawText = result.response.text();

      // Strip markdown code fences like ```json ... ``` or ``` ... ```
      const cleanedText = rawText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      let parsedItinerary;

      try {
        parsedItinerary = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("Failed to parse Gemini's response as JSON:", parseError);
        console.error("Raw text was:", rawText);
        throw new Error("Gemini did not return valid JSON");
      }

      return NextResponse.json({ success: true, itinerary: parsedItinerary });
    } catch (error) {
      console.error(error);
      await sleep(wInt);
    }
    tryI++;
  }

  return NextResponse.json({
    success: false,
    error: "Failed to generate trip",
  });
}
