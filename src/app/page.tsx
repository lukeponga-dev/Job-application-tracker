import { ApplicationDashboard } from "@/components/application-dashboard";
import { createApplicationsTable } from "@/lib/db";
import { getApplications } from "@/lib/applications.service";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Briefcase, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Home() {
  await createApplicationsTable();
  const initialApplications = await getApplications();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <Briefcase className="size-5" />
            </Button>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-sidebar-foreground">JobTrack</h2>
              <p className="text-xs text-sidebar-foreground/70">Your Application Hub</p>
            </div>
          </div>
        </SidebarHeader>
        {/* The dashboard now controls sidebar content via props */}
      </Sidebar>
      <SidebarInset>
         <ApplicationDashboard initialApplications={initialApplications} />
      </SidebarInset>
    </SidebarProvider>
  );
}
