"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";

export function ClientDialogShell({
  onClose,
  labelledBy,
  children,
  inline = false,
}: {
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  inline?: boolean;
}) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (inline) return;
    setTarget(
      document.querySelector<HTMLElement>(".dashboard-theme") ?? document.body
    );
  }, [inline]);

  useEffect(() => {
    if (inline) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => cardRef.current?.focus(), 0);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !cardRef.current) return;

      const focusable = Array.from(
        cardRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [inline]);

  if (inline) {
    return (
      <div className="client-dialog client-dialog--page">
        <div
          ref={cardRef}
          className="start-modal__card start-modal__card--stepper client-dialog__card"
          role="dialog"
          aria-labelledby={labelledBy}
          tabIndex={-1}
        >
          <button
            type="button"
            className="start-modal__close client-dialog__close"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <Icon name="x" size={18} />
          </button>
          {children}
        </div>
      </div>
    );
  }

  if (!target) return null;

  return createPortal(
    <div
      className="start-modal client-dialog"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        className="start-modal__card start-modal__card--stepper client-dialog__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="start-modal__close client-dialog__close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="x" size={18} />
        </button>
        {children}
      </div>
    </div>,
    target
  );
}
