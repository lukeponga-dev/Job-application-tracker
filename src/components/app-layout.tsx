'use client';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarFooter } from './ui/sidebar';
import { Button } from './ui/button';
import { FileText, Home, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppHeader } from './app-header';
import { ModeToggle } from './theme-provider';

interface AppLayoutProps {
    children: React.ReactNode;
    onExport?: (format: "csv" | "pdf") => void;
    applicationCount?: number;
    filter?: string;
    onFilterChange?: (filter: any) => void;
    viewMode?: 'card' | 'list';
    onViewModeChange?: (viewMode: 'card' | 'list') => void;
    onAddNew?: () => void;
    isDashboard?: boolean;
}

export function AppLayout({ children, isDashboard, ...headerProps }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">
              Jobtracker
            </h1>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" passHref>
                <SidebarMenuButton asChild isActive={pathname === '/'}>
                  <span>
                    <Home />
                    <span>Dashboard</span>
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/tailor" passHref>
                    <SidebarMenuButton asChild isActive={pathname === '/tailor'}>
                    <span>
                        <FileText />
                        <span>Tailor Documents</span>
                    </span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <ModeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {isDashboard ? (
          <AppHeader {...headerProps} />
        ) : (
            <header className="px-4 pt-6 pb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                    {pathname === '/tailor' ? 'Tailor Documents' : 'Jobtracker'}
                </h1>
                <SidebarTrigger className="md:hidden" />
            </header>
        )}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
        {isDashboard && (
            <Button
                onClick={headerProps.onAddNew}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90 md:hidden"
            >
                <Plus className="h-6 w-6" />
                <span className="sr-only">Add New Application</span>
            </Button>
        )}
      </SidebarInset>
    </>
  );
}
