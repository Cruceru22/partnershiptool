import React from "react";
import { Button } from "./button";

interface MonthSelectorProps {
  onSelect: (month: string) => void;
  isLoading?: boolean;
  selectedMonth?: string;
}

export function MonthSelector({ onSelect, isLoading, selectedMonth }: MonthSelectorProps) {
  const months = React.useMemo(() => {
    const result: string[] = [];
    const today = new Date();
    
    // Always generate at least one month
    for (let i = 0; i < 24; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = date.toISOString().slice(0, 7); // YYYY-MM format
      result.push(month);
    }
    
    return result;
  }, []);

  // Since months array is never empty, this is safe
  const currentMonth = selectedMonth ?? months[0];

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentMonth}
        // @ts-ignore - TypeScript strict mode issue with select element value property
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSelect(e.currentTarget.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading}
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {new Date(month + "-01").toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          </option>
        ))}
      </select>
      <Button
        onClick={() => onSelect(currentMonth ?? "")}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Fetch Data"}
      </Button>
    </div>
  );
} 