import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SidebarProvider } from "@/components/dashboard/SidebarContext";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-canvas-soft">
        {/* Sidebar Navigation (Desktop Static + Mobile Drawer) */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8 pb-12">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

