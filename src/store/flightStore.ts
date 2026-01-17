import { create } from "zustand";
import type { Flight, FlightFilters, PricePoint } from "@/types/flight";

interface FlightStore {
  // Raw data from API
  allFlights: Flight[];

  // Active filters
  filters: FlightFilters;

  // Computed/filtered data
  filteredFlights: Flight[];
  priceData: PricePoint[];

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setFlights: (flights: Flight[]) => void;
  setFilters: (filters: Partial<FlightFilters>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Helper function to check if flight matches filters
function flightMatchesFilters(flight: Flight, filters: FlightFilters): boolean {
  // Price filter
  if (filters.maxPrice !== undefined && flight.price > filters.maxPrice) {
    return false;
  }
  if (filters.minPrice !== undefined && flight.price < filters.minPrice) {
    return false;
  }

  // Stops filter
  if (filters.stops && filters.stops.length > 0) {
    const matchesStops = filters.stops.some((stopCount) => {
      if (stopCount === 2) {
        // 2+ stops
        return flight.stops >= 2;
      }
      return flight.stops === stopCount;
    });
    if (!matchesStops) return false;
  }

  // Airline filter
  if (filters.airlines && filters.airlines.length > 0) {
    if (!filters.airlines.includes(flight.airline)) {
      return false;
    }
  }

  return true;
}

// Generate price distribution data for graph
function generatePriceData(flights: Flight[]): PricePoint[] {
  if (flights.length === 0) return [];

  // Group by airline
  const byAirline = flights.reduce(
    (acc, flight) => {
      if (!acc[flight.airline]) {
        acc[flight.airline] = { total: 0, count: 0 };
      }
      acc[flight.airline].total += flight.price;
      acc[flight.airline].count += 1;
      return acc;
    },
    {} as Record<string, { total: number; count: number }>,
  );

  // Convert to PricePoint array
  return Object.entries(byAirline)
    .map(([airline, data]) => ({
      label: airline,
      price: Math.round(data.total / data.count),
      count: data.count,
    }))
    .sort((a, b) => a.price - b.price);
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  allFlights: [],
  filters: {
    minPrice: undefined,
  },
  filteredFlights: [],
  priceData: [],
  isLoading: false,
  error: null,

  setFlights: (flights) => {
    set({
      allFlights: flights,
      filteredFlights: flights,
      priceData: generatePriceData(flights),
      error: null,
    });
  },

  setFilters: (newFilters) => {
    const filters = { ...get().filters, ...newFilters };
    const allFlights = get().allFlights;

    // Apply filters
    const filteredFlights = allFlights.filter((flight) =>
      flightMatchesFilters(flight, filters),
    );

    set({
      filters,
      filteredFlights,
      priceData: generatePriceData(filteredFlights),
    });
  },

  resetFilters: () => {
    const allFlights = get().allFlights;
    set({
      filters: {
        minPrice: undefined,
      },
      filteredFlights: allFlights,
      priceData: generatePriceData(allFlights),
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));
