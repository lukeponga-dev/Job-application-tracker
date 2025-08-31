"use client";

import { Button } from "@/components/ui/button";
import { Download, PlusCircle, LayoutGrid, List, PanelLeft } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  onAdd: () => void;
  onExport: (format: "csv" | "pdf") => void;
  view: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
  applicationCount: number;
}

export function AppHeader({ onAdd, onExport, view, onViewChange, applicationCount }: AppHeaderProps) {
    const { toggleSidebar } = useSidebar();
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card sm:p-6 sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleSidebar}
            >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <div>
                 <h1 className="text-2xl font-bold text-foreground">
                    My Applications
                </h1>
                <p className="text-sm text-muted-foreground">
                    You have {applicationCount} {applicationCount === 1 ? 'application' : 'applications'}.
                </p>
            </div>
        </div>

      <div className="flex items-center gap-2">
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
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Download className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onExport("csv")}>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("pdf")}>Export as PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={onAdd} className="hidden sm:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>

         <Button onClick={onAdd} size="icon" className="sm:hidden h-10 w-10 fixed bottom-4 right-4 z-20 rounded-full shadow-lg">
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">Add Application</span>
          </Button>
      </div>
    </header>
  );
}
