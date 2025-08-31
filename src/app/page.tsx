import { ApplicationDashboard } from "@/components/application-dashboard";
import { createApplicationsTable } from "@/lib/db";
import { getApplications } from "@/lib/applications.service";

export default async function Home() {
  await createApplicationsTable();
  const initialApplications = await getApplications();

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <ApplicationDashboard initialApplications={initialApplications} />
      </div>
    </div>
  );
}
