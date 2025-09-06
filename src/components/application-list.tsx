"use client";

import type { Application, Status } from "@/lib/types";
import { ApplicationCard } from "./application-card";
import { FileSearch } from "lucide-react";
import { ApplicationTable } from "./application-table";
import { useApplicationContext } from "./application-provider";

interface ApplicationListProps {
  applications: Application[];
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationList({ applications, onStatusChange, onEdit, onDelete }: ApplicationListProps) {
  const { viewMode } = useApplicationContext();
  if (applications.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <FileSearch className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">No Applications Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no applications matching the current filter.
        </p>
      </div>
    );
  }

  if (viewMode === 'card') {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {applications.map((application) => (
            <ApplicationCard
                key={application.id}
                application={application}
                onEdit={onEdit}
                onDelete={onDelete}
            />
            ))}
        </div>
    );
  }

  return (
    <ApplicationTable 
        applications={applications}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
        onDelete={onDelete}
    />
  );
}
