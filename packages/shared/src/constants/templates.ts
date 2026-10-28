export const COMPANY_PROPOSAL_TEMPLATE = `# Vraunix Studio — Company Proposal

Vraunix Studio provides professional website development and digital solutions to help businesses build a strong online presence. We create modern, responsive, user-friendly, and scalable digital experiences that support business growth.

## What we do

We work across website development, UI/UX design, custom website solutions, website redesign, performance and basic SEO improvement, and ongoing website maintenance and technical support.

## Our approach

Every engagement begins with understanding the business, its audience, and the outcomes the website must support. We define scope clearly, design for real user needs, implement with maintainable technology, and test before launch. We favor clear communication and realistic commitments over promises that cannot be guaranteed.

## How we work

1. Discovery and Planning — goals, audience, content, constraints, and scope.
2. Design and Development — responsive design, structured implementation, and review points.
3. Testing and Launch — quality checks, deployment preparation, and handover.

## Our commitment

We will describe what is included and excluded, communicate risks early, document decisions, and avoid claiming rankings, outcomes, or monitoring that cannot be verified. Ongoing support is available through maintenance arrangements.

## Next steps

To discuss a specific project, complete our discovery questionnaire or contact us. A separate, client-specific project proposal will define the Scope of Work, timeline, pricing, and terms for your engagement.

**Vraunix Studio — Building Your Digital Future.**`;

export const AGREEMENT_TEMPLATE = `## Agreement terms

This development agreement is issued for the specific project identified in the accepted proposal. It should be reviewed by both parties and may be adapted for the applicable jurisdiction.

### Services

Vraunix Studio will provide the services described in the accepted proposal and Scope of Work. Work outside the agreed scope is handled through a documented change request and may affect cost and timeline.

### Client responsibilities

The client will provide timely access to required content, brand assets, third-party accounts, and decision-makers, and will respond to review requests within agreed timeframes. Delays in client responsibilities may affect the schedule.

### Fees and payment

Fees, currency, taxes, and payment milestones are set out in the accepted proposal and related invoices. Work may be paused if undisputed invoices remain overdue.

### Revisions

Revision allowances are defined in the Scope of Work. Additional revisions are treated as change requests.

### Intellectual property

Ownership and licensing of final deliverables transfer according to the proposal and applicable law, subject to payment of undisputed amounts. Third-party software, fonts, and assets remain subject to their own licenses.

### Launch and handover

Launch occurs after required approvals and payments. Handover includes agreed documentation and access. Ongoing maintenance is separate unless expressly included.

### Limitation and warranty

The service is provided with reasonable professional care. No guarantee is made regarding search rankings, traffic, sales, or outcomes outside Vraunix Studio's control. Liability is limited to the extent permitted by applicable law.

### Acceptance

This agreement is accepted by written confirmation or payment of the initial invoice, as stated in the project proposal. A typed name or button click is recorded as acceptance; it is not represented as a verified electronic signature unless a dedicated signing workflow is used.`;

export const MAINTENANCE_AGREEMENT_TEMPLATE = `## Maintenance service terms

This maintenance agreement describes the recurring services selected by the client. The specific plan, covered services, fees, billing frequency, and dates are recorded in the maintenance record.

### Covered services

Only the services listed in the maintenance record and plan are covered. New features, major redesigns, emergency recovery, and work outside the agreed allowance are quoted separately.

### Scheduled work

Scheduled checks and updates are performed within the agreed service window. Client-requested content changes are handled according to the plan allowance.

### Backups and monitoring

Backups and uptime monitoring are included only where explicitly listed and backed by an active integration or staff-confirmed task. Vraunix Studio does not claim monitoring or backups that are not actually provided.

### Billing

Maintenance fees are billed according to the agreed frequency. Invoices are due by their stated due date. Services may be paused for overdue invoices after reasonable notice.

### Cancellation

Either party may cancel with reasonable written notice. Fees already incurred remain payable.

### Support

Support requests should be submitted through the agreed channel. Response targets are targets, not guarantees, unless a separate service-level agreement exists.`;

export const HANDOVER_TEMPLATE = `## Website handover report

This report documents the deployment and handover of the website built for the client.

### Delivered items

The delivered website, pages, features, and content are summarized from the agreed project scope. Exclusions remain as stated in the accepted proposal and Scope of Work.

### Access and credentials

Access details are transferred through an agreed secure channel. Passwords and private credentials are not included in this report.

### Testing and quality checks

The testing checklist records responsive, functional, and launch checks completed before handover.

### Ongoing responsibilities

The client is responsible for maintaining third-party accounts, renewing domains and hosting, and keeping content accurate after handover. Optional maintenance services are described separately.

### Support

Post-launch support is available under a maintenance plan or as separately agreed work.`;

export const DEFAULT_PROPOSAL_ABOUT_TEMPLATE = `Vraunix Studio is pleased to present this comprehensive project proposal. We partner with forward-thinking businesses to design, engineer, and deploy high-performance web applications and digital experiences that drive tangible business growth.

### Objectives & Strategic Approach
Our development process prioritizes user experience, modern frontend and backend architectures, speed, and rock-solid reliability. Every deliverable is built with clean maintainable code, SEO best practices, and responsive design across all desktop and mobile devices.

### Delivery & Quality Standards
Throughout this engagement, you will receive transparent communication, milestone-based progress reviews, and dedicated post-launch handover support.`;

export interface ProposalTemplatePreset {
  id: string;
  name: string;
  about: string;
  defaultScope: string[];
}

export const PROPOSAL_TEMPLATES: ProposalTemplatePreset[] = [
  {
    id: "standard-web",
    name: "Full-Stack Web Development",
    about: `Vraunix Studio is pleased to present this proposal for the custom design and engineering of your digital platform. We build scalable, high-performance web systems tailored to your specific organizational workflows and audience needs.

### Objectives & Strategic Approach
We leverage modern web technologies (Next.js, TypeScript, secure REST/GraphQL APIs, and cloud infrastructure) to produce a fluid, responsive user experience backed by scalable data architecture.

### Delivery & Quality Standards
Our team adheres to strict development standards including component modularity, SEO optimization, accessibility standards, and end-to-end quality assurance before launch.`,
    defaultScope: [
      "Discovery, System Architecture & Technical Specifications",
      "Custom Responsive UI/UX Design System (Figma)",
      "Frontend Engineering with Next.js & TypeScript",
      "Backend API & Database Architecture",
      "User Authentication, Role Permissions & Security Hardening",
      "Automated Testing, Cross-Browser & Mobile QA",
      "Production Deployment & Domain/SSL Setup",
      "Documentation, Admin Training & 30-Day Launch Warranty",
    ],
  },
  {
    id: "redesign",
    name: "Website Redesign & Brand Strategy",
    about: `This proposal outlines our strategic approach to modernizing your digital brand presence. Vraunix Studio will completely overhaul your visual identity and web architecture to elevate conversion rates, performance, and user retention.

### Strategic Redesign Focus
We identify friction points in your existing digital footprint and reconstruct your customer journey from the ground up, marrying brand aesthetics with measurable business goals.

### Performance & Modernization
Your new platform will achieve superior Lighthouse performance scores, instant page transitions, and structured technical SEO that expands your organic reach.`,
    defaultScope: [
      "Brand Identity & Visual Style Guide Refresh",
      "User Journey Mapping & Information Architecture",
      "High-Fidelity Wireframes & Interactive Prototypes",
      "Responsive Web Redesign (Mobile, Tablet, Desktop)",
      "Core Web Vitals & Page Speed Optimization",
      "Content Migration & Technical SEO Preservation",
      "Analytics & Conversion Tracking Setup",
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce & Digital Storefront",
    about: `Vraunix Studio presents this proposal for an enterprise-ready e-commerce solution. We develop friction-free shopping experiences engineered to maximize cart value, checkout completion, and customer trust.

### E-Commerce Capabilities
Our store builds include secure payment gateway integration, automated inventory synchronization, customer account portals, and optimized multi-device checkouts.

### Growth & Scalability
Built on high-availability cloud infrastructure, your store will seamlessly handle traffic surges during promotions and campaigns without downtime or performance degradation.`,
    defaultScope: [
      "Custom E-Commerce Storefront UI/UX Design",
      "Product Catalog, Variants & Category Architecture",
      "Secure Payment Gateway Integration",
      "Cart & One-Page Frictionless Checkout Flow",
      "Customer Account, Order History & Invoicing Portal",
      "Inventory Management & Automated Email Notifications",
      "Mobile-First Responsive Optimization & Speed Hardening",
    ],
  },
  {
    id: "maintenance-support",
    name: "Ongoing Maintenance & Technical Retainer",
    about: `This agreement proposal outlines Vraunix Studio's ongoing technical maintenance and proactive engineering support. We protect your digital investment through scheduled updates, continuous monitoring, and on-demand development capacity.

### Proactive Care
We keep your codebase up-to-date, secure against vulnerabilities, and optimized for maximum speed and uptime.

### Dedicated Support Window
Your team gains direct access to senior engineers for quick issue resolution, content updates, and routine feature enhancements.`,
    defaultScope: [
      "Weekly Core & Dependency Security Updates",
      "Continuous Automated Uptime & Error Monitoring",
      "Offsite Encrypted Backups & Disaster Recovery",
      "Monthly Performance & SEO Health Audits",
      "Dedicated Monthly Support Hours for Feature Requests",
      "Priority Incident Response SLA",
    ],
  },
];

