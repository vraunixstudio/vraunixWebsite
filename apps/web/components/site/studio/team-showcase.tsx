"use client";

export function TeamShowcase() {
  return (
    <section id="team" className="team-section">
      <div className="container">
        {/* Section Header */}
        <div className="team-section__header">
          <div className="team-section__kicker">
            <span className="tag-slash">/</span>
            <span>WHO WE ARE VRAUNIX</span>
            <span className="tag-slash">/</span>
          </div>

          <div className="team-section__heading-row">
            <h2 className="team-section__title">Team</h2>
            <p className="team-section__desc">
              A full-cycle website development studio, made of engineers and designers
              who genuinely enjoy building standout digital experiences together.
            </p>
          </div>
        </div>

        {/* 3 Team Cards */}
        <div className="team-grid">
          {/* Card 1: Collaborations */}
          <div className="team-card">
            <div className="team-card__image-box">
              <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="320" height="280" rx="16" fill="#deddd5" />
                {/* 3 Stylized Minimalist Avatars */}
                <g transform="translate(60, 50)">
                  {/* Left Avatar */}
                  <circle cx="50" cy="50" r="32" fill="#202422" />
                  <rect x="26" y="44" width="48" height="12" rx="4" fill="#deddd5" />
                  <path d="M 20 120 C 20 85, 80 85, 80 120 Z" fill="#202422" />

                  {/* Center Avatar (Front) */}
                  <circle cx="100" cy="40" r="36" fill="#141414" />
                  <rect x="74" y="34" width="52" height="14" rx="5" fill="#b4b29c" />
                  <path d="M 64 125 C 64 85, 136 85, 136 125 Z" fill="#141414" />

                  {/* Right Avatar */}
                  <circle cx="150" cy="50" r="32" fill="#202422" />
                  <rect x="126" y="44" width="48" height="12" rx="4" fill="#deddd5" />
                  <path d="M 120 120 C 120 85, 180 85, 180 120 Z" fill="#202422" />
                </g>
              </svg>
            </div>

            <div className="team-card__content">
              <h3 className="team-card__name">Collaborations</h3>
              <p className="team-card__bio">
                We have access to the best design and development talent worldwide.
                Based on your project goal, we strengthen our core with top-notch creative developers,
                WebGL/3D artists, or backend architects.
              </p>
              <div className="team-card__actions">
                <span className="team-card__pill">Global Network</span>
              </div>
            </div>
          </div>

          {/* Card 2: Kristina Holysheva */}
          <div className="team-card">
            <div className="team-card__image-box">
              <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="320" height="280" rx="16" fill="#deddd5" />
                {/* Stylized Modern Portrait Silhouette */}
                <circle cx="160" cy="100" r="54" fill="#c4c2b2" />
                <path
                  d="M 120 90 Q 160 50, 200 90 Q 190 160, 160 165 Q 130 160, 120 90 Z"
                  fill="#1b1e1d"
                />
                <circle cx="160" cy="115" r="32" fill="#e7e5dc" />
                <path d="M 90 240 C 90 170, 230 170, 230 240 Z" fill="#1b1e1d" />
              </svg>
            </div>

            <div className="team-card__content">
              <h3 className="team-card__name">Kristina Holysheva</h3>
              <p className="team-card__bio">
                Founder of a specialized digital recruitment studio, ex-Google Design Recruiter,
                experienced in building and scaling high-velocity engineering teams with 8+ years in tech.
                Based in Warsaw.
              </p>
              <div className="team-card__actions">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="vx-button vx-button--pill-dark vx-button--sm"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Borys Baklanov */}
          <div className="team-card">
            <div className="team-card__image-box">
              <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="320" height="280" rx="16" fill="#deddd5" />
                {/* Stylized Modern Architect Silhouette */}
                <circle cx="160" cy="95" r="52" fill="#c4c2b2" />
                <path
                  d="M 125 80 Q 160 40, 195 80 Q 200 130, 160 155 Q 120 130, 125 80 Z"
                  fill="#242826"
                />
                <circle cx="160" cy="110" r="30" fill="#deddd5" />
                <path d="M 85 240 C 85 165, 235 165, 235 240 Z" fill="#242826" />
              </svg>
            </div>

            <div className="team-card__content">
              <h3 className="team-card__name">Borys Baklanov</h3>
              <p className="team-card__bio">
                Principal web engineer with 8+ years of experience building world-renowned SaaS products
                and high-scale web platforms. Focused on performance architecture, fluid motion, and Next.js systems.
                Based in Berlin.
              </p>
              <div className="team-card__actions">
                <a
                  href="#contact"
                  className="vx-button vx-button--pill-dark vx-button--sm"
                >
                  Connect ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
