"use client";

import { useEffect, useState } from "react";

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "01",
    number: "01",
    title: "CUSTOM WEBSITE DEVELOPMENT",
    tagline: "Built from zero. Engineered for speed.",
    description:
      "Vraunix specializes in full-cycle website development, engineering high-speed custom web architectures with clean code, responsive layouts, accessible UI/UX, headless CMS integration, testing, performance optimization, and scalable cloud deployments.",
    deliverables: ["Full-Stack Architecture", "Next.js & React Build", "API Integrations", "Sub-second Page Load"],
  },
  {
    id: "02",
    number: "02",
    title: "UI / UX ENGINEERING",
    tagline: "Interfaces that feel alive.",
    description:
      "Bridging the gap between design vision and production code. We create component-driven interfaces that feel tactile, responsive, and intuitive across desktop, tablet, and mobile viewports.",
    deliverables: ["Micro-Interactions", "Responsive Design", "WCAG 2.1 AA Accessibility", "Design-to-Code Parity"],
  },
  {
    id: "03",
    number: "03",
    title: "PERFORMANCE & CORE WEB VITALS",
    tagline: "Fast is a feature.",
    description:
      "Engineered for sub-second page loads, 95+ Google Lighthouse scores, edge caching, image optimization, and rigorous Core Web Vitals compliance to maximize your organic search rankings and user retention.",
    deliverables: ["Lighthouse 95+ Guarantee", "Asset Minification & Compression", "Edge CDN Configuration", "CLS & LCP Optimization"],
  },
  {
    id: "04",
    number: "04",
    title: "FULL-STACK WEB APPLICATIONS",
    tagline: "Platforms that grow with you.",
    description:
      "Modern web platforms and portals engineered with robust databases, secure authentication, client dashboards, and cloud integrations built to scale with your business growth.",
    deliverables: ["Client Portals", "Database Architecture", "Secure Auth & RBAC", "Real-time Synchronization"],
  },
  {
    id: "05",
    number: "05",
    title: "DESIGN SYSTEMS & COMPONENT LIBRARIES",
    tagline: "One language, every surface.",
    description:
      "Tokenized, reusable UI component libraries that establish consistency across your digital ecosystem, accelerating development velocity and maintaining brand coherence.",
    deliverables: ["Figma to Code Tokens", "Atomic Components", "Interactive Documentation", "Scalable Theme Engines"],
  },
  {
    id: "06",
    number: "06",
    title: "CODE & ARCHITECTURE AUDITS",
    tagline: "An X-ray for your codebase.",
    description:
      "Comprehensive technical reviews of your existing web codebase. We diagnose architectural flaws, security vulnerabilities, bundle bloat, and deliver an actionable remediation roadmap.",
    deliverables: ["Code Quality Review", "Security & Dependency Check", "Performance Profiling", "Refactoring Blueprint"],
  },
  {
    id: "07",
    number: "07",
    title: "USER RESEARCH & CONVERSION DESIGN",
    tagline: "Design that converts.",
    description:
      "Data-informed user journeys that eliminate friction. We evaluate user flows, streamline checkout and inquiry funnels, and implement high-converting layout hierarchies.",
    deliverables: ["Conversion Funnel Analysis", "User Journey Mapping", "A/B Testing Setup", "High-Impact CTAs"],
  },
  {
    id: "08",
    number: "08",
    title: "WEBSITE CARE & SCALE SUPPORT",
    tagline: "We stay after launch.",
    description:
      "Reliable ongoing engineering support, continuous security patches, proactive uptime monitoring, and iterative feature development to ensure your website remains modern and dependable.",
    deliverables: ["24/7 Health Monitoring", "Regular Security Updates", "Monthly Feature Sprints", "Priority Bug Fixes"],
  },
];

export function ServicesAccordion() {
  const [active, setActive] = useState<ServiceItem | null>(null);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [active]);

  return (
    <section id="services" className="services-section">
      <div className="container">
        <header className="services-section__header">
          <div className="services-section__heading">
            <div className="services-section__kicker">
              <span className="tag-slash">/</span>
              <span>SERVICES</span>
              <span className="tag-slash">/</span>
            </div>
            <h2 className="services-section__title">
              Engineered capabilities
              <br />
              for ambitious brands
            </h2>
          </div>

          <div className="services-section__aside">
            <p className="services-section__note">
              Eight disciplines, one studio. Click a row to open the full detail.
            </p>
            <div className="services-section__stat" aria-hidden="true">
              <span className="services-section__stat-num">08</span>
              <span className="services-section__stat-label">
                Disciplines,
                <br />
                in-house
              </span>
            </div>
          </div>
        </header>

        <div className="services-list" role="list">
          {SERVICES_DATA.map((service) => (
            <button
              key={service.id}
              type="button"
              className="service-row"
              onClick={() => setActive(service)}
              aria-label={`View details for ${service.title}`}
            >
              <span className="service-row__num">{service.number}</span>
              <span className="service-row__title-wrap">
                <span className="service-row__tilde" aria-hidden="true">
                  ~
                </span>
                <h3 className="service-row__title">{service.title}</h3>
                <span className="service-row__tagline">{service.tagline}</span>
              </span>
              <span className="service-row__toggle" aria-hidden="true">
                <span className="service-row__toggle-icon" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="service-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActive(null);
          }}
        >
          <div
            className="service-modal__card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
          >
            <button
              type="button"
              className="service-modal__close"
              aria-label="Close"
              onClick={() => setActive(null)}
            >
              <span aria-hidden="true">×</span>
            </button>

            <h2 className="service-modal__title" id="service-modal-title">
              {active.title}
            </h2>
            <p className="service-modal__tagline">{active.tagline}</p>
            <p className="service-modal__desc">{active.description}</p>

            <ul className="service-modal__list">
              {active.deliverables.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
