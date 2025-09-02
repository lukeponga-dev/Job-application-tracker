import { ApplicationDashboard } from "@/components/application-dashboard";
import { AppLayout } from "@/components/app-layout";
import { createApplicationsTable } from "@/lib/db";
import { getApplications } from "@/lib/applications.service";

export default async function Home() {
  await createApplicationsTable();
  const initialApplications = await getApplications();

  return (
    <AppLayout>
      <ApplicationDashboard initialApplications={initialApplications} />
    </AppLayout>
  );
}
