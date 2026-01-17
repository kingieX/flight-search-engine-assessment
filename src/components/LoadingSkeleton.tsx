export function FlightCardSkeleton() {
  return (
    <div className="p-4 sm:p-6 border-b animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-full sm:w-32"></div>
        </div>
      </div>
    </div>
  );
}

export function GraphSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-16 w-20 bg-gray-200 rounded-lg"></div>
          <div className="h-16 w-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <div className="h-80 bg-gray-100 rounded-lg flex items-end justify-around p-4 gap-2">
        {[60, 80, 70, 90, 65].map((height, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-t-lg w-full"
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-6 bg-gray-200 rounded-full w-24"></div>
        ))}
      </div>
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg animate-pulse">
      <div className="p-4 border-b">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="p-4 space-y-6">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-28"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-20 z-50 flex items-center justify-center backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4"
        data-aos="zoom-in"
      >
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="relative">
            <svg
              className="animate-spin h-16 w-16 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Searching Flights
        </h3>
        <p className="text-gray-600 text-sm">
          Finding the best deals for you...
        </p>
      </div>
    </div>
  );
}
