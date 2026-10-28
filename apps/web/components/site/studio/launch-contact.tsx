"use client";

import { useState } from "react";
import { StartProjectModal } from "@/components/site/start-project-modal";

export function LaunchContact() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="contact" className="launch-section">
      <div className="container">
        <div className="launch-section__header">
          <div className="launch-section__intro">
            <p className="launch-section__kicker">
              <span aria-hidden="true">/</span> LET&apos;S LAUNCH
              <span aria-hidden="true">/</span>
            </p>
            <h2 className="launch-section__title">
              Let&apos;s Launch Your
              <br />
              Journey
            </h2>
            <p className="launch-section__lede">
              We are providing consultations, for free. Get advice on customer
              activation, modern architecture, reducing website complexity, or
              engineering roadmaps.
            </p>
            <button
              type="button"
              className="launch-section__cta"
              onClick={() => setModalOpen(true)}
            >
              Get Started
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="launch-section__decorations" aria-hidden="true">
            <svg
              className="launch-section__arrow-svg"
              viewBox="0 0 240 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 10 20 L 160 20 C 200 20, 200 60, 160 60 L 60 60 C 20 60, 20 100, 60 100 L 120 100 M 100 85 L 120 100 L 100 115"
                stroke="#141414"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="launch-badge launch-badge--asterisk">✱</span>
            <span className="launch-badge launch-badge--sparkle">✦</span>
          </div>
        </div>
      </div>

      <StartProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
