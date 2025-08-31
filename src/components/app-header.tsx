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
    <header>
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Your Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            You have {applicationCount} {applicationCount === 1 ? 'application' : 'applications'} matching your filter.
          </p>
        </div>
        <Button onClick={onAdd} className="hidden sm:inline-flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>
      <div className="flex items-center justify-start pt-4">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-2 -mb-2">
              {allFilters.map((status) => (
                  <Button
                  key={status}
                  variant={filter === status ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onFilterChange(status)}
                  className="rounded-full shrink-0"
                  >
                  {status}
                  </Button>
              ))}
          </div>
      </div>
       <div className="sm:hidden fixed bottom-4 right-4 z-20">
          <Button onClick={onAdd} size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">Add Application</span>
          </Button>
        </div>
    </header>
  );
}
