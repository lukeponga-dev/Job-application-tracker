"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicationSchema, type Application, statusOptions } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { suggestApplicationStatus } from "@/ai/flows/ai-suggest-application-status";
import { useToast } from "@/hooks/use-toast";

interface ApplicationFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (application: Application) => void;
  application: Application | null;
  onClose: () => void;
}

export function ApplicationForm({ isOpen, onOpenChange, onSave, application, onClose }: ApplicationFormProps) {
  const form = useForm<Application>({
    resolver: zodResolver(ApplicationSchema),
    defaultValues: {
      id: application?.id || crypto.randomUUID(),
      platform: "",
      companyName: "",
      role: "",
      dateApplied: new Date(),
      status: "Applied",
      notes: "",
    },
  });

  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionReason, setSuggestionReason] = useState<string | null>(null);

  useEffect(() => {
    if (application) {
      form.reset({
        ...application,
        id: application.id,
      });
    } else {
      form.reset({
        id: crypto.randomUUID(),
        platform: "",
        companyName: "",
        role: "",
        dateApplied: new Date(),
        status: "Applied",
        notes: "",
      });
    }
    setSuggestionReason(null);
  }, [application, isOpen, form]);

  const handleSuggestStatus = async () => {
    setIsSuggesting(true);
    setSuggestionReason(null);
    try {
      const formData = form.getValues();
      const result = await suggestApplicationStatus({
        companyName: formData.companyName,
        role: formData.role,
        dateApplied: formData.dateApplied.toISOString(),
        notes: formData.notes || "",
      });
      if (result.suggestedStatus) {
        form.setValue("status", result.suggestedStatus, { shouldValidate: true });
        setSuggestionReason(result.reason);
      }
    } catch (error) {
      console.error("AI suggestion failed:", error);
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "Could not get a status suggestion at this time.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = (data: Application) => {
    onSave(data);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{application ? "Edit Application" : "Add New Application"}</DialogTitle>
          <DialogDescription>
            Fill in the details of the job application below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. LinkedIn, Seek" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Google" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateApplied"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Date Applied</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="pt-2">
                    <FormLabel>Status</FormLabel>
                    <div className="flex gap-2">
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleSuggestStatus}
                        disabled={isSuggesting}
                        title="Suggest Status with AI"
                      >
                        {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      </Button>
                    </div>
                    {suggestionReason && <FormDescription>{suggestionReason}</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any notes about the application..." className="resize-y" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Application</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
