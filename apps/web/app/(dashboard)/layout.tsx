import type { ReactNode } from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardLayoutSkeleton } from "@/components/dashboard/dashboard-layout-skeleton";
import { getServerSession } from "@/lib/session";
import { ThemeProvider } from "@/theme";
import "./dashboard.css";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/?auth=login");

  return (
    <ThemeProvider theme="light" className="dashboard-theme">
      <DashboardShell user={session.user}>
        <Suspense fallback={<DashboardLayoutSkeleton />}>
          {children}
        </Suspense>
      </DashboardShell>
    </ThemeProvider>
  );
}
