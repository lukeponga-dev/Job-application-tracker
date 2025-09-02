"use client";
import type { Application, Status } from "@/lib/types";
import { statusOptions } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreVertical, FileSearch } from "lucide-react";
import { format } from "date-fns";

interface ApplicationTableProps {
  applications: Application[];
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<Status, string> = {
    Applied: "bg-blue-100 text-blue-800 border-blue-200",
    Interviewing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Offer: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
}


export function ApplicationTable({
  applications,
  onStatusChange,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  
    if (applications.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg bg-card mt-6">
        <FileSearch className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">No Applications Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no applications matching the current filter.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden lg:table-cell">Date Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
                <span className="sr-only">Actions</span>
            </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {applications.map((application) => (
            <TableRow key={application.id} className="hover:bg-muted/50">
                <TableCell>
                    <div className="font-medium">{application.companyName}</div>
                    <div className="text-sm text-muted-foreground">{application.platform || ''}</div>
                </TableCell>
                <TableCell>
                    <div className="font-medium">{application.role}</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                    {format(new Date(application.dateApplied), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                <Badge
                    className={`capitalize text-xs whitespace-nowrap rounded-full font-medium ${statusStyles[application.status]}`}
                >
                    {application.status}
                </Badge>
                </TableCell>
                <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Actions</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(application)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {statusOptions.map((option) => (
                            <DropdownMenuItem
                                key={option}
                                onClick={() => onStatusChange(application.id!, option)}
                            >
                                {option}
                            </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => onDelete(application.id!)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  );
}
