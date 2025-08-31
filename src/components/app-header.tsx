"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Status } from "@/lib/types";
import { statusOptions } from "@/lib/types";

interface AppHeaderProps {
  onAdd: () => void;
  filter: Status | "All";
  onFilterChange: (filter: Status | "All") => void;
  applicationCount: number;
}

const allFilters: (Status | "All")[] = ["All", ...statusOptions];

export function AppHeader({ onAdd, filter, onFilterChange, applicationCount }: AppHeaderProps) {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-10 w-full mb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex pt-8 pb-4 items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Your Applications
            </h1>
            <p className="text-muted-foreground">
              You have {applicationCount} {applicationCount === 1 ? 'application' : 'applications'} matching the filter.
            </p>
          </div>
          <Button onClick={onAdd} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>
        <div className="flex items-center justify-start pb-4">
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-2">
                {allFilters.map((status) => (
                    <Button
                    key={status}
                    variant={filter === status ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onFilterChange(status)}
                    className="rounded-full shrink-0"
                    >
                    {status}
                    </Button>
                ))}
            </div>
        </div>
      </div>
    </header>
  );
}
