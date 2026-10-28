import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@vraunix/shared";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Vraunix Studio collects, handles, stores, and protects information submitted through our website and client discovery channels.",
};

export default function PrivacyPage() {
  return (
    <div className="studio-legal">
      {/* Legal Header */}
      <header className="studio-legal__header">
        <div className="container">
          <div className="studio-legal__kicker">
            <span className="tag-slash">/</span>
            <span>TRANSPARENCY &amp; DATA GOVERNANCE</span>
            <span className="tag-slash">/</span>
          </div>

          <h1 className="studio-legal__title">
            Privacy Policy<span className="studio-legal__asterisk">✱</span>
          </h1>

          <p className="studio-legal__subtitle">
            We build high-performance websites with precision, and we treat your personal
            data with the same high standard of deliberate care and restraint.
          </p>

          <div className="studio-legal__meta-bar">
            <div className="studio-legal__meta-tags">
              <span className="studio-legal__meta-pill">Last Updated: October 26, 2026</span>
              <span className="studio-legal__meta-pill">Version: 2.1</span>
              <span className="studio-legal__meta-pill">Global Standard</span>
            </div>

            {/* Quick Switcher Tabs */}
            <nav className="studio-legal__tabs" aria-label="Legal documents">
              <Link href="/privacy" className="studio-legal__tab is-active">
                Privacy Policy
              </Link>
              <Link href="/terms" className="studio-legal__tab">
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
                <a href="#collection" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">01</span>
                  <span>Information We Collect</span>
                </a>
                <a href="#usage" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">02</span>
                  <span>How We Use Information</span>
                </a>
                <a href="#sharing" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">03</span>
                  <span>Third Parties &amp; Sharing</span>
                </a>
                <a href="#retention" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">04</span>
                  <span>Storage &amp; Retention</span>
                </a>
                <a href="#security" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">05</span>
                  <span>Security Standards</span>
                </a>
                <a href="#rights" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">06</span>
                  <span>Your Privacy Rights</span>
                </a>
                <a href="#contact" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">07</span>
                  <span>Contact Our Studio</span>
                </a>
              </nav>

              <div className="studio-legal__sidebar-card">
                <span className="studio-legal__sidebar-tag">Need Assistance?</span>
                <p>Have specific privacy requirements or data transfer questions?</p>
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
              <h2 className="studio-legal__summary-title">Key principles of our privacy commitment</h2>
              <ul className="studio-legal__summary-list">
                <li>
                  <strong>No Data Sales:</strong> We do not sell, rent, or trade your personal or project
                  information to advertisers or data brokers under any circumstance.
                </li>
                <li>
                  <strong>Purpose-Driven:</strong> Data gathered through our contact form or discovery sessions
                  is used solely to evaluate, scope, design, and engineer your website project.
                </li>
                <li>
                  <strong>No Invasive Tracking:</strong> We do not use third-party behavioral ad trackers or
                  intrusive cross-site tracking scripts.
                </li>
                <li>
                  <strong>Direct Ownership:</strong> You retain full rights over your proprietary assets, copy,
                  and business intelligence shared with Vraunix Studio.
                </li>
              </ul>
            </div>

            {/* Section 01 */}
            <section id="collection" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">01</span>
                <h2>Information We Collect</h2>
              </div>
              <p>
                We only collect information that is genuinely necessary to initiate communication, provide
                accurate design and engineering estimates, or deliver website development services.
              </p>
              <div className="studio-legal__subblock">
                <h3>Information You Directly Provide</h3>
                <ul>
                  <li>
                    <strong>Contact Details:</strong> Your name, company name, work email address, telephone
                    number, and regional timezone.
                  </li>
                  <li>
                    <strong>Project Discovery Information:</strong> Project objectives, timeline targets,
                    budget parameters, current website URLs, design preferences, and functional specifications.
                  </li>
                  <li>
                    <strong>Communication Records:</strong> Email correspondence, discovery meeting notes,
                    and onboarding questionnaire answers.
                  </li>
                </ul>
              </div>
              <div className="studio-legal__subblock">
                <h3>Technical &amp; Automated Information</h3>
                <p>
                  When you visit our public website, our secure edge servers automatically capture minimal
                  technical telemetry necessary for site reliability, performance monitoring, and defense against
                  denial-of-service abuse. This includes your IP address (which is anonymized and hashed),
                  browser type, referring URL, operating system, and timestamp of requests.
                </p>
              </div>
            </section>

            {/* Section 02 */}
            <section id="usage" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">02</span>
                <h2>How We Use Information</h2>
              </div>
              <p>
                We process your information in accordance with legitimate business purposes and contract
                fulfillment:
              </p>
              <ul className="studio-legal__bullet-list">
                <li>Evaluating prospective engagements and scheduling discovery calls.</li>
                <li>Drafting formal project proposals, scopes of work, and digital architecture plans.</li>
                <li>Fulfilling engineering agreements, code deliveries, and staging previews.</li>
                <li>Processing project invoices, retainer billings, and accounting documentation.</li>
                <li>Securing the website and private staff workspace against unauthorized intrusion.</li>
              </ul>
              <div className="studio-legal__callout">
                <p>
                  <strong>No Unsolicited Marketing:</strong> Submitting an enquiry or project briefing does
                  not opt you into automated marketing newsletters. You will only receive direct, personalized
                  communication regarding your project.
                </p>
              </div>
            </section>

            {/* Section 03 */}
            <section id="sharing" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">03</span>
                <h2>Third Parties &amp; Service Providers</h2>
              </div>
              <p>
                We partner only with reputable infrastructure and software providers who maintain rigorous
                compliance standards (such as SOC2, ISO 27001, and GDPR compliance):
              </p>
              <ul>
                <li>
                  <strong>Hosting &amp; Edge Infrastructure:</strong> Cloud hosting providers used to deploy and
                  serve our website and staging environments with global CDN caching.
                </li>
                <li>
                  <strong>Transactional Email Delivery:</strong> Secure mail gateways to deliver client
                  communications, proposals, and automated alerts.
                </li>
                <li>
                  <strong>Banking &amp; Payment Processing:</strong> Certified payment processors for invoice
                  settlements. We never store credit card or raw banking credentials on our servers.
                </li>
              </ul>
              <p>
                We do not allow any third-party service provider to use your personal information for their own
                independent marketing or profiling.
              </p>
            </section>

            {/* Section 04 */}
            <section id="retention" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">04</span>
                <h2>Storage &amp; Data Retention</h2>
              </div>
              <p>
                We retain client and enquiry data only for the period necessary to fulfill the intended business
                relationship:
              </p>
              <ul>
                <li>
                  <strong>Unqualified Enquiries:</strong> If an enquiry does not result in an active engagement,
                  correspondence is archived or deleted within twelve (12) months.
                </li>
                <li>
                  <strong>Active Clients:</strong> Project documentation, architectural diagrams, and code
                  deliverable records are retained for the duration of the support lifecycle.
                </li>
                <li>
                  <strong>Accounting &amp; Tax Records:</strong> Invoices and contractual agreements are
                  retained for statutory periods required by fiscal legislation (typically 5 to 7 years).
                </li>
              </ul>
            </section>

            {/* Section 05 */}
            <section id="security" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">05</span>
                <h2>Security Standards</h2>
              </div>
              <p>
                Security is integral to how Vraunix Studio designs systems. We enforce modern safeguards across
                all data paths:
              </p>
              <ul>
                <li>
                  <strong>Encryption in Transit:</strong> All web traffic is strictly served over HTTPS with TLS
                  1.3 encryption and HSTS preloading.
                </li>
                <li>
                  <strong>Access Control:</strong> Internal staff workspaces require multi-factor authentication,
                  strict session management, and role-based permissions.
                </li>
                <li>
                  <strong>Sanitization &amp; Validation:</strong> Input forms are protected with rigorous CSRF
                  tokens, rate limiting, and parameter validation.
                </li>
              </ul>
            </section>

            {/* Section 06 */}
            <section id="rights" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">06</span>
                <h2>Your Privacy Rights</h2>
              </div>
              <p>
                Regardless of where your business is located, we honor standard global data rights:
              </p>
              <div className="studio-legal__rights-grid">
                <div className="studio-legal__rights-card">
                  <h4>Right to Access</h4>
                  <p>Request an exported copy of all personal data we retain regarding your profile.</p>
                </div>
                <div className="studio-legal__rights-card">
                  <h4>Right to Rectification</h4>
                  <p>Ask us to correct or amend any outdated or incomplete business information.</p>
                </div>
                <div className="studio-legal__rights-card">
                  <h4>Right to Erasure</h4>
                  <p>Request the complete deletion of your records when no statutory hold applies.</p>
                </div>
                <div className="studio-legal__rights-card">
                  <h4>Right to Restrict</h4>
                  <p>Request that we pause or limit processing while resolving a specific inquiry.</p>
                </div>
              </div>
            </section>

            {/* Section 07 */}
            <section id="contact" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">07</span>
                <h2>Contact Our Studio</h2>
              </div>
              <p>
                For questions regarding this privacy policy, data access requests, or security disclosures, please
                reach out directly to our operations team:
              </p>
              <div className="studio-legal__contact-panel">
                <div className="studio-legal__contact-info">
                  <h3>{COMPANY.name}</h3>
                  <p>Data Protection &amp; Legal Inquiries</p>
                  <a href={`mailto:${COMPANY.email}`} className="studio-legal__email-btn">
                    {COMPANY.email}
                  </a>
                </div>
                <div className="studio-legal__contact-meta">
                  <p><strong>Response Time:</strong> Within 1&ndash;2 business days</p>
                  <p><strong>Studio Location:</strong> {COMPANY.location}</p>
                </div>
              </div>
            </section>
          </article>
        </div>
      </section>
    </div>
  );
}
