"use client";

import type { Application, Status } from "@/lib/types";
import { statusOptions } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Edit, Trash2, MoreVertical, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  application: Application;
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationCard({ application, onStatusChange, onEdit, onDelete }: ApplicationCardProps) {
  const { id, companyName, role, dateApplied, status, notes } = application;

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
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex-grow">
          <CardTitle className="text-xl font-bold">{role}</CardTitle>
          <CardDescription className="text-md">{companyName}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Badge 
                variant={getBadgeVariant(status)}
                className={cn(
                    "w-fit",
                    status === 'Interviewing' && 'bg-accent/90 text-accent-foreground border-transparent'
                )}
            >
                {status}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Applied on {format(dateApplied, "MMM d, yyyy")}</span>
            </div>
        </div>
        
        {notes && (
          <div className="border-t pt-4">
             <div className="flex items-start gap-3 text-sm text-foreground">
                <FileText className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <p className="flex-grow whitespace-pre-wrap">{notes}</p>
             </div>
          </div>
        )}

        <div className="sm:hidden pt-2">
            <Select onValueChange={(value: Status) => onStatusChange(id, value)} defaultValue={status}>
                <SelectTrigger>
                    <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

      </CardContent>
    </Card>
  );
}
