"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { Application, Status } from "@/lib/types";
import { ApplicationForm } from "@/components/application-form";
import { AppLayout } from "@/components/app-layout";
import { ApplicationList } from "@/components/application-list";
import { DeleteAlertDialog } from "@/components/delete-alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteApplication, saveApplication, updateApplicationStatus } from "@/lib/applications.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";


interface ApplicationDashboardProps {
  initialApplications: Application[];
}

export function ApplicationDashboard({ initialApplications }: ApplicationDashboardProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [filter, setFilter] = useState<Status | "All">("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [deletingApplicationId, setDeletingApplicationId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const { toast } = useToast();
  const isMobile = useIsMobile();


  useEffect(() => {
    if (isMobile) {
        setViewMode('card');
    }
  }, [isMobile]);

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);
  
  const handleFilterChange = useCallback((newFilter: Status | "All") => {
    setFilter(newFilter);
  }, []);

  const handleSaveApplication = async (appData: Omit<Application, 'id'> & { id?: string }) => {
    try {
      const savedApplication = await saveApplication(appData);
      
      setApplications(prev => {
          const exists = prev.some(app => app.id === savedApplication.id);
          if (exists) {
            return prev.map(app => app.id === savedApplication.id ? savedApplication : app);
          }
          return [savedApplication, ...prev];
      });

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

  const handleExport = (formatType: "csv" | "pdf") => {
    const headers = ["Platform", "Company Name", "Role", "Date Applied", "Status", "Notes"];
    const data = filteredApplications.map(app => [
      app.platform || "",
      app.companyName,
      app.role,
      format(app.dateApplied, "yyyy-MM-dd"),
      app.status,
      app.notes || ""
    ]);

    if (formatType === "csv") {
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...data.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "applications.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (formatType === "pdf") {
      const doc = new jsPDF();
      doc.text("Job Applications", 14, 15);
      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 20,
      });
      doc.save("applications.pdf");
    }
  };


  return (
    <>
      <AppLayout
        isDashboard
        onExport={handleExport}
        applicationCount={filteredApplications.length}
        filter={filter}
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddNew={() => handleOpenForm()}
      >
        <ApplicationList
            applications={filteredApplications}
            onStatusChange={handleStatusChange}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            viewMode={viewMode}
          />
      </AppLayout>

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
    </>
  );
}
