"use client";

import type { Application, Status } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "./ui/button";

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<Status, string> = {
    Applied: "bg-blue-100 text-blue-800 border-blue-200",
    Interviewing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Offer: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
}


export function ApplicationCard({
  application,
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  const { id, platform, companyName, role, dateApplied, status, notes } = application;

  return (
    <Card className="flex flex-col bg-card shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-base font-semibold text-foreground">{role}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{companyName} {platform && `via ${platform}`}</CardDescription>
            </div>
            <div
                className={`capitalize text-xs whitespace-nowrap rounded-full font-medium px-2.5 py-0.5 ${statusStyles[status]}`}
            >
                {status}
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-xs text-muted-foreground mb-4">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            <span>Applied on {format(new Date(dateApplied), "MMM d, yyyy")}</span>
        </div>
        
        {notes && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none -mt-2">
              <AccordionTrigger className="p-0 text-xs text-muted-foreground hover:no-underline justify-start gap-1">
                <FileText className="h-3.5 w-3.5" />
                Show notes
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-0">
                <p className="flex-1 whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground/80">
                    {notes}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <div className="flex gap-1 mt-4 border-t border-border/50 pt-3">
          <Button variant="ghost" size="sm" onClick={() => onEdit(application)} className="text-muted-foreground h-8">
            <Edit className="h-4 w-4 mr-1.5" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(id!)} className="text-red-500 hover:text-red-600 h-8">
            <Trash2 className="h-4 w-4 mr-1.5" /> Delete
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
