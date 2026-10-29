"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type LineProps = {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: CSSProperties["borderRadius"];
  className?: string;
  style?: CSSProperties;
};

function Line({
  width = "100%",
  height = "0.75rem",
  radius = "0.45rem",
  className,
  style,
}: LineProps) {
  return (
    <Skeleton
      className={className}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

function SitePageSkeleton({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${className} site-page-skeleton`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy="true"
    >
      <span className="sr-only">Loading {label}…</span>
      {children}
    </div>
  );
}

function HomePageSkeleton() {
  return (
    <SitePageSkeleton label="homepage" className="studio-landing">
      <section className="hero-studio">
        <div className="container hero-studio__inner">
          <div className="hero-studio__grid">
            <div className="hero-studio__content">
              <Line width="12rem" height="0.6rem" />
              <div className="site-skeleton-hero-title">
                <Line height="clamp(2.8rem, 6.3vw, 6rem)" radius="0.7rem" />
                <Line
                  width="92%"
                  height="clamp(2.8rem, 6.3vw, 6rem)"
                  radius="0.7rem"
                />
                <Line
                  width="64%"
                  height="clamp(2.8rem, 6.3vw, 6rem)"
                  radius="0.7rem"
                />
              </div>
              <div className="site-skeleton-summary">
                <Line height="0.82rem" />
                <Line width="88%" height="0.82rem" />
                <Line width="62%" height="0.82rem" />
              </div>
              <div className="site-skeleton-actions">
                <Line width="10rem" height="2.8rem" radius="9999px" />
                <Line width="6.8rem" height="0.8rem" />
              </div>
              <div className="hero-studio__metrics site-skeleton-metrics">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="site-skeleton-metric">
                    <Line width="3.8rem" height="1.15rem" />
                    <Line width="4.6rem" height="0.52rem" />
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-studio__media">
              <Line
                className="site-skeleton-hero-media"
                radius="1.75rem"
              />
            </div>
          </div>
        </div>
        <div className="hero-studio__ticker">
          <div className="container">
            <Line height="0.72rem" />
          </div>
        </div>
      </section>

      <section className="kinetic-statement">
        <div className="container">
          <Line width="12rem" height="0.6rem" />
          <div className="site-skeleton-statement">
            <div className="site-skeleton-heading">
              <Line height="clamp(2.2rem, 5vw, 4.2rem)" radius="0.65rem" />
              <Line
                width="78%"
                height="clamp(2.2rem, 5vw, 4.2rem)"
                radius="0.65rem"
              />
            </div>
            <div className="site-skeleton-copy">
              <Line height="0.82rem" />
              <Line width="94%" height="0.82rem" />
              <Line width="76%" height="0.82rem" />
              <Line
                width="7.5rem"
                height="2.45rem"
                radius="9999px"
                style={{ marginTop: "0.7rem" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <div className="site-skeleton-section-head">
            <div className="site-skeleton-heading">
              <Line width="9rem" height="0.6rem" />
              <Line width="18rem" height="clamp(2rem, 4vw, 3.4rem)" radius="0.65rem" />
            </div>
            <Line width="17rem" height="0.72rem" />
          </div>
          <div className="site-skeleton-service-list">
            {Array.from({ length: 7 }, (_, index) => (
              <div key={index} className="site-skeleton-service-row">
                <Line width="1.75rem" height="0.72rem" />
                <Line
                  width={index % 2 === 0 ? "52%" : "42%"}
                  height="1.15rem"
                />
                <Line width="1.9rem" height="1.9rem" radius="50%" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="container">
          <div className="site-skeleton-section-head">
            <div className="site-skeleton-heading">
              <Line width="8rem" height="0.6rem" />
              <Line width="16rem" height="clamp(2rem, 4vw, 3.4rem)" radius="0.65rem" />
            </div>
            <Line width="20rem" height="0.72rem" />
          </div>
          <div className="site-skeleton-process-grid">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="site-skeleton-process-card">
                <div className="site-skeleton-process-card__head">
                  <Line width="2.5rem" height="0.58rem" />
                  <Line width="1.6rem" height="1.6rem" radius="50%" />
                </div>
                <Line width="76%" height="1rem" />
                <Line width="88%" height="0.65rem" />
                <Line width="64%" height="0.65rem" />
                <Line width="100%" height="0.65rem" style={{ marginTop: "0.45rem" }} />
                <Line width="83%" height="0.65rem" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="launch-section">
        <div className="container">
          <div className="site-skeleton-launch">
            <div className="site-skeleton-heading">
              <Line width="9rem" height="0.6rem" />
              <Line width="80%" height="clamp(2.3rem, 5vw, 4.4rem)" radius="0.65rem" />
              <Line width="55%" height="clamp(2.3rem, 5vw, 4.4rem)" radius="0.65rem" />
              <Line width="70%" height="0.78rem" style={{ marginTop: "0.75rem" }} />
            </div>
            <Line width="13rem" height="4.25rem" radius="9999px" />
          </div>
        </div>
      </section>
    </SitePageSkeleton>
  );
}

function LegalPageSkeleton() {
  return (
    <SitePageSkeleton label="legal page" className="studio-legal">
      <header className="studio-legal__header">
        <div className="container">
          <Line width="18rem" height="0.62rem" style={{ marginBottom: "1.25rem" }} />
          <Line
            className="site-skeleton-legal-title"
            width="min(30rem, 82%)"
            height="clamp(2.6rem, 5.5vw, 4.5rem)"
            radius="0.7rem"
          />
          <div className="site-skeleton-legal-subtitle">
            <Line width="100%" height="0.85rem" />
            <Line width="88%" height="0.85rem" />
          </div>
          <div className="studio-legal__meta-bar">
            <div className="studio-legal__meta-tags">
              {Array.from({ length: 3 }, (_, index) => (
                <Line key={index} width="8rem" height="1.7rem" radius="9999px" />
              ))}
            </div>
            <div className="studio-legal__tabs">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="studio-legal__tab">
                  <Line width={index === 0 ? "6.5rem" : "8rem"} height="0.7rem" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="studio-legal__body">
        <div className="container studio-legal__grid">
          <aside className="studio-legal__sidebar">
            <div className="studio-legal__sidebar-inner">
              <Line width="5rem" height="0.6rem" />
              <nav className="studio-legal__toc">
                {Array.from({ length: 8 }, (_, index) => (
                  <div key={index} className="studio-legal__toc-link">
                    <Line width="1.8rem" height="1.2rem" radius="0.25rem" />
                    <Line width={index % 2 === 0 ? "8.5rem" : "7rem"} height="0.7rem" />
                  </div>
                ))}
              </nav>
              <div className="studio-legal__sidebar-card">
                <Line width="6rem" height="0.55rem" />
                <Line width="94%" height="0.68rem" style={{ marginTop: "0.65rem" }} />
                <Line width="78%" height="0.68rem" />
                <Line width="8.5rem" height="0.7rem" style={{ marginTop: "0.65rem" }} />
              </div>
            </div>
          </aside>

          <article className="studio-legal__content">
            <div className="studio-legal__summary-card">
              <Line width="9rem" height="0.58rem" />
              <Line
                width="min(28rem, 82%)"
                height="1.35rem"
                radius="0.4rem"
                style={{ marginTop: "0.75rem", marginBottom: "1.25rem" }}
              />
              <ul className="studio-legal__summary-list">
                {Array.from({ length: 4 }, (_, index) => (
                  <li key={index}>
                    <Line width={index % 2 === 0 ? "94%" : "82%"} height="0.76rem" />
                    <Line width={index % 2 === 0 ? "68%" : "74%"} height="0.76rem" />
                  </li>
                ))}
              </ul>
            </div>

            {Array.from({ length: 3 }, (_, index) => (
              <section key={index} className="studio-legal__section">
                <div className="studio-legal__section-header">
                  <Line width="2rem" height="1.25rem" radius="0.3rem" />
                  <Line width={index === 0 ? "13rem" : "16rem"} height="1.25rem" radius="0.35rem" />
                </div>
                <Line width="100%" height="0.8rem" />
                <Line width="96%" height="0.8rem" />
                <Line width="82%" height="0.8rem" />
                <Line width="91%" height="0.8rem" />
                <Line width="64%" height="0.8rem" />
              </section>
            ))}
          </article>
        </div>
      </section>
    </SitePageSkeleton>
  );
}

export function SiteLayoutSkeleton() {
  const pathname = usePathname();
  return pathname === "/" ? <HomePageSkeleton /> : <LegalPageSkeleton />;
}
