"use client";

import type { Application, Status } from "@/lib/types";
import { ApplicationRow } from "./application-row";
import { FileSearch } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
      <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
        <FileSearch className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">No Applications Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no applications matching the current filter.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">Company</TableHead>
            <TableHead className="w-[25%]">Role</TableHead>
            <TableHead className="hidden md:table-cell">Date Applied</TableHead>
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
  );
}
