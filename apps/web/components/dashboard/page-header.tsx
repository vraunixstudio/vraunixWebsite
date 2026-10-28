import type { ReactNode } from "react";

export function PageHeader({
  actions,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}) {
  if (!actions) return null;

  return <div className="dashboard-page-actions">{actions}</div>;
}
