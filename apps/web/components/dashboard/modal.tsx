"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { useDialogFocus, useSwipeDismiss } from "@/lib/use-dialog";

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { sheetHandlers, sheetStyle } = useSwipeDismiss({ onDismiss: onClose });

  useDialogFocus({
    open,
    onClose,
    containerRef: dialogRef,
  });

  if (!open) return null;

  return (
    <div className="modal-scrim" role="presentation" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className={`modal vx-sheet ${wide ? "modal--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        style={sheetStyle}
        onMouseDown={(event) => event.stopPropagation()}
        {...sheetHandlers}
      >
        <div className="vx-sheet-handle" data-sheet-handle aria-hidden="true" />
        <header className="modal__header">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button className="vx-button vx-button--secondary vx-button--md" type="button" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={20} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>
  );
}
