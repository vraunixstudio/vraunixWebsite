import type { HTMLAttributes } from "react";

export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`vx-skeleton ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
