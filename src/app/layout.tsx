import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { CreateModal } from "@/components/create/CreateModal";
import { GlobalShortcuts } from "@/components/layout/GlobalShortcuts";

export const metadata: Metadata = {
  title: "Lumigram",
  description: "Next.js Lumigram - Production Social Media Web Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen">
        <LanguageProvider>
          <GlobalShortcuts />
          <CreateModal />

          {/* Top Mobile Header */}
          <MobileHeader />

          <div className="flex min-h-screen">
            {/* Desktop Left Sidebar & Mobile Bottom Navigation */}
            <Sidebar />

            {/* Main Page Content Area (pt-14 on mobile for MobileHeader, 0 on desktop) */}
            <div className="flex-1 md:ml-18 xl:ml-60 min-h-screen overflow-x-hidden pt-14 md:pt-0">
              {children}
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
