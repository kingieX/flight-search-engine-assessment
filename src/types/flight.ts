/**
 * What the user searches for
 */
export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
}

/**
 * What we display to the user (simplified from Amadeus response) for now
 */
export interface Flight {
  id: string;
  price: number;
  airline: string;
  stops: number;
  duration: string;
  departure: {
    time: string;
    airport: string;
  };
  arrival: {
    time: string;
    airport: string;
  };
}

/**
 * Filters for the results
 */
export interface FlightFilters {
  minPrice: undefined;
  maxPrice?: number;
  stops?: number[];
  airlines?: string[];
}

/**
 * Data point for the price graph
 */
export interface PricePoint {
  label: string;
  price: number;
  count: number;
}

/**
 * Amadeus API token response
 */
export interface AmadeusToken {
  access_token: string;
  expires_in: number;
}
