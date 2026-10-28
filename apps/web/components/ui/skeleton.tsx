"use client";

import type { HTMLAttributes } from "react";

export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`vx-skeleton ${className}`}
      style={{
        backgroundColor: "rgba(20, 20, 20, 0.05)",
        borderRadius: "0.5rem",
        position: "relative",
        overflow: "hidden",
        ...props.style
      }}
      {...props}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, transparent, rgba(20, 20, 20, 0.03), transparent)",
          animation: "skeleton-shimmer 2s infinite",
        }}
      />
      <style jsx>{`
        @keyframes skeleton-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
