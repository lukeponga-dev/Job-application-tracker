"use client";

import type { Application, Status } from "@/lib/types";
import { statusOptions } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Edit, Trash2, Calendar, FileText, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";


interface ApplicationRowProps {
  application: Application;
  onStatusChange: (id: string, status: Status) => void;
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


export function ApplicationRow({ application, onEdit, onDelete, onStatusChange }: ApplicationRowProps) {
  const { id, companyName, role, dateApplied, status, notes } = application;

  return (
    <AccordionItem value={id} className="border-b-0 rounded-lg bg-card border overflow-hidden">
        <div className="flex items-center justify-between w-full p-4 font-semibold text-left">
            <AccordionTrigger className="flex-1 p-0 hover:no-underline [&[data-state=open]>svg]:-rotate-90">
                <div className="flex-1 text-left">
                    <p className="font-bold text-base text-foreground">{companyName}</p>
                    <p className="text-sm font-normal text-muted-foreground">{role}</p>
                </div>
            </AccordionTrigger>
            <div className="flex items-center gap-2 ml-4">
                <Badge
                    variant={getBadgeVariant(status)}
                    className={cn(
                        "w-fit capitalize",
                        status === 'Interviewing' && 'bg-accent text-accent-foreground border-transparent'
                    )}
                >
                    {status}
                </Badge>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreVertical className="h-5 w-5" />
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-4 pt-4 border-t">
            {notes && (
                <div className="flex items-start text-sm text-muted-foreground">
                    <FileText className="mr-3 h-4 w-4 mt-0.5 shrink-0" />
                    <p className="flex-1 whitespace-pre-wrap font-sans">{notes}</p>
                </div>
            )}
            <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-3 h-4 w-4" />
                <span>Applied on {format(dateApplied, "MMM d, yyyy")}</span>
            </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
