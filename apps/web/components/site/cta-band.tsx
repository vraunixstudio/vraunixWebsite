"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { StartProjectModal } from "@/components/site/start-project-modal";

export function CtaBand({
  eyebrow = "Start here",
  title = "A better website begins with a clear conversation.",
  description = "Share the context, constraints, and outcome you have in mind. We will help shape the next step.",
  label = "Start a project",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  label?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="cta-band">
      <div className="container cta-band__inner theme-dark">
        <div className="cta-band__mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div className="cta-band__action">
          <p>{description}</p>
          <button
            type="button"
            className="vx-button vx-button--primary vx-button--lg"
            onClick={() => setModalOpen(true)}
          >
            {label}
            <Icon name="arrow-up-right" size={18} />
          </button>
        </div>
      </div>

      <StartProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
