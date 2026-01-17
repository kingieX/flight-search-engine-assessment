import { useFlightStore } from "@/store/flightStore";
import { Filter, X } from "lucide-react";
import { useState, useMemo } from "react";

export default function FilterPanel() {
  const { allFlights, filters, setFilters, resetFilters } = useFlightStore();
  const [isOpen, setIsOpen] = useState(true);

  // Get unique airlines from all flights
  const availableAirlines = useMemo(() => {
    const airlines = new Set(allFlights.map((f) => f.airline));
    return Array.from(airlines).sort();
  }, [allFlights]);

  // Get price range from all flights
  const priceRange = useMemo(() => {
    if (allFlights.length === 0) return { min: 0, max: 1000 };
    const prices = allFlights.map((f) => f.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [allFlights]);

  const handleStopFilter = (stopCount: number) => {
    const currentStops = filters.stops || [];
    const newStops = currentStops.includes(stopCount)
      ? currentStops.filter((s) => s !== stopCount)
      : [...currentStops, stopCount];

    setFilters({ stops: newStops.length > 0 ? newStops : undefined });
  };

  const handleAirlineFilter = (airline: string) => {
    const currentAirlines = filters.airlines || [];
    const newAirlines = currentAirlines.includes(airline)
      ? currentAirlines.filter((a) => a !== airline)
      : [...currentAirlines, airline];

    setFilters({ airlines: newAirlines.length > 0 ? newAirlines : undefined });
  };

  const handlePriceChange = (value: number) => {
    setFilters({ maxPrice: value });
  };

  const hasActiveFilters =
    filters.maxPrice !== undefined ||
    (filters.stops && filters.stops.length > 0) ||
    (filters.airlines && filters.airlines.length > 0);

  if (allFlights.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Max Price: ${filters.maxPrice || priceRange.max}
            </label>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={filters.maxPrice || priceRange.max}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${priceRange.min}</span>
              <span>${priceRange.max}</span>
            </div>
          </div>

          {/* Stops Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Stops
            </label>
            <div className="space-y-2">
              {[
                { value: 0, label: "Non-stop" },
                { value: 1, label: "1 stop" },
                { value: 2, label: "2+ stops" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.stops?.includes(value) || false}
                    onChange={() => handleStopFilter(value)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Airline Filter */}
          {availableAirlines.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Airlines
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableAirlines.map((airline) => (
                  <label
                    key={airline}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.airlines?.includes(airline) || false}
                      onChange={() => handleAirlineFilter(airline)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{airline}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
