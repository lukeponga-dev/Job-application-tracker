"use client";

import type { Application, Status } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { Edit, Trash2, MoreVertical, Calendar, Briefcase } from "lucide-react";
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

const statusOptions: Status[] = ["Applied", "Interviewing", "Offer", "Rejected"];


export function ApplicationRow({ application, onStatusChange, onEdit, onDelete, isMobile = false }: ApplicationRowProps) {
  const { id, companyName, role, dateApplied, status } = application;

  if (isMobile) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">{companyName}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-1">
                <Briefcase className="h-4 w-4" />
                <span>{role}</span>
              </CardDescription>
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>Applied on {format(dateApplied, "MMM d, yyyy")}</span>
          </div>
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
        </CardContent>
         <CardFooter>
            <Badge 
                variant={getBadgeVariant(status)}
                className={cn(
                    "w-fit text-xs",
                    status === 'Interviewing' && 'bg-accent/90 text-accent-foreground border-transparent'
                )}
            >
                {status}
            </Badge>
         </CardFooter>
      </Card>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{companyName}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell>{format(dateApplied, "MMM d, yyyy")}</TableCell>
      <TableCell>
        <Badge 
            variant={getBadgeVariant(status)}
            className={cn(
                "w-fit",
                status === 'Interviewing' && 'bg-accent/90 text-accent-foreground border-transparent'
            )}
        >
            {status}
        </Badge>
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