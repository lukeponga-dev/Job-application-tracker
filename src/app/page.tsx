import { ApplicationDashboard } from "@/components/application-dashboard";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Briefcase, LayoutGrid, BarChart3, Settings } from "lucide-react";
import { createApplicationsTable } from "@/lib/db";
import { getApplications } from "@/lib/applications.service";

export default async function Home() {
  await createApplicationsTable();
  const initialApplications = await getApplications();

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4">
           <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              JobTrack Pro
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Dashboard">
                <LayoutGrid />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton tooltip="Analytics">
                <BarChart3 />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 md:p-4">
         <main className="h-full rounded-2xl bg-card border">
           <ApplicationDashboard initialApplications={initialApplications} />
         </main>
      </div>
    </>
  );
}
