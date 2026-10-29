"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { useDialogFocus, useSwipeDismiss } from "@/lib/use-dialog";

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
  const { sheetHandlers, sheetStyle } = useSwipeDismiss({
    onDismiss: onClose,
    enabled: !inline,
  });

  useDialogFocus({
    open: !inline && Boolean(target),
    onClose,
    containerRef: cardRef,
  });

  useEffect(() => {
    if (inline) return;
    setTarget(
      document.querySelector<HTMLElement>(".dashboard-theme") ?? document.body
    );
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
        className="start-modal__card start-modal__card--stepper client-dialog__card vx-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        style={sheetStyle}
        onMouseDown={(event) => event.stopPropagation()}
        {...sheetHandlers}
      >
        <div className="vx-sheet-handle" data-sheet-handle aria-hidden="true" />
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
