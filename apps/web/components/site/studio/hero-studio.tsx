"use client";

import Image from "next/image";

export function HeroStudio() {
  return (
    <section id="home" className="hero-studio">
      <div className="container hero-studio__inner">
        {/* Main Hero Split Grid: Text Left, Image Right */}
        <div className="hero-studio__grid">
          {/* Left Column: Typography & Story */}
          <div className="hero-studio__content">
            <div className="hero-studio__kicker">
              <span className="tag-slash">/</span>
              <span>WEBSITE DEVELOPMENT STUDIO</span>
              <span className="tag-slash">/</span>
            </div>

            <h1 className="hero-studio__title">
              We engineer first
              <br />
              <span className="hero-studio__title-line">
                class websites
                <span className="hero-studio__asterisk" aria-hidden="true">
                  ✱
                </span>
              </span>
            </h1>

            <p className="hero-studio__summary">
              Vraunix is an independent website development studio focusing on high-performance digital
              experiences, custom web applications, and intuitive UI/UX. We help businesses achieve goals
              through modern engineering.
            </p>

          </div>

          {/* Right Column: Monochrome Hero Artwork Image */}
          <div className="hero-studio__media">
            <Image
              src="/images/vraunix-hero-art.jpg"
              alt="Vraunix Studio — First-Class Website Development with Precision Engineering"
              width={1920}
              height={1080}
              priority
              quality={95}
              className="hero-studio__image"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Ticker / Marquee Band Below Split Grid */}
        <div className="hero-studio__ticker" aria-hidden="true">
          <div className="hero-studio__ticker-track">
            <span>HIGH PERFORMANCE</span>
            <span className="ticker-sep">→</span>
            <span>WEB DEVELOPMENT</span>
            <span className="ticker-sep">→</span>
            <span>UI/UX ENGINEERING</span>
            <span className="ticker-sep">→</span>
            <span>NEXT.JS &amp; REACT</span>
            <span className="ticker-sep">→</span>
            <span>CREATIVE MOTION</span>
            <span className="ticker-sep">→</span>
            <span>HEADLESS CMS</span>
            <span className="ticker-sep">→</span>
            <span>CORE WEB VITALS</span>
            <span className="ticker-sep">→</span>
            <span>HIGH PERFORMANCE</span>
            <span className="ticker-sep">→</span>
            <span>WEB DEVELOPMENT</span>
            <span className="ticker-sep">→</span>
            <span>UI/UX ENGINEERING</span>
            <span className="ticker-sep">→</span>
            <span>NEXT.JS &amp; REACT</span>
            <span className="ticker-sep">→</span>
            <span>CREATIVE MOTION</span>
            <span className="ticker-sep">→</span>
            <span>HEADLESS CMS</span>
            <span className="ticker-sep">→</span>
          </div>
        </div>
      </div>

    </section>
  );
}
