"use client";

import type { Application, Status } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableRow, TableCell } from "@/components/ui/table";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ApplicationTableRowProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

const getBadgeVariant = (status: Status): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Offer': return 'default';
    case 'Rejected': return 'destructive';
    case 'Applied': return 'secondary';
    case 'Interviewing': return 'outline';
    default: return 'outline';
  }
};


export function ApplicationTableRow({ application, onEdit, onDelete }: ApplicationTableRowProps) {
  const { id, companyName, role, dateApplied, status } = application;

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{companyName}</div>
      </TableCell>
       <TableCell>
        <div className="text-sm text-muted-foreground">{role}</div>
      </TableCell>
      <TableCell>{format(dateApplied, "MMM d, yyyy")}</TableCell>
      <TableCell>
        <Badge 
          variant={getBadgeVariant(status)}
          className={cn(
            "capitalize",
            status === 'Interviewing' && 'bg-accent text-accent-foreground border-transparent'
          )}
        >
          {status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(application)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
