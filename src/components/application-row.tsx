"use client";

import type { Application, Status } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableRow, TableCell } from "@/components/ui/table";
import { Edit, Trash2, MoreVertical, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ApplicationRowProps {
  application: Application;
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  isMobile?: boolean;
}

const getBadgeVariant = (status: Status): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Offer': return 'default'; // Uses primary color
    case 'Rejected': return 'destructive';
    case 'Applied': return 'secondary';
    case 'Interviewing': return 'outline';
    default: return 'outline';
  }
};


export function ApplicationRow({ application, onStatusChange, onEdit, onDelete, isMobile = false }: ApplicationRowProps) {
  const { id, companyName, role, dateApplied, status } = application;

  if (isMobile) {
    return (
       <Card className="w-full">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{companyName}</CardTitle>
              <CardDescription>{role}</CardDescription>
            </div>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
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
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
           <div className="flex items-center justify-between text-sm">
             <Badge 
                variant={getBadgeVariant(status)}
                className={cn(
                    "w-fit",
                    status === 'Interviewing' && 'bg-accent text-accent-foreground border-transparent'
                )}
            >
                {status}
            </Badge>
            <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-1.5 h-4 w-4" />
                <span>{format(dateApplied, "MMM d, yyyy")}</span>
            </div>
           </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <TableRow>
      <TableCell className="py-3">
        <div className="font-medium">{companyName}</div>
        <div className="text-sm text-muted-foreground">{role}</div>
      </TableCell>
      <TableCell className="py-3">{format(dateApplied, "MMM d, yyyy")}</TableCell>
      <TableCell className="py-3">
        <Badge 
            variant={getBadgeVariant(status)}
            className={cn(
                "w-fit",
                status === 'Interviewing' && 'bg-accent text-accent-foreground border-transparent'
            )}
        >
            {status}
        </Badge>
      </TableCell>
      <TableCell className="text-right py-3">
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
