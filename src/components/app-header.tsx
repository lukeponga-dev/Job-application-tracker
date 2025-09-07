"use client";

import { Button } from "@/components/ui/button";
import { Download, FilePlus, LayoutGrid, List, LogOut } from "lucide-react";
import type { Status } from "@/lib/types";
import { useApplicationContext } from "./application-provider";
import { useMemo } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const filterOptions: (Status | "All")[] = ["All", "Applied", "Interviewing", "Offer", "Rejected"];

export function AppHeader() {
  const router = useRouter();
  const { 
    applications, 
    filter, 
    setFilter, 
    viewMode, 
    setViewMode, 
    handleOpenForm,
    handleExport
  } = useApplicationContext();
  
  const filteredApplications = useMemo(() => {
    if (filter === "All") return applications;
    return applications.filter(app => app.status === filter);
  }, [applications, filter]);

  const handleSignOut = async () => {
    await signOut(auth);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    router.push('/login');
  };

  return (
    <header className="p-4 border-b">
      <div className="flex items-center justify-between mb-4">
        <div>
            <h1 className="text-2xl font-bold text-foreground">
                Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
                You have {applications.length} {applications.length === 1 ? 'application' : 'applications'}.
            </p>
        </div>
        <div className="items-center gap-2 flex">
            <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
            </Button>
            <Button size="sm" onClick={() => handleOpenForm()}>
                <FilePlus className="h-4 w-4 mr-2" />
                Add New
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
            </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
            {filterOptions.map((option) => (
              <Button
                  key={option}
                  variant={filter === option ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(option)}
                  className="rounded-full px-4 h-8"
              >
                  {option}
              </Button>
            ))}
        </div>

        <div className="flex items-center gap-2">
            <Button variant={viewMode === 'card' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('card')} className="text-muted-foreground h-8 w-8">
                <LayoutGrid className="h-5 w-5" />
                <span className="sr-only">Card View</span>
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')} className="text-muted-foreground h-8 w-8">
                <List className="h-5 w-5" />
                <span className="sr-only">List View</span>
            </Button>
        </div>
      </div>
    </header>
  );
}
