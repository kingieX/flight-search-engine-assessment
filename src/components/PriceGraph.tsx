// src/components/PriceGraph.tsx

import { useFlightStore } from "@/store/flightStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, DollarSign } from "lucide-react";

export default function PriceGraph() {
  const { priceData, filteredFlights } = useFlightStore();

  if (filteredFlights.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No data to display</p>
        </div>
      </div>
    );
  }

  // Generate gradient colors for bars
  const colors = [
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#2563eb",
    "#1d4ed8",
    "#1e40af",
  ];

  // Calculate average price
  const avgPrice = Math.round(
    filteredFlights.reduce((sum, f) => sum + f.price, 0) /
      filteredFlights.length,
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg sm:text-xl flex items-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Price Trends
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Average prices by airline
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-blue-50 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-xs text-gray-600">Avg Price</div>
            <div className="text-lg sm:text-xl font-bold text-blue-600 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {avgPrice}
            </div>
          </div>
          <div className="bg-green-50 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-xs text-gray-600">Results</div>
            <div className="text-lg sm:text-xl font-bold text-green-600">
              {filteredFlights.length}
            </div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={priceData}
          margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
        >
          <defs>
            {colors.map((color, index) => (
              <linearGradient
                key={index}
                id={`gradient${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            stroke="#9ca3af"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickFormatter={(value) => `${value}`}
            stroke="#9ca3af"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white border-2 border-blue-200 rounded-xl shadow-xl p-4 animate-fade-in">
                    <p className="font-bold text-gray-900 text-base mb-2">
                      {data.label}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Avg Price:{" "}
                        <span className="font-bold text-blue-600 text-lg">
                          ${data.price}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {data.count} flight{data.count !== 1 ? "s" : ""}{" "}
                        available
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
            cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
          />
          <Bar
            dataKey="price"
            radius={[12, 12, 0, 0]}
            animationDuration={800}
            animationBegin={0}
          >
            {priceData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#gradient${index % colors.length})`}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {priceData.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full hover:bg-blue-50 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-xs font-medium text-gray-700">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
