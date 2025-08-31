"use client";

import type { Application, Status } from "@/lib/types";
import { statusOptions } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreVertical, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
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

export function ApplicationCard({ application, onEdit, onDelete, onStatusChange }: ApplicationCardProps) {
  const { id, companyName, role, dateApplied, status, notes } = application;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div>
          <CardTitle>{companyName}</CardTitle>
          <CardDescription>{role}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="-mt-1 -mr-1">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(application)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
             <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Update Status
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {statusOptions.map(option => (
                     <DropdownMenuItem key={option} onClick={() => onStatusChange(id, option)}>
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
           <Badge
              variant={getBadgeVariant(status)}
              className={cn(
                  "capitalize",
                  status === 'Interviewing' && 'bg-accent text-accent-foreground border-transparent'
              )}
          >
              {status}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{format(dateApplied, "MMM d, yyyy")}</span>
          </div>
        </div>
        {notes && (
            <div className="flex items-start text-sm text-muted-foreground pt-2 border-t">
                <FileText className="mr-2 h-4 w-4 mt-1 shrink-0" />
                <p className="flex-1 whitespace-pre-wrap">{notes}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
