"use client";

import { useState, useMemo, useEffect } from "react";
import type { Application, Status } from "@/lib/types";
import { ApplicationForm } from "@/components/application-form";
import { AppHeader } from "@/components/app-header";
import { ApplicationList } from "@/components/application-list";
import { DeleteAlertDialog } from "@/components/delete-alert-dialog";
import { useToast } from "@/hooks/use-toast";

const initialApplications: Application[] = [
  {
    id: "1",
    companyName: "Innovate Inc.",
    role: "Frontend Developer",
    dateApplied: new Date("2024-05-10T00:00:00.000Z"),
    status: "Interviewing",
    notes: "Completed first round interview. Second round scheduled for next week.",
  },
  {
    id: "2",
    companyName: "Data Solutions",
    role: "Data Analyst",
    dateApplied: new Date("2024-05-15T00:00:00.000Z"),
    status: "Applied",
    notes: "Submitted application through their portal.",
  },
  {
    id: "3",
    companyName: "Creative Minds",
    role: "UX/UI Designer",
    dateApplied: new Date("2024-04-20T00:00:00.000Z"),
    status: "Rejected",
    notes: "Received automated rejection email.",
  },
  {
    id: "4",
    companyName: "NextGen Tech",
    role: "Product Manager",
    dateApplied: new Date("2024-03-12T00:00:00.000Z"),
    status: "Offer",
    notes: "Received a competitive offer. Currently negotiating salary.",
  },
];

export function ApplicationDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [filter, setFilter] = useState<Status | "All">("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [deletingApplicationId, setDeletingApplicationId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // In a real app, you'd fetch data from an API. Here we use localStorage.
    const storedApps = localStorage.getItem('jobApplications');
    if (storedApps) {
      try {
        const parsedApps = JSON.parse(storedApps).map((app: any) => ({
          ...app,
          dateApplied: new Date(app.dateApplied),
        }));
        setApplications(parsedApps);
      } catch (error) {
        setApplications(initialApplications);
      }
    } else {
      setApplications(initialApplications);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('jobApplications', JSON.stringify(applications));
    }
  }, [applications, isClient]);

  const handleSaveApplication = (appData: Application) => {
    if (editingApplication) {
      setApplications(apps => apps.map(app => (app.id === appData.id ? appData : app)));
      toast({ title: "Success", description: "Application updated successfully." });
    } else {
      setApplications(apps => [appData, ...apps]);
      toast({ title: "Success", description: "Application added successfully." });
    }
    setIsFormOpen(false);
    setEditingApplication(null);
  };

  const handleOpenForm = (app: Application | null = null) => {
    setEditingApplication(app);
    setIsFormOpen(true);
  };

  const handleStatusChange = (id: string, status: Status) => {
    setApplications(apps => apps.map(app => (app.id === id ? { ...app, status } : app)));
  };

  const handleDelete = (id: string) => {
    setDeletingApplicationId(id);
  };

  const confirmDelete = () => {
    if (deletingApplicationId) {
      setApplications(apps => apps.filter(app => app.id !== deletingApplicationId));
      toast({ title: "Success", description: "Application deleted." });
      setDeletingApplicationId(null);
    }
  };
  
  const filteredApplications = useMemo(() => {
    if (filter === "All") return applications;
    return applications.filter(app => app.status === filter);
  }, [applications, filter]);


  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
         <AppHeader
            onAdd={() => handleOpenForm()}
            filter={filter}
            onFilterChange={setFilter}
            applicationCount={filteredApplications.length}
        />
        <ApplicationList
          applications={filteredApplications}
          onStatusChange={handleStatusChange}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
        />
      </main>
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
