"use client";

import type { Application, Status } from "@/lib/types";
import { ApplicationRow } from "./application-row";
import { FileSearch } from "lucide-react";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table"


interface ApplicationListProps {
  applications: Application[];
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationList({ applications, onStatusChange, onEdit, onDelete }: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg bg-background">
        <FileSearch className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">No Applications Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no applications matching the current filter.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile view: Card layout */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {applications.map((application) => (
          <ApplicationRow
            key={application.id}
            application={application}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
            isMobile
          />
        ))}
      </div>

      {/* Desktop view: Table layout */}
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Company</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <ApplicationRow
                key={application.id}
                application={application}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
