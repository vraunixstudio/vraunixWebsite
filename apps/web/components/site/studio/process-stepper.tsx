"use client";

interface StepData {
  stepNum: string;
  phase: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

const STEPS: StepData[] = [
  {
    stepNum: "01",
    phase: "PHASE 01 • ARCHITECTURE",
    badge: "✦",
    title: "Architect & Build",
    tagline: "From zero to production launch.",
    description:
      "We design and engineer bespoke web platforms and SaaS MVPs from the ground up, prioritizing lightning-fast rendering and tactile UI/UX.",
    deliverables: ["Tailored Architecture", "Next.js & React Build", "Production Launch"],
  },
  {
    stepNum: "02",
    phase: "PHASE 02 • OPTIMIZATION",
    badge: "→",
    title: "Optimize & Convert",
    tagline: "Speed is a core product feature.",
    description:
      "We eliminate friction in user flows, modernize legacy stacks, and tune Core Web Vitals to 95+ to turn casual visitors into paying customers.",
    deliverables: ["Core Web Vitals 95+", "Checkout Streamlining", "Conversion Design"],
  },
  {
    stepNum: "03",
    phase: "PHASE 03 • SCALE",
    badge: "✱",
    title: "Dedicated Engineering",
    tagline: "Senior hands, zero onboarding lag.",
    description:
      "A flexible monthly partnership that embeds full-stack engineering and design velocity directly into your roadmap with continuous care.",
    deliverables: ["Full-Stack Velocity", "Roadmap Execution", "Continuous Uptime Care"],
  },
];

export function ProcessStepper() {
  return (
    <section id="process" className="process-section">
      <div className="container">
        {/* Section Header matching Services & Kinetic sections */}
        <div className="process-section__header">
          <div className="process-section__kicker">
            <span className="tag-slash">/</span>
            <span>HOW IT WORKS</span>
            <span className="tag-slash">/</span>
          </div>

          <h2 className="process-section__title">
            Crafting Growth
            <br />
            Through Web with vraunix
          </h2>

          <p className="process-section__desc">
            Elevate your digital journey with vraunix: Architecture, Craft, Scale.
            Tailored web solutions, from idea to execution, for businesses seeking intuitive
            experiences and dependable growth.
          </p>
        </div>

        {/* 3 Minimal Rectangular Rounded Cards */}
        <div className="process-cards process-cards--minimal">
          {STEPS.map((step) => (
            <article key={step.stepNum} className="process-card process-card--minimal">
              <div className="process-card__header">
                <div className="process-card__meta">
                  <span className="process-card__num">/{step.stepNum}/</span>
                  <span className="process-card__phase">{step.phase}</span>
                </div>
                <span className="process-card__badge" aria-hidden="true">
                  {step.badge}
                </span>
              </div>

              <div className="process-card__body">
                <h3 className="process-card__title">{step.title}</h3>
                <p className="process-card__tagline">{step.tagline}</p>
                <p className="process-card__lead">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
