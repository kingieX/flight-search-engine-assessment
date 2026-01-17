/* eslint-disable @typescript-eslint/no-explicit-any */

import { amadeusAuth } from "./amadeusAuth";
import type { Flight, FlightSearchParams } from "@/types/flight";
import { format, parseISO } from "date-fns";

const BASE_URL =
  import.meta.env.VITE_AMADEUS_API_URL || "https://test.api.amadeus.com";

/**
 * Search for flights using Amadeus API
 */
export async function searchFlights(
  params: FlightSearchParams,
): Promise<Flight[]> {
  try {
    // Get valid token
    const token = await amadeusAuth.getToken();

    // Build query parameters
    const queryParams = new URLSearchParams({
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      max: "50", // This helps get more results for better filtering...
    });

    // Add return date if provided
    if (params.returnDate) {
      queryParams.append("returnDate", params.returnDate);
    }

    // Make API request
    const response = await fetch(
      `${BASE_URL}/v2/shopping/flight-offers?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || "Flight search failed");
    }

    const data = await response.json();

    // Transform Amadeus response to our simplified format
    return transformFlights(data.data, data.dictionaries);
  } catch (error) {
    console.error("Flight search error:", error);
    throw error;
  }
}

/**
 * Transform Amadeus flight offers to our simplified Flight type we already created
 */
function transformFlights(offers: any[], dictionaries: any): Flight[] {
  if (!offers || offers.length === 0) {
    return [];
  }

  return offers.map((offer) => {
    // Get the first itinerary (outbound flight)
    const itinerary = offer.itineraries[0];
    const firstSegment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];

    // Get airline name from dictionaries
    const carrierCode = firstSegment.carrierCode;
    const airlineName = dictionaries?.carriers?.[carrierCode] || carrierCode;

    // Calculate number of stops
    const stops = itinerary.segments.length - 1;

    // Parse duration (convert PT2H30M to "2h 30m")
    const duration = parseDuration(itinerary.duration);

    return {
      id: offer.id,
      price: parseFloat(offer.price.total),
      airline: airlineName,
      stops,
      duration,
      departure: {
        time: firstSegment.departure.at,
        airport: firstSegment.departure.iataCode,
      },
      arrival: {
        time: lastSegment.arrival.at,
        airport: lastSegment.arrival.iataCode,
      },
    };
  });
}

/**
 * Convert ISO 8601 duration (PT2H30M) to readable format (2h 30m)
 */
function parseDuration(isoDuration: string): string {
  const matches = isoDuration.match(/PT(\d+H)?(\d+M)?/);
  if (!matches) return isoDuration;

  const hours = matches[1] ? matches[1].replace("H", "h ") : "";
  const minutes = matches[2] ? matches[2].replace("M", "m") : "";

  return (hours + minutes).trim();
}

/**
 * Format time for display (e.g., "2:30 PM")
 */
export function formatFlightTime(isoString: string): string {
  try {
    return format(parseISO(isoString), "h:mm a");
  } catch {
    return isoString;
  }
}

/**
 * Format date for display (e.g., "Jan 17")
 */
export function formatFlightDate(isoString: string): string {
  try {
    return format(parseISO(isoString), "MMM d");
  } catch {
    return isoString;
  }
}

/**
 * Airport/City search result
 */
export interface AirportSearchResult {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
  cityCode: string;
}

/**
 * Search for airports and cities by keyword
 */
export async function searchLocations(
  keyword: string,
): Promise<AirportSearchResult[]> {
  if (!keyword || keyword.length < 2) {
    return [];
  }

  try {
    const token = await amadeusAuth.getToken();

    const response = await fetch(
      `${BASE_URL}/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(keyword)}&page[limit]=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Location search failed");
    }

    const data = await response.json();

    return data.data.map((location: any) => ({
      iataCode: location.iataCode,
      name: location.name,
      cityName: location.address?.cityName || location.name,
      countryCode: location.address?.countryCode || "",
      cityCode: location.cityCode || location.iataCode,
    }));
  } catch (error) {
    console.error("Location search error:", error);
    return [];
  }
}
