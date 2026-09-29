"use client";
import { useState } from "react";

type TimeUnit =
  "days" | "day" | "week" | "weeks" | "month" | "months" | "year" | "years";
type DurationString = `${number} ${TimeUnit}`;

type TripFormData = {
  destination: string;
  departureFrom: string;
  duration: DurationString | "";
  budget: number | "";
  travelingAlone: boolean | null;
  tripType: "relaxful" | "adventurous" | "educative" | "none selected";
  attractions: string[];
  companionCount: number | "";
};

type Activity = {
  time: string;
  title: string;
  description: string;
  cost: string;
};

type ItineraryDay = {
  day: number;
  title: string;
  activities: Activity[];
};

type ItineraryData = {
  days: ItineraryDay[];
};

const ATTRACTION_OPTIONS = [
  "Safari",
  "Jungle",
  "Skiing",
  "Beach / Tropical",
  "City / Urban",
  "Desert",
  "Historical Ruins",
  "Mountains / Hiking",
  "Cruises",
  "Theme Parks",
  "Festivals / Events",
  "Hot Springs / Spa",
  "Scuba Diving / Snorkeling",
];

export default function Home() {
  const [formData, setFormData] = useState<TripFormData>({
    destination: "",
    departureFrom: "",
    duration: "",
    budget: "",
    travelingAlone: null,
    tripType: "none selected",
    attractions: [],
    companionCount: "",
  });

  const [itinerary, setItinerary] = useState<null | ItineraryData>(null);
  const [isloading, setIsLoading] = useState(false);

  const handleAttractionToggle = (item: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.attractions.includes(item);
      const updateAttractions = alreadySelected
        ? prev.attractions.filter((a) => a !== item)
        : [...prev.attractions, item];

      return { ...prev, attractions: updateAttractions };
    });
  };

  const handleChange = (
    field: keyof TripFormData,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setItinerary(null);

    try {
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const finalData = await response.json();
      if (finalData.success) {
        setItinerary(finalData.itinerary);
      } else {
        console.error("Backend reported an error:", finalData.error);
      }
    } catch (error) {
      console.error("The fetch request completely failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    onclick = () => setItinerary(null);

    window.location.reload();
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/save-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, itinerary }),
      });

      const result = await response.json();
      if (result.success) {
        setSaveMessage("Trip saved!");
      } else {
        setSaveMessage("Failed to save trip.");
      }
    } catch (error) {
      console.error("Save request failed:", error);
      setSaveMessage("Failed to save trip.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 bg-[url('/travel-theme-3.jpg')] dark:bg-[url('/travel-theme-15.jpg')] bg-cover bg-center bg-no-repeat px-8">
      {!itinerary ? (
        <form
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 flex flex-col gap-4"
          onSubmit={handleSubmit}
          onReset={handleReset}
        >
          <div>
            <label
              htmlFor="destination"
              className="text-base font-medium uppercase text-gray-700 dark:text-gray-300"
            >
              Destination
            </label>
            <input
              id="destination"
              type="text"
              value={formData.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Tokyo, Japan"
            />
          </div>

          <div>
            <label
              htmlFor="departureFrom"
              className="text-base font-medium uppercase text-gray-700 dark:text-gray-300"
            >
              Departure From
            </label>
            <input
              id="departureFrom"
              type="text"
              value={formData.departureFrom}
              onChange={(e) => handleChange("departureFrom", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" e.g. Accra, Ghana"
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="text-base font-medium uppercase text-gray-700 dark:text-gray-300"
            >
              Trip Duration
            </label>
            <input
              id="duration"
              type="text"
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" e.g. 4 days"
            />
          </div>

          <div>
            <label
              htmlFor="budget"
              className="text-base font-medium uppercase text-gray-700 dark:text-gray-300"
            >
              Budget
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-300">
                $
              </span>
              <input
                id="budget"
                type="text"
                value={formData.budget}
                onChange={(e) =>
                  handleChange(
                    "budget",
                    Number(e.target.value.replace(/,/g, "")),
                  )
                }
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="travelingAlone"
              className="text-base font-medium uppercase text-gray-700 dark:text-gray-300"
            >
              Traveling Alone?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <input
                  type="radio"
                  name="travelingAlone"
                  checked={formData.travelingAlone === true}
                  onChange={() => {
                    handleChange("travelingAlone", true);
                    // Optional: clear the companion count if they switch back to "Yes"
                    handleChange("companionCount", "");
                  }}
                  className="w-4 h-4"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <input
                  type="radio"
                  name="travelingAlone"
                  checked={formData.travelingAlone === false}
                  onChange={() => handleChange("travelingAlone", false)}
                  className="w-4 h-4"
                />
                No
              </label>
            </div>

            {/* CONDITIONAL RENDER: Only shows if travelingAlone is strictly false */}
            {formData.travelingAlone === false && (
              <div className="mt-3">
                <label
                  htmlFor="companionCount"
                  className="text-sm font-medium text-gray-700"
                >
                  How many people are accompanying you?
                </label>
                <input
                  id="companionCount"
                  type="number"
                  min="1"
                  value={formData.companionCount}
                  onChange={(e) =>
                    handleChange("companionCount", Number(e.target.value))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 2"
                />
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="tripType"
              className="text-base font-medium uppercase text-gray-700 dark:text-gray-300"
            >
              Trip Type
            </label>
            <select
              value={formData.tripType}
              onChange={(e) => handleChange("tripType", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:light]"
            >
              <option value="none selected">Please select...</option>
              <option value="relaxful">relaxful</option>
              <option value="adventurous">adventurous</option>
              <option value="educative">educative</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="attractions"
              className="text-base font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300"
            >
              Attractions
            </label>
            <div className=" text-gray-700 mb-1">
              {ATTRACTION_OPTIONS.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900"
                >
                  <input
                    type="checkbox"
                    checked={formData.attractions.includes(item)}
                    onChange={() => handleAttractionToggle(item)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isloading || !!itinerary}
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            {isloading ? "Planning your trip..." : "Plan Trip"}
          </button>
          {itinerary && (
            <button
              type="reset"
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Plan another Trip...?
            </button>
          )}
        </form>
      ) : (
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Your Travel Itinerary
          </h2>
          {/* 'whitespace-pre-wrap' ensures the AI's paragraphs and line breaks display correctly */}
          <div className="text-gray-700">
            {itinerary.days.map((day) => (
              <div key={day.day} className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Day {day.day}: {day.title}
                </h3>

                <div className="relative border-l-2 border-blue-500 pl-6 flex flex-col gap-6">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="relative">
                      <span className="absolute -left-[31px] top-1 w-3 h-3 bg-blue-500 rounded-full"></span>

                      <p className="text-sm font-semibold text-blue-600 uppercase">
                        {activity.time}
                      </p>
                      <p className="font-medium text-gray-800">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      <p className="text-sm italic text-gray-500 mt-1">
                        Cost: {activity.cost}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition-colors mb-3"
          >
            {isSaving ? "Saving..." : "Save This Trip"}
          </button>
          {saveMessage && (
            <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-3">
              {saveMessage}
            </p>
          )}
          {itinerary && (
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Plan another Trip...?
            </button>
          )}
        </div>
      )}
    </div>
  );
}
