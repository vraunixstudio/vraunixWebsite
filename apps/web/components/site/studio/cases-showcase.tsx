"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const MIRO_SESSIONS = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 58 },
  { label: "Wed", value: 49 },
  { label: "Thu", value: 72 },
  { label: "Fri", value: 64 },
  { label: "Sat", value: 38 },
];

const COMPETERA_FUNNEL = [
  { label: "Visit", value: 8200 },
  { label: "Trial", value: 4100 },
  { label: "Active", value: 2360 },
  { label: "Paid", value: 1140 },
  { label: "Scale", value: 690 },
];

const MIRO_NOTES = [
  { author: "German", note: "Design token sync between Figma & Next.js", n: "01" },
  { author: "Chris", note: "Sub-100ms real-time cursor broadcast", n: "02" },
  { author: "Matt", note: "99.8% Core Web Vitals score on mobile", n: "03" },
];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="case-chart__tooltip" role="presentation">
      <span className="case-chart__tooltip-label">{label}</span>
      <span className="case-chart__tooltip-value">{payload[0]?.value}</span>
    </div>
  );
}

export function CasesShowcase() {
  return (
    <section id="cases" className="cases-section">
      <div className="container">
        {/* Section Header */}
        <div className="cases-section__header">
          <div className="cases-section__kicker">
            <span className="tag-slash">/</span>
            <span>CASES</span>
            <span className="tag-slash">/</span>
          </div>
          <h2 className="cases-section__title">
            Featured work &amp;
            <br />
            digital benchmarks
          </h2>
        </div>

        <div className="cases-list">
          {/* Case 1: Miro Collaboration Workspace */}
          <article className="case-card">
            <div className="case-card__head">
              <div className="case-card__who">
                <span className="case-tag">New Feature</span>
                <div className="case-client">
                  <strong>MIRO</strong>
                  <span className="case-subtext">(Collaboration tool)</span>
                </div>
              </div>

              <p className="case-card__desc">
                We helped Miro disrupt visual collaboration through innovative interactive
                engineering. Vraunix engineered interactive whiteboard features and real-time
                visual collaboration canvas components, elevating the workshop experience and
                driving viral user acquisition.
              </p>

              <a
                href="https://miro.com"
                target="_blank"
                rel="noreferrer"
                className="case-card__link"
              >
                See live <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="case-card__grid">
              {/* Brand tile */}
              <div className="case-tile case-tile--brand">
                <span className="brand-logo-text">miro</span>
                <span className="case-tile__caption">Workshop canvas</span>
              </div>

              {/* Notes */}
              <div className="case-tile case-tile--notes">
                <span className="case-tile__label">Canvas modules</span>
                <ul className="case-notes">
                  {MIRO_NOTES.map((item) => (
                    <li key={item.n} className="case-note">
                      <span className="case-note__num">{item.n}</span>
                      <div>
                        <span className="case-note__author">{item.author}</span>
                        <p>{item.note}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Live sessions chart */}
              <div className="case-tile case-tile--chart">
                <div className="case-tile__chart-head">
                  <span className="case-tile__label">Weekly workshop sessions</span>
                  <span className="case-tile__metric">
                    38<em aria-hidden="true">→</em>72
                  </span>
                </div>
                <div className="case-tile__chart" aria-hidden="true">
                  <ResponsiveContainer width="100%" height={132}>
                    <AreaChart data={MIRO_SESSIONS} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="miroFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#141414" stopOpacity={0.14} />
                          <stop offset="100%" stopColor="#141414" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: "#8a8a85" }}
                        interval={0}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#141414", strokeOpacity: 0.25 }} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#141414"
                        strokeWidth={2}
                        fill="url(#miroFill)"
                        dot={false}
                        activeDot={{ r: 3, fill: "#141414" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </article>

          {/* Case 2: Competera Technology */}
          <article className="case-card">
            <div className="case-card__head">
              <div className="case-card__who">
                <span className="case-tag">Development &amp; Audits</span>
                <div className="case-client">
                  <strong>COMPETERA</strong>
                  <span className="case-subtext">(Pricing Intelligence)</span>
                </div>
              </div>

              <p className="case-card__desc">
                We engineered the core activation portal and performance funnel for Competera,
                a platform where vertical enterprises analyze complex pricing data.
                Our team delivered a responsive, sub-second dashboard with streamlined onboarding.
              </p>

              <a
                href="https://competera.net"
                target="_blank"
                rel="noreferrer"
                className="case-card__link"
              >
                See live <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="case-card__grid">
              {/* Stat cards */}
              <div className="case-tile case-tile--stats">
                <span className="case-tile__label">Activation portal</span>
                <div className="case-stats">
                  <div className="case-stat">
                    <small>Live users</small>
                    <strong>4,892</strong>
                    <span>+18.4%</span>
                  </div>
                  <div className="case-stat">
                    <small>Average speed</small>
                    <strong>0.42s</strong>
                    <span>Lighthouse 99</span>
                  </div>
                  <div className="case-stat">
                    <small>Conversion</small>
                    <strong>+34.2%</strong>
                    <span>Q3 growth</span>
                  </div>
                </div>
                <div className="case-chips">
                  <span className="case-chip">Telemetry data</span>
                  <span className="case-chip">100% edge rendered</span>
                </div>
              </div>

              {/* Funnel chart */}
              <div className="case-tile case-tile--chart">
                <div className="case-tile__chart-head">
                  <span className="case-tile__label">Activation funnel</span>
                  <span className="case-tile__metric">
                    8,200<em aria-hidden="true">→</em>690
                  </span>
                </div>
                <div className="case-tile__chart" aria-hidden="true">
                  <ResponsiveContainer width="100%" height={132}>
                    <BarChart data={COMPETERA_FUNNEL} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: "#8a8a85" }}
                        interval={0}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(20,20,20,0.04)" }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} >
                        {COMPETERA_FUNNEL.map((entry, index) => (
                          <Cell
                            key={entry.label}
                            fill="#141414"
                            fillOpacity={index === 0 ? 1 : 0.16}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Brand tile */}
              <div className="case-tile case-tile--brand">
                <span className="competera-mark" aria-hidden="true" />
                <span className="brand-logo-text">competera</span>
                <span className="case-tile__caption">Pricing intelligence</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
