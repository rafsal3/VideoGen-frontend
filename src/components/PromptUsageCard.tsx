import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function PromptUsageCard() {
  const total = 25;
  const remaining = 20;
  const percentage = (remaining / total) * 100;

  const radius = 18;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const targetOffset = circumference - (percentage / 100) * circumference;
    const timeout = setTimeout(() => {
      setOffset(targetOffset);
    }, 100); // slight delay to allow transition
    return () => clearTimeout(timeout);
  }, [percentage, circumference]);

  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-900 px-4 py-3 w-60 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground dark:text-gray-300">Prompts</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs px-3 py-0 h-auto font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Details
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {/* Progress Ring */}
        <div className="relative w-14 h-14">
          <svg
            height="100%"
            width="100%"
            viewBox="0 0 40 40"
            className="rotate-[-90deg]"
          >
            <circle
              stroke="#e5e7eb"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx="20"
              cy="20"
            />
            <circle
              stroke="#6366f1"
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              r={normalizedRadius}
              cx="20"
              cy="20"
              style={{
                transition: "stroke-dashoffset 1s ease-out",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800 dark:text-white">
            {remaining}
          </div>
        </div>

        {/* Text Info */}
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground dark:text-gray-400">Total</span>
            <span className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-full px-2 py-0.5 text-xs font-medium">
              {total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground dark:text-gray-400">Remaining</span>
            <span className="text-gray-800 dark:text-white font-semibold text-sm">
              {remaining}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
