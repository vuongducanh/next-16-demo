import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";
import AppQueryClientProviders from "@/app/QueryClientProviders";

export const metadata: Metadata = {
  title: "Anh VD - Next 16 Demo",
  description: "A demo application using Next.js 16 features.",
  icons: {
    icon: "/app-icon.png", // Thay bằng path đến icon mới
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body cz-shortcut-listen="true">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppQueryClientProviders>
            {children}
          </AppQueryClientProviders>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
