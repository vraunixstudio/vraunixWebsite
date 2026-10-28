"use client";

import { useEffect } from "react";
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
}: {
  message: string;
  tone?: "success" | "danger";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4200);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`vx-toast vx-toast--${tone}`} role="status">
      <Icon name={tone === "success" ? "check" : "alert"} size={15} />
      <span>{message}</span>
    </div>
  );
}
