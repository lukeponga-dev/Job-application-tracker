
import { ApplicationDashboard } from "@/components/application-dashboard";
import { AppHeader } from "@/components/app-header";
import { createApplicationsTable } from "@/lib/db";
import { getApplications } from "@/lib/applications.service";
import { ApplicationProvider } from "@/components/application-provider";

export default async function Home() {
  await createApplicationsTable();
  const initialApplications = await getApplications();

  return (
    <ApplicationProvider initialApplications={initialApplications}>
      <ApplicationDashboard />
    </ApplicationProvider>
  );
}
