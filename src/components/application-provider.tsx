
"use client";

import { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { Application, Status } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { deleteApplication, saveApplication, updateApplicationStatus } from "@/lib/applications.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface ApplicationContextType {
    applications: Application[];
    setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
    filter: Status | "All";
    setFilter: React.Dispatch<React.SetStateAction<Status | "All">>;
    viewMode: 'card' | 'list';
    setViewMode: React.Dispatch<React.SetStateAction<'card' | 'list'>>;
    isFormOpen: boolean;
    setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
    editingApplication: Application | null;
    setEditingApplication: React.Dispatch<React.SetStateAction<Application | null>>;
    deletingApplicationId: string | null;
    setDeletingApplicationId: React.Dispatch<React.SetStateAction<string | null>>;
    handleSaveApplication: (appData: Omit<Application, 'id'> & { id?: string }) => Promise<void>;
    handleOpenForm: (app?: Application | null) => void;
    handleStatusChange: (id: string, status: Status) => Promise<void>;
    handleDelete: (id: string) => void;
    confirmDelete: () => Promise<void>;
    handleExport: (formatType: "csv" | "pdf") => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children, initialApplications }: { children: React.ReactNode, initialApplications: Application[] }) {
    const [applications, setApplications] = useState<Application[]>(initialApplications);
    const [filter, setFilter] = useState<Status | "All">("All");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState<Application | null>(null);
    const [deletingApplicationId, setDeletingApplicationId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
    const { toast } = useToast();

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
          format(new Date(app.dateApplied), "yyyy-MM-dd"),
          app.status,
          app.notes || ""
        ]);
    
        if (formatType === "csv") {
          const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...data.map(e => e.join(","))].join("\\n");
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

    const value = {
        applications,
        setApplications,
        filter,
        setFilter,
        viewMode,
        setViewMode,
        isFormOpen,
        setIsFormOpen,
        editingApplication,
        setEditingApplication,
        deletingApplicationId,
        setDeletingApplicationId,
        handleSaveApplication,
        handleOpenForm,
        handleStatusChange,
        handleDelete,
        confirmDelete,
        handleExport,
    };

    return (
        <ApplicationContext.Provider value={value}>
            {children}
        </ApplicationContext.Provider>
    )
}

export function useApplicationContext() {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
        throw new Error('useApplicationContext must be used within an ApplicationProvider');
    }
    return context;
}
