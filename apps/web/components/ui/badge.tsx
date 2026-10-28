import type { ReactNode } from "react";
import { badgeTones, type BadgeTone } from "@/theme";

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span className={`vx-badge ${badgeTones[tone]} ${className}`.trim()}>
      {children}
    </span>
  );
}
