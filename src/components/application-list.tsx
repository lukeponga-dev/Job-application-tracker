"use client";

import type { Application, Status } from "@/lib/types";
import { ApplicationTableRow } from "./application-table-row";
import { ApplicationCard } from "./application-card";
import { FileSearch } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";


interface ApplicationListProps {
  applications: Application[];
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationList({ applications, onStatusChange, onEdit, onDelete }: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg bg-card">
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
      {/* Desktop Table View */}
      <div className="border rounded-lg hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <ApplicationTableRow
                key={application.id}
                application={application}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </>
  );
}
