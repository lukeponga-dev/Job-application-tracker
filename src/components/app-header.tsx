"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Briefcase } from "lucide-react";
import type { Status } from "@/lib/types";
import { statusOptions } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  onAdd: () => void;
  filter: Status | "All";
  onFilterChange: (filter: Status | "All") => void;
  applicationCount: number;
}

const allFilters: (Status | "All")[] = ["All", ...statusOptions];

export function AppHeader({ onAdd, filter, onFilterChange, applicationCount }: AppHeaderProps) {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-10 w-full border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              JobTrack Pro
            </h1>
          </div>
          <Button onClick={onAdd} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>
        <div className="flex items-center justify-between pb-4">
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
            <div className="hidden sm:block text-sm text-muted-foreground font-medium pr-2">
                {applicationCount} {applicationCount === 1 ? 'application' : 'applications'}
            </div>
        </div>
      </div>
    </header>
  );
}
