import { Search, Plane } from "lucide-react";

export default function EmptyState() {
  return (
    <div
      className="max-w-2xl mx-auto text-center py-16 px-4"
      data-aos="fade-up"
    >
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-blue-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 p-6 rounded-full">
          <Plane className="w-16 h-16 text-white transform rotate-45" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Find Your Perfect Flight
      </h2>

      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Search thousands of flights to find the best deals. Compare prices,
        filter by your preferences, and book with confidence.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-blue-600 font-semibold mb-1">Step 1</div>
          <div className="text-sm text-gray-600">Enter your route</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-blue-600 font-semibold mb-1">Step 2</div>
          <div className="text-sm text-gray-600">Apply filters</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-blue-600 font-semibold mb-1">Step 3</div>
          <div className="text-sm text-gray-600">Select your flight</div>
        </div>
      </div>
    </div>
  );
}

export function NoResultsState() {
  return (
    <div className="text-center py-16 px-4" data-aos="fade-up">
      <div className="relative inline-block mb-6">
        <div className="bg-gray-100 p-6 rounded-full">
          <Search className="w-16 h-16 text-gray-400" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        No Flights Found
      </h3>

      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We couldn't find any flights matching your criteria. Try adjusting your
        filters or search dates.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Clear Filters
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          Try Different Dates
        </button>
      </div>
    </div>
  );
}
