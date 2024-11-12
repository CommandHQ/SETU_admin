
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthSection } from "./authprofile";
import { AppSidebar } from "@/components/navbar/sidebar";


// Main layout component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-screen">
          <div className="p-2 bg-white flex flex-col">
          <SidebarTrigger />
          <div className="absolute right-0 p-4 pr-10">
          <AuthSection />
          </div>
        </div>
        <div>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}