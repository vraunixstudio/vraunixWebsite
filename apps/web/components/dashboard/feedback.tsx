"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";

export function Notice({
  tone = "info",
  children,
  onDismiss,
}: {
  tone?: "info" | "success" | "danger";
  children: ReactNode;
  onDismiss?: () => void;
}) {
  return (
    <div className={`vx-alert vx-alert--${tone}`} role={tone === "danger" ? "alert" : "status"}>
      <Icon
        name={tone === "success" ? "check" : tone === "danger" ? "alert" : "sparkles"}
        size={18}
      />
      <div>{children}</div>
      {onDismiss && (
        <button className="vx-button vx-button--secondary vx-button--md" type="button" onClick={onDismiss} aria-label="Dismiss">
          <Icon name="x" size={15} />
        </button>
      )}
    </div>
  );
}

export function Toast({
  message,
  tone = "success",
  onClose,
  action,
  duration = 4200,
}: {
  message: string;
  tone?: "success" | "danger";
  onClose: () => void;
  action?: { label: string; onClick: () => void };
  duration?: number;
}) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [paused, setPaused] = useState(false);
  const timeout = action ? Math.max(duration, 8_000) : duration;

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => closeRef.current(), timeout);
    return () => window.clearTimeout(timer);
  }, [paused, timeout]);

  return (
    <div
      className={`vx-toast vx-toast--${tone}`}
      role={tone === "danger" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <Icon name={tone === "success" ? "check" : "alert"} size={15} />
      <span>{message}</span>
      {action && (
        <button
          type="button"
          className="vx-toast__action"
          onClick={() => {
            action.onClick();
            closeRef.current();
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
