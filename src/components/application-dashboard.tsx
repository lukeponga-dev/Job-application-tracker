"use client";

import { useMemo } from "react";
import { ApplicationList } from "@/components/application-list";
import { DeleteAlertDialog } from "@/components/delete-alert-dialog";
import { AppHeader } from "./app-header";
import { useApplicationContext } from "./application-provider";
import { ApplicationForm } from "./application-form";

export function ApplicationDashboard() {
  const { 
    applications, 
    filter, 
    handleDelete, 
    handleOpenForm, 
    handleStatusChange,
    isFormOpen,
    setIsFormOpen,
    handleSaveApplication,
    editingApplication,
    setEditingApplication,
    deletingApplicationId,
    setDeletingApplicationId,
    confirmDelete
  } = useApplicationContext();

  const filteredApplications = useMemo(() => {
    if (filter === "All") return applications;
    return applications.filter(app => app.status === filter);
  }, [applications, filter]);
  
  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      <main className="flex-1 overflow-y-auto p-4">
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
    </div>
  );
}
