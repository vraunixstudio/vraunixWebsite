"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@vraunix/shared";
import { LoginForm } from "@/components/auth/login-form";
import { Icon } from "@/components/icons";
import { useDialogFocus, useSwipeDismiss } from "@/lib/use-dialog";

/**
 * AuthPopup renders a modal dialog containing the login form.
 * It can be triggered from anywhere (e.g., the site header) to provide
 * a seamless, on-page authentication experience without navigating to
 * a dedicated auth route.
 */
export default function AuthPopup({
  user = null,
  sessionReady = true,
}: {
  user?: SessionUser | null;
  sessionReady?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { sheetHandlers, sheetStyle } = useSwipeDismiss({
    onDismiss: () => setOpen(false),
    enabled: open,
  });

  useDialogFocus({
    open,
    onClose: () => setOpen(false),
    containerRef: dialogRef,
  });

  useEffect(() => {
    if (!sessionReady) return;
    const authRequested =
      new URLSearchParams(window.location.search).get("auth") === "login";

    if (user) {
      if (authRequested) router.replace("/dashboard");
      return;
    }

    if (authRequested) setOpen(true);
  }, [router, sessionReady, user]);

  useEffect(() => {
    if (open && user) setOpen(false);
  }, [open, user]);

  function openAccount() {
    if (user) {
      router.push("/dashboard");
      return;
    }
    setOpen(true);
  }

  if (!open) {
    return (
      <button
        type="button"
        className="auth-popup__trigger"
        style={{
          color: "#000",
          backgroundColor: "transparent",
          padding: 0,
          width: "44px",
          height: "44px",
          border: "1.5px solid #000",
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: 'all 0.2s ease',
          marginRight: '0.75rem'
        }}
        onClick={openAccount}
        aria-label={user ? "Open dashboard" : "Sign in"}
      >
        <Icon name="users" size={18} />
      </button>
    );
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,20,20,0.4)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'grid',
        placeItems: 'center',
        padding: '1.25rem',
        overflowY: 'auto'
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        tabIndex={-1}
        ref={dialogRef}
        className="auth-popup__card vx-sheet"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          border: '1px solid #000',
          borderRadius: '1.75rem',
          boxShadow: '0 32px 80px -12px rgba(0, 0, 0, 0.35)',
          padding: '3rem 2.5rem 2.5rem',
          outline: 'none',
          animation: 'fadeDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          ...sheetStyle
        }}
        {...sheetHandlers}
      >
        <div className="vx-sheet-handle" data-sheet-handle aria-hidden="true" />
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid rgba(20,20,20,0.1)',
            display: 'grid',
            placeItems: 'center',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          <Icon name="x" size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vx-muted)', display: 'block', marginBottom: '0.4rem' }}>
            / STUDIO /
          </span>
        </div>

        <LoginForm nextPath="/dashboard" />
      </div>
      <style jsx global>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
