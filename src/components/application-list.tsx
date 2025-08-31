"use client";

import type { Application, Status } from "@/lib/types";
import { ApplicationCard } from "./application-card";
import { FileSearch } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ApplicationTable } from "./application-table";

interface ApplicationListProps {
  applications: Application[];
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationList({ applications, onStatusChange, onEdit, onDelete }: ApplicationListProps) {
  const isMobile = useIsMobile();

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

  if (isMobile) {
    return (
        <div className="space-y-4">
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
