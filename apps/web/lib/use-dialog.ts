"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function useDialogFocus({
  open,
  onClose,
  containerRef,
  initialFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
}) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const target =
        initialFocusRef?.current ??
        container.querySelector<HTMLElement>("[data-autofocus]") ??
        container;
      target.focus({ preventScroll: true });
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter(
        (element) =>
          element.getAttribute("aria-hidden") !== "true" &&
          element.offsetParent !== null
      );
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      const currentIndex = focusable.indexOf(
        document.activeElement as HTMLElement
      );
      if (currentIndex === -1) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && currentIndex === 0) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && currentIndex === focusable.length - 1) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.setTimeout(() => {
        if (previouslyFocused?.isConnected) {
          previouslyFocused.focus({ preventScroll: true });
        }
      }, 0);
    };
  }, [containerRef, initialFocusRef, open]);
}

type SwipeStart = {
  pointerId: number;
  x: number;
  y: number;
};

export function useSwipeDismiss({
  onDismiss,
  enabled = true,
  handleSelector = "[data-sheet-handle]",
}: {
  onDismiss: () => void;
  enabled?: boolean;
  handleSelector?: string | null;
}) {
  const closeRef = useRef(onDismiss);
  closeRef.current = onDismiss;
  const startRef = useRef<SwipeStart | null>(null);
  const closeTimer = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || event.pointerType !== "touch" || closing) return;
      if (
        handleSelector &&
        !(event.target as HTMLElement).closest(handleSelector)
      ) {
        return;
      }

      startRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
      setDragY(0);
    },
    [closing, enabled, handleSelector]
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const start = startRef.current;
      if (!start || start.pointerId !== event.pointerId) return;
      const deltaY = event.clientY - start.y;
      const deltaX = event.clientX - start.x;

      if (deltaY <= 0 || Math.abs(deltaX) > Math.abs(deltaY)) {
        setDragY(0);
        return;
      }
      setDragY(Math.min(deltaY, 280));
    },
    []
  );

  const finishSwipe = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const start = startRef.current;
      if (!start || start.pointerId !== event.pointerId) return;
      startRef.current = null;
      setDragging(false);

      const deltaY = event.clientY - start.y;
      const deltaX = event.clientX - start.x;
      if (deltaY > 110 && Math.abs(deltaX) < 100) {
        setClosing(true);
        setDragY(360);
        closeTimer.current = window.setTimeout(() => {
          closeRef.current();
          setClosing(false);
          setDragY(0);
        }, 160);
        return;
      }
      setDragY(0);
    },
    []
  );

  const onPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (startRef.current?.pointerId !== event.pointerId) return;
      startRef.current = null;
      setDragging(false);
      setDragY(0);
    },
    []
  );

  return {
    sheetHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishSwipe,
      onPointerCancel,
    },
    sheetStyle:
      dragY === 0
        ? undefined
        : {
            transform: `translateY(${dragY}px)`,
            opacity: Math.max(0.45, 1 - dragY / 480),
            transition: dragging
              ? "none"
              : "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease",
            touchAction: "none" as const,
          },
    dragging,
    closing,
  };
}
