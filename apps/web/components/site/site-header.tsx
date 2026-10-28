"use client";

import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { StartProjectModal } from "@/components/site/start-project-modal";
import AuthPopup from "@/components/auth/auth-popup";

export function SiteHeader() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <Logo textOnly />
        </div>

        <div className="site-header__actions">
          <AuthPopup />
          <button
            type="button"
            className="vx-button vx-button--pill-dark"
            onClick={() => setModalOpen(true)}
          >
            Get Started
          </button>
        </div>
      </div>

      <StartProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </header>
  );
}
