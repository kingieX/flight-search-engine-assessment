import { useState, useEffect, useRef } from "react";
import {
  searchLocations,
  type AirportSearchResult,
} from "@/services/flightSearch";
import { Plane } from "lucide-react";

interface AirportAutocompleteProps {
  label: string;
  value: string;
  onChange: (iataCode: string, displayName: string) => void;
  placeholder?: string;
}

export default function AirportAutocomplete({
  label,
  // value,
  onChange,
  placeholder = "Search airports or cities",
}: AirportAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<AirportSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search airports as user types
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (inputValue.length >= 2) {
        setLoading(true);
        const locations = await searchLocations(inputValue);
        setResults(locations);
        setLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(searchTimeout);
  }, [inputValue]);

  const handleSelect = (location: AirportSearchResult) => {
    const displayName = `${location.cityName} (${location.iataCode})`;
    setInputValue(displayName);
    onChange(location.iataCode, displayName);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium mb-1 text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />

        <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-3 text-gray-500 text-sm">Searching...</div>
          ) : results.length > 0 ? (
            results.map((location) => (
              <button
                key={location.iataCode}
                onClick={() => handleSelect(location)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-primary font-semibold text-sm">
                    {location.iataCode}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {location.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {location.cityName}, {location.countryCode}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
