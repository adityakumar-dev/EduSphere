// app/dashboard/layout.tsx
"use client";

import { Header } from "@/components/Layouts/header";
import { Sidebar } from "@/components/Layouts/sidebar";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
        <SidebarProvider>
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header />

              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                {children}
              </main>
            </div>
          </div>
          </SidebarProvider>
    </SessionProvider>
  );
}
