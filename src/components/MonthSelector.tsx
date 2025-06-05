import { Button } from "packages/ui/src/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "packages/ui/src/select";
import { useState } from "react";


interface MonthSelectorProps {
  onSelect: (month: string) => void;
  isLoading?: boolean;
}

export function MonthSelector({ onSelect, isLoading = false }: MonthSelectorProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Generate array of past 24 months in YYYY-MM format
  const getPastMonths = () => {
    const months: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < 24; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = date.toISOString().slice(0, 7); // Gets YYYY-MM format
      months.push(month);
    }
    
    return months;
  };

  const formatMonthDisplay = (month: string) => {
    const date = new Date(month + "-01");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  const handleSelect = (value: string) => {
    setSelectedMonth(value);
  };

  const handleFetch = () => {
    if (selectedMonth) {
      onSelect(selectedMonth);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <Select value={selectedMonth} onValueChange={handleSelect}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {getPastMonths().map((month) => (
            <SelectItem key={month} value={month}>
              {formatMonthDisplay(month)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        onClick={handleFetch} 
        disabled={!selectedMonth || isLoading}
      >
        {isLoading ? "Fetching..." : "Fetch Data"}
      </Button>
    </div>
  );
} 