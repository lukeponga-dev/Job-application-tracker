"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { Application, Status } from "@/lib/types";
import { statusOptions } from "@/lib/types";
import { ApplicationForm } from "@/components/application-form";
import { AppHeader } from "@/components/app-header";
import { ApplicationList } from "@/components/application-list";
import { ApplicationTable } from "@/components/application-table";
import { DeleteAlertDialog } from "@/components/delete-alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteApplication, saveApplication, updateApplicationStatus } from "@/lib/applications.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { useSidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";


interface ApplicationDashboardProps {
  initialApplications: Application[];
}

const allFilters: (Status | "All")[] = ["All", ...statusOptions];

export function ApplicationDashboard({ initialApplications }: ApplicationDashboardProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [filter, setFilter] = useState<Status | "All">("All");
  const [view, setView] = useState<'card' | 'list'>('card');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [deletingApplicationId, setDeletingApplicationId] = useState<string | null>(null);
  const { toast } = useToast();
  const { setOpenMobile } = useSidebar();


  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);
  
  const handleFilterChange = useCallback((newFilter: Status | "All") => {
    setFilter(newFilter);
    setOpenMobile(false);
  }, [setOpenMobile]);

  const handleSaveApplication = async (appData: Application) => {
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
    const headers = ["Company Name", "Role", "Date Applied", "Status", "Notes"];
    const data = filteredApplications.map(app => [
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
      <SidebarContent className="p-2 flex flex-col">
          <p className="text-xs font-semibold text-sidebar-foreground/70 mt-4 px-2">STATUS FILTERS</p>
          <SidebarMenu className="mt-2">
            {allFilters.map((status) => (
                <SidebarMenuItem key={status}>
                    <SidebarMenuButton
                        onClick={() => handleFilterChange(status)}
                        isActive={filter === status}
                    >
                      {status}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
      </SidebarContent>

      <div className="flex flex-col h-full">
        <AppHeader
            onAdd={() => handleOpenForm()}
            onExport={handleExport}
            view={view}
            onViewChange={setView}
            applicationCount={filteredApplications.length}
        />
        <main className="flex-1 p-4 sm:p-6">
          {view === 'card' ? (
            <ApplicationList
              applications={filteredApplications}
              onStatusChange={handleStatusChange}
              onEdit={handleOpenForm}
              onDelete={handleDelete}
            />
          ) : (
            <ApplicationTable
              applications={filteredApplications}
              onStatusChange={handleStatusChange}
              onEdit={handleOpenForm}
              onDelete={handleDelete}
            />
          )}
        </main>
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
    </>
  );
}
