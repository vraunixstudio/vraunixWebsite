"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

export default function DashboardTemplate({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="page-transition">{children}</div>
    </ViewTransition>
  );
}
