import { AppSidebar } from "@/client/components/app-sidebar";
import AuthListener from "@/client/components/AuthListener";
import { SiteHeader } from "@/client/components/site-header";
import { SidebarInset, SidebarProvider } from "@/client/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <AuthListener />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
