import { useState, useEffect } from "react";
import { Advice, AdviceCategories } from "../types/advice";
import { getSortedMessages } from "../utils/messageUtils";
import { categories, getCategoryIcon } from "../utils/categoryUtils";
import { track } from "../lib/events";

interface SortFilterControlsProps {
  advices: Advice[];
  onFilteredChange: (filtered: Advice[]) => void;
}

export default function SortFilterControls({
  advices,
  onFilteredChange,
}: SortFilterControlsProps) {
  const [sortBy, setSortBy] = useState<"most-liked" | "recent">("most-liked");
  const [timeLimit, setTimeLimit] = useState<"all-time" | "month">("all-time");
  const [selectedCategory, setSelectedCategory] = useState<
    AdviceCategories | "Tous"
  >("Tous");

  useEffect(() => {
    const filtered = getSortedMessages(
      advices,
      sortBy,
      timeLimit,
      selectedCategory
    );
    onFilteredChange(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advices, sortBy, timeLimit, selectedCategory]);

  return (
    <div className="w-full space-y-3">
      {/* Sort and Time Limit Controls */}
      <div className="flex gap-3 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("most-liked")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              sortBy === "most-liked"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Plus aimés
          </button>
          <button
            onClick={() => setSortBy("recent")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              sortBy === "recent"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Récents
          </button>
        </div>

        {/* Time Limit Buttons */}
        <div className="flex gap-2 pl-5">
          <button
            onClick={() => setTimeLimit("all-time")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeLimit === "all-time"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Tout le temps
          </button>
          <button
            onClick={() => setTimeLimit("month")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeLimit === "month"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Ce mois
          </button>
        </div>
      </div>

      {/* Category Pills - Horizontal Scrollable */}
      <div className="overflow-x-auto">
        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map((category) => {
            const isColored =
              selectedCategory === "Tous" || selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  track("category_filtered", null, { category });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {category === "Tous"
                  ? "Tous"
                  : getCategoryIcon(category, isColored)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
