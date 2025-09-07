
import { ApplicationDashboard } from "@/components/application-dashboard";
import { AppHeader } from "@/components/app-header";
import { createApplicationsTable, createUsersTable } from "@/lib/db";
import { getApplications } from "@/lib/applications.service";
import { ApplicationProvider } from "@/components/application-provider";
import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from 'next/navigation';


export default async function Home() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/login');
  }
  
  await createUsersTable();
  await createApplicationsTable();
  const initialApplications = await getApplications(user.id);

  return (
    <ApplicationProvider initialApplications={initialApplications} userId={user.id}>
      <ApplicationDashboard />
    </ApplicationProvider>
  );
}