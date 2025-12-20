import { useState, useEffect } from "react";
import { Advice } from "../types/advice";
import { getSortedMessages } from "../utils/messageUtils";

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

  useEffect(() => {
    const filtered = getSortedMessages(advices, sortBy, timeLimit);
    onFilteredChange(filtered);
  }, [advices, sortBy, timeLimit, onFilteredChange]);

  return (
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
  );
}
