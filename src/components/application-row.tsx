"use client";

import type { Application, Status } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Edit, Trash2, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ApplicationRowProps {
  application: Application;
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
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


export function ApplicationRow({ application, onEdit, onDelete }: ApplicationRowProps) {
  const { id, companyName, role, dateApplied, status, notes } = application;

  return (
    <AccordionItem value={id} className="border-b-0">
      <AccordionTrigger className="flex items-center justify-between w-full p-4 font-semibold text-left bg-card rounded-lg border hover:no-underline [&[data-state=open]]:rounded-b-none">
        <div className="flex-1 text-left">
            <p className="font-bold text-base text-foreground">{companyName}</p>
            <p className="text-sm font-normal text-muted-foreground">{role}</p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <Badge 
              variant={getBadgeVariant(status)}
              className={cn(
                  "w-fit",
                  status === 'Interviewing' && 'bg-accent text-accent-foreground border-transparent'
              )}
          >
              {status}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4 bg-card border border-t-0 rounded-b-lg">
        <div className="space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Applied on {format(dateApplied, "MMM d, yyyy")}</span>
            </div>
            {notes && (
                <div className="flex items-start text-sm text-muted-foreground">
                    <FileText className="mr-2 h-4 w-4 mt-0.5 shrink-0" />
                    <p className="flex-1 whitespace-pre-wrap">{notes}</p>
                </div>
            )}
            <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(application)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
