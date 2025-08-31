"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Status } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  onExport: (format: "csv" | "pdf") => void;
  applicationCount: number;
  filter: Status | "All";
  onFilterChange: (filter: Status | "All") => void;
}

const filterOptions: (Status | "All")[] = ["All", "Applied", "Interviewing", "Offer", "Rejected"];

export function AppHeader({ onExport, applicationCount, filter, onFilterChange }: AppHeaderProps) {
  return (
    <header className="px-4 pt-6 pb-4 sticky top-0 z-10 bg-background">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            {applicationCount} {applicationCount === 1 ? 'application' : 'applications'} found
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onExport("csv")}>
          <Download className="h-5 w-5" />
          <span className="sr-only">Export</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filterOptions.map((option) => (
          <Button
            key={option}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(option)}
            className={cn(
              "rounded-full px-4 h-8",
              filter === option
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground"
            )}
          >
            {option}
          </Button>
        ))}
      </div>
    </header>
  );
}
