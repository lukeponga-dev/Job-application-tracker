"use client";

import { Button } from "@/components/ui/button";
import { Download, PlusCircle, LayoutGrid, List } from "lucide-react";
import type { Status } from "@/lib/types";
import { statusOptions } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  onAdd: () => void;
  onExport: (format: "csv" | "pdf") => void;
  filter: Status | "All";
  onFilterChange: (filter: Status | "All") => void;
  applicationCount: number;
  view: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
}

const allFilters: (Status | "All")[] = ["All", ...statusOptions];

export function AppHeader({ onAdd, onExport, filter, onFilterChange, applicationCount, view, onViewChange }: AppHeaderProps) {
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
        <div className="hidden sm:flex items-center gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onExport("csv")}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("pdf")}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={onAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4">
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
          <div className="hidden sm:flex items-center gap-2">
            <Button variant={view === 'card' ? 'secondary' : 'ghost'} size="icon" onClick={() => onViewChange('card')}>
              <LayoutGrid className="h-5 w-5" />
              <span className="sr-only">Card View</span>
            </Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => onViewChange('list')}>
              <List className="h-5 w-5" />
              <span className="sr-only">List View</span>
            </Button>
          </div>
      </div>
       <div className="sm:hidden fixed bottom-4 right-4 z-20 flex flex-col gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
                <Download className="h-6 w-6" />
                <span className="sr-only">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mb-2">
              <DropdownMenuItem onClick={() => onExport("csv")}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("pdf")}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={onAdd} size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">Add Application</span>
          </Button>
        </div>
    </header>
  );
}
