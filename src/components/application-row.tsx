"use client";

import type { Application, Status } from "@/lib/types";
import { statusOptions } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableRow, TableCell } from "@/components/ui/table";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ApplicationRowProps {
  application: Application;
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationRow({ application, onStatusChange, onEdit, onDelete }: ApplicationRowProps) {
  const { id, companyName, role, dateApplied, status } = application;

  const getBadgeVariant = (status: Status): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Offer': return 'default'; // Uses primary color
      case 'Rejected': return 'destructive';
      case 'Applied': return 'secondary';
      case 'Interviewing': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{companyName}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell className="hidden md:table-cell">{format(dateApplied, "MMM d, yyyy")}</TableCell>
      <TableCell>
        <div className="hidden sm:block">
            <Badge 
                variant={getBadgeVariant(status)}
                className={cn(
                    "w-fit",
                    status === 'Interviewing' && 'bg-accent/90 text-accent-foreground border-transparent'
                )}
            >
                {status}
            </Badge>
        </div>
         <div className="sm:hidden">
            <Select onValueChange={(value: Status) => onStatusChange(id, value)} defaultValue={status}>
                <SelectTrigger className="h-8">
                    <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(application)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
