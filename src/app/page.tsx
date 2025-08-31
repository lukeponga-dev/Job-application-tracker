import { ApplicationDashboard } from "@/components/application-dashboard";
import { createApplicationsTable } from "@/lib/db";
import { getApplications } from "@/lib/applications.service";
import { Briefcase } from "lucide-react";

export default async function Home() {
  await createApplicationsTable();
  const initialApplications = await getApplications();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b">
         <div className="flex items-center gap-3 container mx-auto">
          <Briefcase className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold text-foreground">
            JobTrack Pro
          </h1>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 container mx-auto">
         <ApplicationDashboard initialApplications={initialApplications} />
      </main>
    </div>
  );
}
