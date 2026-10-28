"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function KineticStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !marqueeTrackRef.current) return;

    // Smooth scrub of huge typography as the user scrolls through the section
    const ctx = gsap.context(() => {
      gsap.to(marqueeTrackRef.current, {
        xPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="kinetic-statement" ref={containerRef}>
      <div className="container">
        {/* Studio Info Row */}
        <div className="kinetic-statement__header">
          <div className="kinetic-statement__kicker">
            <span className="tag-slash">/</span>
            <span>STUDIO</span>
            <span className="tag-slash">/</span>
          </div>

          <div className="kinetic-statement__content">
            <h2 className="kinetic-statement__title">
              Leading website
              <br />
              development innovators
            </h2>

            <div className="kinetic-statement__aside">
              <p className="kinetic-statement__lede">
                We are providing consultations, for free. Get advice on performance optimization,
                modern tech stacks, conversion-focused architecture, or engineering roadmaps.
              </p>

              <div className="kinetic-statement__callout">
                <span>We will answer any website development questions on a short call.</span>
                <a
                  href="#contact"
                  onClick={scrollToContact}
                  className="vx-button vx-button--pill-dark vx-button--sm"
                >
                  Let&apos;s connect
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Massive Kinetic Typography Scrub */}
      <div className="kinetic-statement__ticker" aria-hidden="true">
        <div className="kinetic-statement__track" ref={marqueeTrackRef}>
          <span className="kinetic-word kinetic-word--outline">We</span>
          <span className="kinetic-symbol">
            <svg width="120" height="70" viewBox="0 0 140 80" fill="none">
              <path
                d="M10 40 Q 60 10, 100 40 L 130 40 M 110 20 L 130 40 L 110 60"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="kinetic-word">are</span>

          <span className="kinetic-word kinetic-word--bold">best:</span>
          <span className="kinetic-symbol-star">✱</span>
          <span className="kinetic-word kinetic-word--outline">We</span>
          <span className="kinetic-symbol">
            <svg width="120" height="70" viewBox="0 0 140 80" fill="none">
              <path
                d="M10 40 Q 60 10, 100 40 L 130 40 M 110 20 L 130 40 L 110 60"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="kinetic-word">are</span>

          <span className="kinetic-word kinetic-word--bold">best:</span>
        </div>
      </div>
    </section>
  );
}
