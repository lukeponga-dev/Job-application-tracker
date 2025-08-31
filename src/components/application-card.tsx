"use client";

import type { Application, Status } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

const getBadgeVariant = (
  status: Status
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Offer":
      return "default";
    case "Rejected":
      return "destructive";
    case "Applied":
      return "secondary";
    case "Interviewing":
      return "outline";
    default:
      return "outline";
  }
};

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  const { id, platform, companyName, role, dateApplied, status, notes } = application;

  return (
    <Card className="flex flex-col bg-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
            <div>
                <CardDescription>{platform || companyName}</CardDescription>
                <CardTitle className="text-lg font-semibold">{role}</CardTitle>
            </div>
            <Badge
                variant={getBadgeVariant(status)}
                className={cn("capitalize text-xs whitespace-nowrap")}
            >
                {status}
            </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {format(dateApplied, "MMM d, yyyy")}
        </p>
        
        {notes && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="p-0 text-sm text-muted-foreground hover:no-underline">
                Show notes
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="flex items-start text-sm text-muted-foreground">
                  <FileText className="mr-3 h-4 w-4 mt-0.5 shrink-0" />
                  <p className="flex-1 whitespace-pre-wrap font-sans text-xs leading-relaxed">
                    {notes}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <div className="flex gap-2 mt-4">
          <Button variant="ghost" size="icon" onClick={() => onEdit(application)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(id)} className="text-destructive-foreground">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
