export const COMPANY = {
  name: "Vraunix Studio",
  slogan: "Building Your Digital Future.",
  description:
    "Vraunix Studio provides professional website development and digital solutions to help businesses build a strong online presence. We create modern, responsive, user-friendly, and scalable digital experiences that support business growth.",
  email: "vraunixstudio@gmail.com",
  phone: "+1 (555) 019-2834",
  location: "Remote / Worldwide",
  website: "https://vraunix.studio",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Process", href: "/process" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
] as const;

export type ServiceContent = {
  slug: string;
  title: string;
  icon: string;
  tagline: string;
  summary: string;
  description: string[];
  benefits: string[];
  deliverables: string[];
  approach: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  startingFromMinor?: number;
};

export const SERVICES: ServiceContent[] = [
  {
    slug: "website-development",
    title: "Website Development",
    icon: "Code2",
    tagline: "Modern, responsive websites built around your business.",
    summary:
      "Professional websites that present your business clearly, load quickly, and work beautifully on every screen.",
    description: [
      "We design and build websites that give your business a credible, useful home online. Every engagement starts with understanding your audience, your offer, and the action you want visitors to take.",
      "The build focuses on clear structure, maintainable code, accessible components, and a content model your team can live with after launch. We do not promise rankings or guarantees we cannot control; we do promise deliberate, tested work.",
    ],
    benefits: [
      "A clear, credible presence for your business",
      "Responsive layouts that work on phones, tablets, and desktops",
      "Fast, accessible pages with sensible SEO foundations",
      "A maintainable codebase your future team can understand",
    ],
    deliverables: [
      "Discovery notes and sitemap",
      "Responsive page designs",
      "Production website build",
      "Basic on-page SEO setup",
      "Launch and handover documentation",
    ],
    approach: [
      {
        title: "Understand",
        description:
          "We map your goals, audience, and required content before design begins.",
      },
      {
        title: "Design",
        description:
          "We turn the structure into clear, responsive page designs for review.",
      },
      {
        title: "Build and test",
        description:
          "We implement, connect, test, and prepare the site for launch.",
      },
    ],
    faqs: [
      {
        question: "Do you build on a specific platform?",
        answer:
          "We recommend a stack based on your requirements. Modern frameworks and content management options are considered during discovery rather than assumed upfront.",
      },
      {
        question: "Can you work with an existing brand?",
        answer:
          "Yes. We can apply established brand guidelines, or help refine the digital expression of your brand if that is in scope.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    icon: "PenTool",
    tagline: "Interfaces that feel clear, intentional, and easy to use.",
    summary:
      "User experience and interface design that reduces friction and helps visitors find what they need.",
    description: [
      "Good design is more than decoration. We structure content, define flows, and design interfaces around the tasks your visitors actually need to complete.",
      "Our design work covers responsive layouts, component systems, interaction states, and accessibility considerations so the build phase is grounded in a practical visual language.",
    ],
    benefits: [
      "A clearer path from visitor to enquiry",
      "Consistent components and visual rules",
      "Accessible color, type, and interaction choices",
      "Fewer revision cycles during development",
    ],
    deliverables: [
      "User and content structure",
      "Wireframes for key pages",
      "Responsive high-fidelity designs",
      "Reusable component and style guidance",
      "Interactive prototypes where useful",
    ],
    approach: [
      {
        title: "Frame the problem",
        description:
          "We clarify the audience, tasks, and constraints before drawing screens.",
      },
      {
        title: "Structure the experience",
        description:
          "Content hierarchy and flows come before surface-level styling.",
      },
      {
        title: "Refine the interface",
        description:
          "We design, review, and document the visual system for implementation.",
      },
    ],
    faqs: [
      {
        question: "Can design be included with development?",
        answer:
          "Yes. Design and development can be scoped together so the visual system and the implementation stay aligned.",
      },
      {
        question: "Do we need a full design system?",
        answer:
          "Not always. We scale the design documentation to the size of your site and the team maintaining it.",
      },
    ],
  },
  {
    slug: "custom-solutions",
    title: "Custom Website Solutions",
    icon: "Blocks",
    tagline: "Purpose-built features for how your business actually works.",
    summary:
      "Tailored web applications, integrations, and workflows that go beyond a standard brochure site.",
    description: [
      "Some requirements do not fit a template. We design and build custom features such as portals, booking flows, structured content tools, and internal dashboards.",
      "We keep custom work focused on business outcomes, with clear scope, sensible data models, and security considered from the beginning rather than added at the end.",
    ],
    benefits: [
      "Software shaped around your workflow",
      "A scoped, documented data model",
      "Maintainable modules instead of fragile one-off code",
      "Room to extend the system as needs change",
    ],
    deliverables: [
      "Requirements and technical scope",
      "Data model and workflow design",
      "Custom frontend and backend implementation",
      "Validation, permissions, and error handling",
      "Documentation and handover",
    ],
    approach: [
      {
        title: "Define",
        description:
          "We translate the business workflow into explicit requirements and boundaries.",
      },
      {
        title: "Prototype",
        description:
          "Critical flows are validated early before the full build expands.",
      },
      {
        title: "Deliver",
        description:
          "We implement, test, document, and support the rollout.",
      },
    ],
    faqs: [
      {
        question: "Is a custom solution always necessary?",
        answer:
          "No. We recommend a standard approach when it genuinely serves your needs. Custom work should have a clear reason.",
      },
      {
        question: "How is scope controlled?",
        answer:
          "Through a written Scope of Work, structured change requests, and milestones agreed before development starts.",
      },
    ],
  },
  {
    slug: "website-redesign",
    title: "Website Redesign",
    icon: "RefreshCw",
    tagline: "A stronger digital presence without losing what already works.",
    summary:
      "Thoughtful redesigns that improve clarity, usability, and performance while preserving useful content and equity.",
    description: [
      "A redesign is an opportunity to fix structural problems, not just change colors. We audit the current site, identify what serves visitors, and plan a transition that protects useful content.",
      "The result is a more coherent experience with a cleaner implementation, improved responsive behavior, and a maintainable path forward.",
    ],
    benefits: [
      "Clearer messaging and navigation",
      "Improved mobile and desktop usability",
      "Reduced technical clutter",
      "A documented migration of important content",
    ],
    deliverables: [
      "Current-site audit",
      "Content and navigation plan",
      "New responsive design",
      "Rebuild or targeted improvements",
      "Redirect and launch plan",
    ],
    approach: [
      {
        title: "Audit",
        description:
          "We review content, analytics where available, technical structure, and user friction.",
      },
      {
        title: "Rebuild",
        description:
          "Design and development proceed with a clear migration plan for content.",
      },
      {
        title: "Transition",
        description:
          "We test redirects, review accessibility, and launch with a rollback plan.",
      },
    ],
    faqs: [
      {
        question: "Will the redesign hurt our search visibility?",
        answer:
          "A careful migration plan limits avoidable risk, but no honest provider can guarantee rankings. We document redirects and preserve valuable content structure.",
      },
      {
        question: "Can we redesign only part of the site?",
        answer:
          "Yes. Targeted improvements are often the right choice when the underlying site is sound.",
      },
    ],
  },
  {
    slug: "performance-seo",
    title: "Performance and Basic SEO",
    icon: "Gauge",
    tagline: "A faster, cleaner foundation for being found and understood.",
    summary:
      "Technical performance and on-page SEO improvements focused on measurable fundamentals, not guarantees.",
    description: [
      "We review page speed, asset delivery, semantic structure, metadata, and crawlability, then implement practical improvements appropriate to your site.",
      "Our work covers technical fundamentals and basic on-page optimization. Competitive ranking outcomes depend on many factors outside any developer's control, so we report work honestly rather than sell guarantees.",
    ],
    benefits: [
      "Faster loading pages and lighter assets",
      "Cleaner HTML structure and metadata",
      "Better mobile experience",
      "A clear report of what was changed and what to do next",
    ],
    deliverables: [
      "Performance and technical SEO review",
      "Prioritized recommendations",
      "Implemented fixes within agreed scope",
      "Before-and-after measurements where available",
      "Ongoing monitoring guidance",
    ],
    approach: [
      {
        title: "Measure",
        description:
          "We establish a baseline using available tools and real page behavior.",
      },
      {
        title: "Improve",
        description:
          "We address the highest-impact technical issues first.",
      },
      {
        title: "Report",
        description:
          "We document changes, measurements, and remaining recommendations.",
      },
    ],
    faqs: [
      {
        question: "Will this guarantee first-page rankings?",
        answer:
          "No. Search rankings depend on competition, content, authority, and search engine decisions. We focus on technical fundamentals and honest reporting.",
      },
      {
        question: "Do you provide ongoing SEO content?",
        answer:
          "Content strategy and copywriting can be scoped separately if you need them. Our core offer is technical and on-page improvement.",
      },
    ],
  },
  {
    slug: "website-maintenance",
    title: "Website Maintenance and Support",
    icon: "LifeBuoy",
    tagline: "Keep your website secure, current, and dependable.",
    summary:
      "Ongoing updates, checks, fixes, and support arranged around a clear maintenance plan.",
    description: [
      "A website needs attention after launch. We provide structured maintenance for updates, bug fixes, content changes, backups, and routine technical checks.",
      "Support is delivered against an agreed plan and scope. Every maintenance action is recorded, and we only report monitoring, backups, or security work that actually happened or is genuinely connected to a service.",
    ],
    benefits: [
      "A reliable point of contact for website issues",
      "Routine updates and checks on a predictable schedule",
      "Documented work and clear escalation",
      "Flexible monthly, quarterly, or custom arrangements",
    ],
    deliverables: [
      "Maintenance plan and support scope",
      "Scheduled updates and checks",
      "Bug fixes within the agreed allowance",
      "Maintenance activity log",
      "Renewal and payment scheduling",
    ],
    approach: [
      {
        title: "Plan",
        description:
          "We agree the level of support, response expectations, and covered work.",
      },
      {
        title: "Maintain",
        description:
          "Scheduled tasks and support requests are tracked and completed.",
      },
      {
        title: "Review",
        description:
          "We report completed work and recommend the next priorities.",
      },
    ],
    faqs: [
      {
        question: "Does maintenance include new features?",
        answer:
          "New functionality is usually separate project work. Your maintenance plan explains what is covered.",
      },
      {
        question: "Is uptime monitoring included?",
        answer:
          "Only if a real monitoring service is configured and included in your agreement. We do not claim monitoring that does not exist.",
      },
    ],
  },
];

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discovery and Planning",
    summary:
      "We learn how your business works, who the website serves, and what success means for this project.",
    details: [
      "A structured discovery conversation and requirements questionnaire",
      "Goals, audience, content, and technical constraints documented",
      "Sitemap, scope boundaries, and an initial plan agreed",
      "Open questions and dependencies identified early",
    ],
  },
  {
    number: "02",
    title: "Design and Development",
    summary:
      "We turn the agreed structure into a responsive design and a tested implementation.",
    details: [
      "Key pages and reusable components designed for review",
      "Implementation in a maintainable, version-controlled codebase",
      "Content, integrations, and forms connected and checked",
      "Regular review points so feedback lands before late-stage work",
    ],
  },
  {
    number: "03",
    title: "Testing and Launch",
    summary:
      "We verify the important paths, prepare the deployment, and hand over a site you can operate.",
    details: [
      "Responsive and cross-browser checks",
      "Forms, links, metadata, and accessibility review",
      "Deployment and redirect checks where relevant",
      "Handover notes and optional ongoing maintenance",
    ],
  },
] as const;

export const WHY_CHOOSE = [
  {
    title: "Clear scope before work starts",
    description:
      "You see what is included, what is excluded, and what it costs before development begins.",
    icon: "ClipboardCheck",
  },
  {
    title: "Business-first decisions",
    description:
      "We prioritize the outcomes your website needs to support, not decoration for its own sake.",
    icon: "Target",
  },
  {
    title: "Maintainable engineering",
    description:
      "Structured code, accessible components, and documentation that make future work less painful.",
    icon: "Wrench",
  },
  {
    title: "Honest communication",
    description:
      "Realistic timelines, clear risks, and no guarantees about rankings or outcomes we cannot control.",
    icon: "MessageSquare",
  },
  {
    title: "Responsive by default",
    description:
      "Mobile, tablet, and desktop layouts are treated as part of the design, not an afterthought.",
    icon: "Smartphone",
  },
  {
    title: "Support beyond launch",
    description:
      "Optional maintenance plans keep your site current and give you a place to report issues.",
    icon: "LifeBuoy",
  },
] as const;

export const VALUES = [
  {
    title: "Clarity",
    description:
      "Plain language, explicit scope, and documentation that respects your time.",
  },
  {
    title: "Craft",
    description:
      "Careful design and engineering choices, including the details users never consciously notice.",
  },
  {
    title: "Honesty",
    description:
      "We distinguish what we know, what we recommend, and what cannot be guaranteed.",
  },
  {
    title: "Partnership",
    description:
      "We build with you, not around you, so decisions stay connected to your business.",
  },
  {
    title: "Accessibility",
    description:
      "We treat keyboard use, readable contrast, and semantic structure as baseline quality.",
  },
  {
    title: "Longevity",
    description:
      "We favor maintainable systems over short-lived shortcuts that become expensive later.",
  },
] as const;

export const FAQS = [
  {
    category: "Getting started",
    question: "How do we start a project with Vraunix Studio?",
    answer:
      "Complete the discovery questionnaire or contact form. We review your answers, clarify anything unclear, and recommend the next step before any commitment.",
  },
  {
    category: "Getting started",
    question: "Do I need to have everything planned before contacting you?",
    answer:
      "No. The discovery process is designed to help shape an unclear idea. Bringing what you know, your constraints, and your goals is enough to begin.",
  },
  {
    category: "Pricing",
    question: "How is a project priced?",
    answer:
      "Each proposal is based on scope, complexity, timeline, and required content. We itemize what is included and what is excluded so pricing is understandable.",
  },
  {
    category: "Pricing",
    question: "Do you require a deposit?",
    answer:
      "Payment terms are agreed in the project proposal and invoice. A common schedule includes an initial deposit, milestone payments where relevant, and a final payment.",
  },
  {
    category: "Process",
    question: "How long does a website project take?",
    answer:
      "Timelines depend on scope, content readiness, and review speed. We provide a realistic estimated schedule in the proposal and flag dependencies that could affect it.",
  },
  {
    category: "Process",
    question: "How many revisions are included?",
    answer:
      "Revision allowances are stated in the Scope of Work for each project. Work outside that allowance is handled through a documented change request.",
  },
  {
    category: "Support",
    question: "Can you maintain our website after launch?",
    answer:
      "Yes. Maintenance and support plans are available and can include scheduled updates, bug fixes, checks, content changes, and support arrangements.",
  },
  {
    category: "Support",
    question: "Who owns the website and content?",
    answer:
      "Ownership, licensing, and handover terms are set out in the project agreement. We document what is transferred at completion.",
  },
  {
    category: "Technical",
    question: "Do you build e-commerce websites?",
    answer:
      "Yes, when the requirements are a good fit. E-commerce scope is defined carefully, including payment processing, product data, and operational responsibilities.",
  },
  {
    category: "Technical",
    question: "Will my website work on mobile devices?",
    answer:
      "Responsive design is part of our standard approach. Important layouts and interactions are tested across common screen sizes before launch.",
  },
] as const;

export const VALUES_MISSION = {
  mission:
    "To help businesses establish a strong online presence through thoughtful design, dependable engineering, and clear communication.",
  approach:
    "Vraunix Studio works in small, transparent steps: understand the business, define the scope, design the experience, build carefully, test honestly, and support what we deliver.",
  philosophy:
    "A website is a long-lived business asset. We favor clean structure, accessible interaction, and maintainable systems because the work continues after launch.",
} as const;
