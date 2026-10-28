import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@vraunix/shared";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms governing the use of the Vraunix Studio website, service inquiries, proposals, and standard digital engineering provisions.",
};

export default function TermsPage() {
  return (
    <div className="studio-legal">
      {/* Legal Header */}
      <header className="studio-legal__header">
        <div className="container">
          <div className="studio-legal__kicker">
            <span className="tag-slash">/</span>
            <span>LEGAL AGREEMENTS &amp; PROVISIONS</span>
            <span className="tag-slash">/</span>
          </div>

          <h1 className="studio-legal__title">
            Terms &amp; Conditions<span className="studio-legal__asterisk">✱</span>
          </h1>

          <p className="studio-legal__subtitle">
            These terms establish the ground rules for accessing our website, submitting project enquiries,
            and outlining our standard engineering delivery framework.
          </p>

          <div className="studio-legal__meta-bar">
            <div className="studio-legal__meta-tags">
              <span className="studio-legal__meta-pill">Last Updated: October 26, 2026</span>
              <span className="studio-legal__meta-pill">Version: 2.1</span>
              <span className="studio-legal__meta-pill">Master Terms</span>
            </div>

            {/* Quick Switcher Tabs */}
            <nav className="studio-legal__tabs" aria-label="Legal documents">
              <Link href="/privacy" className="studio-legal__tab">
                Privacy Policy
              </Link>
              <Link href="/terms" className="studio-legal__tab is-active">
                Terms &amp; Conditions
              </Link>
              <Link href="/cookies" className="studio-legal__tab">
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Legal Body */}
      <section className="studio-legal__body">
        <div className="container studio-legal__grid">
          {/* Sticky Sidebar Navigation */}
          <aside className="studio-legal__sidebar">
            <div className="studio-legal__sidebar-inner">
              <p className="studio-legal__sidebar-title">Contents</p>
              <nav className="studio-legal__toc" aria-label="Table of contents">
                <a href="#summary" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">00</span>
                  <span>At a Glance</span>
                </a>
                <a href="#acceptance" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">01</span>
                  <span>Website Use &amp; Conduct</span>
                </a>
                <a href="#ip" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">02</span>
                  <span>Intellectual Property</span>
                </a>
                <a href="#proposals" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">03</span>
                  <span>Enquiries &amp; Proposals</span>
                </a>
                <a href="#client-projects" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">04</span>
                  <span>Client Agreements &amp; Scope</span>
                </a>
                <a href="#payments" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">05</span>
                  <span>Milestones &amp; Payments</span>
                </a>
                <a href="#liability" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">06</span>
                  <span>Warranties &amp; Liability</span>
                </a>
                <a href="#contact" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">07</span>
                  <span>Contact &amp; Notices</span>
                </a>
              </nav>

              <div className="studio-legal__sidebar-card">
                <span className="studio-legal__sidebar-tag">Commercial Questions?</span>
                <p>Need custom contract terms or non-disclosure agreements prior to project briefing?</p>
                <a href={`mailto:${COMPANY.email}`} className="studio-legal__contact-link">
                  {COMPANY.email} &rarr;
                </a>
              </div>
            </div>
          </aside>

          {/* Legal Article Content */}
          <article className="studio-legal__content">
            {/* Quick Summary Box */}
            <div id="summary" className="studio-legal__summary-card">
              <div className="studio-legal__summary-badge">Summary at a glance</div>
              <h2 className="studio-legal__summary-title">Key takeaways for our clients &amp; visitors</h2>
              <ul className="studio-legal__summary-list">
                <li>
                  <strong>Public Site Terms:</strong> Browsing this website constitutes acceptance of these
                  general terms of use and respectful interaction.
                </li>
                <li>
                  <strong>Separate Project Contracts:</strong> Submitting an enquiry does not create a binding
                  client retainer. Active client work is governed by a bespoke Scope of Work (SOW) agreement.
                </li>
                <li>
                  <strong>Work Ownership:</strong> Upon final milestone payment, custom design assets and custom
                  code created for your website belong completely to you.
                </li>
                <li>
                  <strong>No Hidden Terms:</strong> We operate with upfront milestone pricing, transparent deliverables,
                  and zero ambiguous obligations.
                </li>
              </ul>
            </div>

            {/* Section 01 */}
            <section id="acceptance" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">01</span>
                <h2>Website Use &amp; Conduct</h2>
              </div>
              <p>
                By visiting, viewing, or interacting with the Vraunix Studio website, you agree to comply with
                applicable international laws and these terms.
              </p>
              <div className="studio-legal__subblock">
                <h3>Permitted Use</h3>
                <p>
                  You are permitted to browse public pages, review our portfolio, download publicly available
                  case studies, and submit legitimate project enquiries or discovery briefs.
                </p>
              </div>
              <div className="studio-legal__subblock">
                <h3>Prohibited Activities</h3>
                <ul className="studio-legal__bullet-list">
                  <li>Interfering with, disrupting, or reverse-engineering our web infrastructure.</li>
                  <li>Automated scraping, content harvesting, or crawling without explicit written consent.</li>
                  <li>Submitting false, abusive, defamatory, or fraudulent project enquiries.</li>
                  <li>Attempting to bypass authentication mechanisms or access private staff workspaces.</li>
                </ul>
              </div>
            </section>

            {/* Section 02 */}
            <section id="ip" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">02</span>
                <h2>Intellectual Property</h2>
              </div>
              <p>
                All materials showcased on this website—including visual branding, typography layouts,
                case study narratives, code snippets, illustrations, animations, and proprietary studio tools—are
                the exclusive property of {COMPANY.name} or our licensors.
              </p>
              <div className="studio-legal__callout">
                <p>
                  <strong>Client Trademarks:</strong> Client logos, registered trademarks, and live website links
                  featured in our portfolio remain the intellectual property of their respective owners and are
                  displayed solely to demonstrate completed work.
                </p>
              </div>
            </section>

            {/* Section 03 */}
            <section id="proposals" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">03</span>
                <h2>Enquiries &amp; Proposals</h2>
              </div>
              <p>
                Submitting a project enquiry or discovery form initiates an exploratory conversation. It does not
                guarantee project acceptance or establish an immediate agency-client relationship:
              </p>
              <ul>
                <li>
                  <strong>Studio Fit:</strong> We review incoming briefs to ensure our engineering standards,
                  capacity, and timeline align with your business goals.
                </li>
                <li>
                  <strong>Proposal Validity:</strong> Written proposals and milestone quotes provided by
                  Vraunix Studio are valid for thirty (30) days from issuance unless otherwise specified.
                </li>
                <li>
                  <strong>Mutual Confidentiality:</strong> All project data, business ideas, and specifications
                  shared during discovery are held in strict confidence.
                </li>
              </ul>
            </section>

            {/* Section 04 */}
            <section id="client-projects" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">04</span>
                <h2>Client Agreements &amp; Scope</h2>
              </div>
              <p>
                Every commissioned website development project is formalized with an explicit written agreement
                (Statement of Work or Master Services Agreement) detailing:
              </p>
              <div className="studio-legal__grid-boxes">
                <div className="studio-legal__box">
                  <h4>Scope of Work</h4>
                  <p>Exact deliverable pages, custom components, integrations, and performance benchmarks.</p>
                </div>
                <div className="studio-legal__box">
                  <h4>Revision Rounds</h4>
                  <p>Design iteration rounds and feedback windows structured into each sprint milestone.</p>
                </div>
                <div className="studio-legal__box">
                  <h4>Delivery Timelines</h4>
                  <p>Scheduled phases from UX architecture to staging QA and live production deployment.</p>
                </div>
                <div className="studio-legal__box">
                  <h4>Post-Launch Care</h4>
                  <p>30-day warranty on code integrity plus optional ongoing studio retainer support.</p>
                </div>
              </div>
              <p>
                In the event of any conflict between these general website terms and a signed client agreement,
                the signed client agreement takes precedence.
              </p>
            </section>

            {/* Section 05 */}
            <section id="payments" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">05</span>
                <h2>Milestones &amp; Payment Schedules</h2>
              </div>
              <p>
                Unless alternative billing terms are explicitly contracted:
              </p>
              <ul>
                <li>
                  <strong>Deposit / Kickoff:</strong> A deposit (typically 50% or first milestone tranche) is
                  required prior to reserving studio engineering calendar capacity.
                </li>
                <li>
                  <strong>Intermediate Milestones:</strong> Subsequent milestones are billed upon approved
                  deliverables (e.g. Design Signoff, Staging Preview).
                </li>
                <li>
                  <strong>Final Settlement:</strong> Final milestone payment is required prior to DNS transfer,
                  code repository ownership transfer, or production live deployment.
                </li>
              </ul>
            </section>

            {/* Section 06 */}
            <section id="liability" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">06</span>
                <h2>Warranties &amp; Limitation of Liability</h2>
              </div>
              <p>
                This website and its preview content are provided on an &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; basis without warranties of uninterrupted uptime or error-free accessibility.
              </p>
              <p>
                To the maximum extent permitted by applicable law, Vraunix Studio and its partners shall not be
                liable for any indirect, punitive, incidental, or consequential damages resulting from website
                downtime, loss of revenue, or reliance on information presented on public preview pages.
              </p>
              <p>
                Our liability for active contracted client engagements is strictly delimited by the liability cap
                stipulated in the applicable signed project agreement.
              </p>
            </section>

            {/* Section 07 */}
            <section id="contact" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">07</span>
                <h2>Contact &amp; Legal Notices</h2>
              </div>
              <p>
                All legal notices, questions regarding these terms, or commercial contract inquiries must be
                directed to our studio management:
              </p>
              <div className="studio-legal__contact-panel">
                <div className="studio-legal__contact-info">
                  <h3>{COMPANY.name}</h3>
                  <p>Legal &amp; Commercial Contracts</p>
                  <a href={`mailto:${COMPANY.email}`} className="studio-legal__email-btn">
                    {COMPANY.email}
                  </a>
                </div>
                <div className="studio-legal__contact-meta">
                  <p><strong>Primary Contact:</strong> {COMPANY.email}</p>
                  <p><strong>Business Inquiries:</strong> New proposals &amp; scopes</p>
                </div>
              </div>
            </section>
          </article>
        </div>
      </section>
    </div>
  );
}
