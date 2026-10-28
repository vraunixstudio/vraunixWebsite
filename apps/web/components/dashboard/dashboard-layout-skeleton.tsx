"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLayoutSkeleton() {
  const pathname = usePathname();

  return (
    <div className="dashboard-content">
      <header className="workspace-heading">
        {pathname !== "/dashboard" && (
          <div style={{ width: '18px', height: '18px' }} />
        )}
        <Skeleton style={{ height: '40px', width: '200px' }} />
      </header>

      <div className="dashboard-page" style={{ width: '100%', marginTop: '2rem' }}>
        <div style={{ display: 'grid', gap: '2rem' }}>
           <Skeleton style={{ height: '300px', width: '100%', borderRadius: '1.25rem' }} />
           <Skeleton style={{ height: '300px', width: '100%', borderRadius: '1.25rem' }} />
        </div>
      </div>
    </div>
  );
}
