"use client";

import { Button } from "@/components/ui/button";
import { Download, LayoutGrid, List } from "lucide-react";
import type { Status } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  onExport: (format: "csv" | "pdf") => void;
  applicationCount: number;
  filter: Status | "All";
  onFilterChange: (filter: Status | "All") => void;
  viewMode: 'card' | 'list';
  onViewModeChange: (viewMode: 'card' | 'list') => void;
}

const filterOptions: (Status | "All")[] = ["All", "Applied", "Interviewing", "Offer", "Rejected"];

export function AppHeader({ onExport, applicationCount, filter, onFilterChange, viewMode, onViewModeChange }: AppHeaderProps) {
  return (
    <header className="px-4 pt-6 pb-4 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Jobtracker
          </h1>
          <p className="text-sm text-muted-foreground">
            You have {applicationCount} {applicationCount === 1 ? 'application' : 'applications'}.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant={viewMode === 'card' ? 'secondary' : 'ghost'} size="icon" onClick={() => onViewModeChange('card')} className="text-muted-foreground">
                <LayoutGrid className="h-5 w-5" />
                <span className="sr-only">Card View</span>
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => onViewModeChange('list')} className="text-muted-foreground">
                <List className="h-5 w-5" />
                <span className="sr-only">List View</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onExport("csv")} className="text-muted-foreground">
                <Download className="h-5 w-5" />
                <span className="sr-only">Export</span>
            </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filterOptions.map((option) => (
          <Button
            key={option}
            variant={filter === option ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(option)}
            className={cn(
              "rounded-full px-4 h-8",
              filter === option ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
            )}
          >
            {option}
          </Button>
        ))}
      </div>
    </header>
  );
}
