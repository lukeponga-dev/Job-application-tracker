import { ApplicationDashboard } from "@/components/application-dashboard";
import { Sidebar, SidebarContent, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Sidebar>
        <SidebarContent className="p-0">
           <div className="flex items-center gap-3 p-4 border-b">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              JobTrack Pro
            </h1>
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-card/50">
          <SidebarTrigger />
        </header>
        <ApplicationDashboard />
      </SidebarInset>
    </>
  );
}
