import type { ReactNode } from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardLayoutSkeleton } from "@/components/dashboard/dashboard-layout-skeleton";
import { getServerSession } from "@/lib/session";
import { ThemeProvider } from "@/theme";
import "./dashboard.css";

async function DashboardSession({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect("/?auth=login");

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider theme="light" className="dashboard-theme">
      <Suspense fallback={<DashboardLayoutSkeleton />}>
        <DashboardSession>{children}</DashboardSession>
      </Suspense>
    </ThemeProvider>
  );
}
