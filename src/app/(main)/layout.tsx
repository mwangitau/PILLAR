import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col h-screen">
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    </SidebarProvider>
  );
}
