import { useState, useEffect, useMemo, useRef } from "react";
import { searchFlights, formatFlightTime } from "@/services/flightSearch";
import { useFlightStore } from "@/store/flightStore";
import AirportAutocomplete from "./AirportAutocomplete";
import FilterPanel from "./FilterPanel";
import PriceGraph from "./PriceGraph";
import EmptyState, { NoResultsState } from "./EmptyState";
import {
  FlightCardSkeleton,
  GraphSkeleton,
  FilterSkeleton,
  SearchingOverlay,
} from "./LoadingSkeleton";
import SortDropdown, { type SortOption } from "./SortDropdown";
import {
  Calendar,
  Users,
  SlidersHorizontal,
  Loader,
  ChevronDown,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./Header";

export default function FlightSearchPage() {
  // Global flight store
  const {
    filteredFlights,
    allFlights,
    isLoading,
    error,
    setFlights,
    setLoading,
    setError,
    resetFilters,
  } = useFlightStore();

  // Ref for scrolling to results
  const resultsTopRef = useRef<HTMLDivElement>(null);

  // Form state
  const [originCode, setOriginCode] = useState("");
  const [originDisplay, setOriginDisplay] = useState("");

  const [destinationCode, setDestinationCode] = useState("");
  const [destinationDisplay, setDestinationDisplay] = useState("");

  const [departureDate, setDepartureDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  // Helper function to parse duration
  const parseDurationToMinutes = (duration: string): number => {
    const hours = duration.match(/(\d+)h/);
    const minutes = duration.match(/(\d+)m/);
    return (
      (hours ? parseInt(hours[1]) * 60 : 0) +
      (minutes ? parseInt(minutes[1]) : 0)
    );
  };

  // Reset to page 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredFlights, sortBy]);

  // Handle page change with scroll and AOS refresh
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    // Scroll to the results section
    resultsTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Re-trigger AOS animations for the new set of cards
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  };

  // Sort flights
  const sortedFlights = useMemo(() => {
    const flights = [...filteredFlights];

    switch (sortBy) {
      case "price-asc":
        return flights.sort((a, b) => a.price - b.price);
      case "price-desc":
        return flights.sort((a, b) => b.price - a.price);
      case "duration-asc":
        return flights.sort((a, b) => {
          const durationA = parseDurationToMinutes(a.duration);
          const durationB = parseDurationToMinutes(b.duration);
          return durationA - durationB;
        });
      case "stops-asc":
        return flights.sort((a, b) => a.stops - b.stops);
      default:
        return flights;
    }
  }, [filteredFlights, sortBy]);

  // Calculate the slice of flights for the current page
  const paginatedFlights = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedFlights.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedFlights, currentPage]);

  const totalPages = Math.ceil(sortedFlights.length / itemsPerPage);

  // Search handler
  const handleSearch = async () => {
    if (!originCode || !destinationCode) {
      setError("Please select origin and destination");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await searchFlights({
        origin: originCode,
        destination: destinationCode,
        departureDate,
        adults,
      });

      setFlights(results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Search failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Loading Overlay */}
      {isLoading && <SearchingOverlay />}

      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Search Form */}
        <div
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6"
          data-aos="fade-down"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Origin */}
            <AirportAutocomplete
              label="From"
              value={originDisplay}
              onChange={(code, display) => {
                setOriginCode(code);
                setOriginDisplay(display);
              }}
            />

            {/* Destination */}
            <AirportAutocomplete
              label="To"
              value={destinationDisplay}
              onChange={(code, display) => {
                setDestinationCode(code);
                setDestinationDisplay(display);
              }}
            />

            {/* Departure Date */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Departure Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Passengers
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                  min="1"
                  max="9"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="animate-spin w-5 h-5" />
                Searching...
              </span>
            ) : (
              "Search Flights"
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake"
            data-aos="fade-in"
          >
            {error}
          </div>
        )}

        {/* Empty State - Before any search */}
        {!hasSearched && !isLoading && <EmptyState />}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="lg:col-span-1">
              <FilterSkeleton />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <GraphSkeleton />
              <div className="bg-white rounded-lg shadow divide-y">
                {[1, 2, 3].map((i) => (
                  <FlightCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {hasSearched && !isLoading && allFlights.length === 0 && !error && (
          <NoResultsState />
        )}

        {/* Results Section */}
        {hasSearched && !isLoading && allFlights.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full bg-white rounded-lg shadow p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Filters</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${showMobileFilters ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Filters - Left Sidebar */}
            <div
              className={`lg:col-span-1 ${showMobileFilters ? "block" : "hidden lg:block"}`}
              data-aos="fade-right"
            >
              <FilterPanel />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-4 lg:space-y-6">
              {/* Price Graph */}
              {filteredFlights.length > 0 && (
                <div data-aos="fade-up" data-aos-delay="100">
                  <PriceGraph />
                </div>
              )}

              {/* Flight Results */}
              {filteredFlights.length > 0 ? (
                <div
                  ref={resultsTopRef}
                  className="bg-white rounded-lg shadow scroll-mt-20"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="p-4 border-b bg-gray-50 rounded-t-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                      {filteredFlights.length} Flight
                      {filteredFlights.length !== 1 ? "s" : ""} Found
                    </h3>
                    <SortDropdown value={sortBy} onChange={setSortBy} />
                  </div>

                  <div className="divide-y">
                    {paginatedFlights.map((flight, index) => (
                      <div
                        key={flight.id}
                        className="p-4 sm:p-6 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                        data-aos="fade-up"
                        data-aos-delay={50 * (index % 5)}
                      >
                        <div className="flex flex-col gap-4">
                          {/* Top Row: Airline and Price */}
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-base sm:text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                {flight.airline}
                              </div>
                              <div className="text-gray-600 text-xs sm:text-sm mt-1">
                                {flight.stops === 0
                                  ? "Non-stop"
                                  : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                                {" • "}
                                {flight.duration}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                                ${flight.price.toFixed(0)}
                              </div>
                            </div>
                          </div>

                          {/* Bottom Row: Flight Details and Button */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-4 sm:gap-6 text-sm">
                              <div>
                                <div className="font-medium text-gray-900 text-base sm:text-lg">
                                  {flight.departure.airport}
                                </div>
                                <div className="text-gray-600 text-xs sm:text-sm">
                                  {formatFlightTime(flight.departure.time)}
                                </div>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="text-gray-400 text-lg">→</div>
                                <div className="text-xs text-gray-500">
                                  {flight.duration}
                                </div>
                              </div>

                              <div>
                                <div className="font-medium text-gray-900 text-base sm:text-lg">
                                  {flight.arrival.airport}
                                </div>
                                <div className="text-gray-600 text-xs sm:text-sm">
                                  {formatFlightTime(flight.arrival.time)}
                                </div>
                              </div>
                            </div>

                            <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
                              Select Flight
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="py-4 flex justify-center border-t">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handlePageChange(Math.max(currentPage - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
                      >
                        Previous
                      </button>

                      <span className="px-4 py-2 text-sm font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          handlePageChange(
                            Math.min(currentPage + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8">
                  <div className="text-center" data-aos="fade-up">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No flights match your filters
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters to see more results
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
