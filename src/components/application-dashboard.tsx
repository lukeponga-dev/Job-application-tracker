"use client";

import { useState, useMemo, useEffect } from "react";
import type { Application, Status } from "@/lib/types";
import { ApplicationForm } from "@/components/application-form";
import { AppHeader } from "@/components/app-header";
import { ApplicationList } from "@/components/application-list";
import { DeleteAlertDialog } from "@/components/delete-alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteApplication, saveApplication, updateApplicationStatus } from "@/lib/applications.service";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ApplicationDashboardProps {
  initialApplications: Application[];
}

export function ApplicationDashboard({ initialApplications }: ApplicationDashboardProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [filter, setFilter] = useState<Status | "All">("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [deletingApplicationId, setDeletingApplicationId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

  const handleSaveApplication = async (appData: Application) => {
    try {
      await saveApplication(appData);
      toast({ title: "Success", description: `Application ${editingApplication ? 'updated' : 'added'} successfully.` });
      setIsFormOpen(false);
      setEditingApplication(null);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save application." });
    }
  };

  const handleOpenForm = (app: Application | null = null) => {
    setEditingApplication(app);
    setIsFormOpen(true);
  };

  const handleStatusChange = async (id: string, status: Status) => {
    // Optimistic update
    const originalApplications = applications;
    setApplications(apps => apps.map(app => (app.id === id ? { ...app, status } : app)));
    try {
      await updateApplicationStatus(id, status);
    } catch (error) {
      setApplications(originalApplications);
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  const handleDelete = (id: string) => {
    setDeletingApplicationId(id);
  };

  const confirmDelete = async () => {
    if (deletingApplicationId) {
       // Optimistic update
      const originalApplications = applications;
      setApplications(apps => apps.filter(app => app.id !== deletingApplicationId));
      setDeletingApplicationId(null);
      try {
        await deleteApplication(deletingApplicationId);
        toast({ title: "Success", description: "Application deleted." });
      } catch (error) {
        setApplications(originalApplications);
        console.error(error);
        toast({ variant: "destructive", title: "Error", description: "Failed to delete application." });
      }
    }
  };
  
  const filteredApplications = useMemo(() => {
    if (filter === "All") return applications;
    return applications.filter(app => app.status === filter);
  }, [applications, filter]);


  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b md:hidden">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">JobTrack Pro</h1>
        <div className="w-8"></div>
      </div>
      <AppHeader
          onAdd={() => handleOpenForm()}
          filter={filter}
          onFilterChange={setFilter}
          applicationCount={filteredApplications.length}
      />
      <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-6 md:pb-8">
        <ApplicationList
          applications={filteredApplications}
          onStatusChange={handleStatusChange}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
        />
      </div>
      <ApplicationForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveApplication}
        application={editingApplication}
        onClose={() => setEditingApplication(null)}
      />
      <DeleteAlertDialog
        isOpen={!!deletingApplicationId}
        onOpenChange={(open) => !open && setDeletingApplicationId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
