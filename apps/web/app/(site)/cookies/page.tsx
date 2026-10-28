import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@vraunix/shared";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Vraunix Studio uses essential and functional cookies, our zero-advertising stance, and how you can manage browser preferences.",
};

export default function CookiesPage() {
  return (
    <div className="studio-legal">
      {/* Legal Header */}
      <header className="studio-legal__header">
        <div className="container">
          <div className="studio-legal__kicker">
            <span className="tag-slash">/</span>
            <span>TRANSPARENCY &amp; TRACKING</span>
            <span className="tag-slash">/</span>
          </div>

          <h1 className="studio-legal__title">
            Cookie Policy<span className="studio-legal__asterisk">✱</span>
          </h1>

          <p className="studio-legal__subtitle">
            A transparent and honest breakdown of the technical cookies we use to ensure site security,
            preserve preferences, and maintain our private staff workspace.
          </p>

          <div className="studio-legal__meta-bar">
            <div className="studio-legal__meta-tags">
              <span className="studio-legal__meta-pill">Last Updated: October 26, 2026</span>
              <span className="studio-legal__meta-pill">Version: 2.1</span>
              <span className="studio-legal__meta-pill">Zero Ad-Trackers</span>
            </div>

            {/* Quick Switcher Tabs */}
            <nav className="studio-legal__tabs" aria-label="Legal documents">
              <Link href="/privacy" className="studio-legal__tab">
                Privacy Policy
              </Link>
              <Link href="/terms" className="studio-legal__tab">
                Terms &amp; Conditions
              </Link>
              <Link href="/cookies" className="studio-legal__tab is-active">
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
                <a href="#definition" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">01</span>
                  <span>What Are Cookies</span>
                </a>
                <a href="#usage" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">02</span>
                  <span>How We Use Cookies</span>
                </a>
                <a href="#inventory" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">03</span>
                  <span>Cookie Inventory</span>
                </a>
                <a href="#third-parties" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">04</span>
                  <span>Third-Party Trackers</span>
                </a>
                <a href="#management" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">05</span>
                  <span>Managing Preferences</span>
                </a>
                <a href="#contact" className="studio-legal__toc-link">
                  <span className="studio-legal__toc-num">06</span>
                  <span>Questions &amp; Contact</span>
                </a>
              </nav>

              <div className="studio-legal__sidebar-card">
                <span className="studio-legal__sidebar-tag">Privacy Respect</span>
                <p>We do not participate in cross-site tracking or commercial data sharing.</p>
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
              <h2 className="studio-legal__summary-title">Minimal cookies, zero advertising surveillance</h2>
              <ul className="studio-legal__summary-list">
                <li>
                  <strong>Essential Only for Public Users:</strong> For public visitors, we only utilize strictly
                  necessary session security and functional preference cookies (such as dark/light theme).
                </li>
                <li>
                  <strong>Zero Third-Party Advertising:</strong> We do not load Google AdSense, Meta Pixel,
                  TikTok Pixel, or any commercial retargeting cookies.
                </li>
                <li>
                  <strong>Staff Authentication:</strong> Encrypted authentication tokens are stored in secure
                  HTTP-only cookies solely for authorized team members signing into the studio workspace.
                </li>
                <li>
                  <strong>Full Browser Control:</strong> You can block or clear cookies at any time via your
                  browser settings without losing access to our public portfolio.
                </li>
              </ul>
            </div>

            {/* Section 01 */}
            <section id="definition" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">01</span>
                <h2>What Are Cookies</h2>
              </div>
              <p>
                Cookies are small text files placed on your device by websites you visit. They are widely
                implemented across the modern web to enable essential functionality, maintain secure sessions,
                prevent CSRF attacks, and remember user preferences.
              </p>
              <p>
                In addition to cookies, modern web browsers offer related client-side storage technologies such
                as <code>localStorage</code> and <code>sessionStorage</code>. We treat all client storage
                technologies with the same high level of privacy discipline.
              </p>
            </section>

            {/* Section 02 */}
            <section id="usage" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">02</span>
                <h2>How We Use Cookies</h2>
              </div>
              <p>We group our storage mechanisms into three straightforward categories:</p>
              <div className="studio-legal__grid-boxes">
                <div className="studio-legal__box">
                  <h4>1. Strictly Essential</h4>
                  <p>
                    Required for fundamental site security, routing, CSRF token validation, and edge network
                    rate-limiting. Cannot be disabled without breaking site integrity.
                  </p>
                </div>
                <div className="studio-legal__box">
                  <h4>2. Functional Preferences</h4>
                  <p>
                    Used to remember UI preferences such as theme mode (dark vs. light paper) and collapsed
                    sidebar states across visits.
                  </p>
                </div>
                <div className="studio-legal__box">
                  <h4>3. Workspace Authentication</h4>
                  <p>
                    Secure, encrypted session cookies issued only to authorized studio staff accessing the private
                    management dashboard.
                  </p>
                </div>
                <div className="studio-legal__box studio-legal__box--highlight">
                  <h4>4. Ad Tracking: NONE</h4>
                  <p>
                    We categorically refuse to implement third-party advertising cookies, cross-site trackers,
                    or behavioural profiling tools.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 03 */}
            <section id="inventory" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">03</span>
                <h2>Detailed Cookie Inventory</h2>
              </div>
              <p>The following table lists the specific cookies deployed across our domains:</p>

              <div className="studio-legal__table-wrap">
                <table className="studio-legal__table">
                  <thead>
                    <tr>
                      <th>Cookie Name</th>
                      <th>Category</th>
                      <th>Purpose</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>vx_theme</code></td>
                      <td>Functional</td>
                      <td>Stores selected interface theme mode (light/dark paper)</td>
                      <td>1 Year</td>
                    </tr>
                    <tr>
                      <td><code>vx_csrf</code></td>
                      <td>Essential</td>
                      <td>Validates contact form submissions to prevent cross-site request forgery</td>
                      <td>Session</td>
                    </tr>
                    <tr>
                      <td><code>vx_session</code></td>
                      <td>Essential (Staff)</td>
                      <td>Encrypted JSON Web Token for authenticated staff portal access</td>
                      <td>7 Days</td>
                    </tr>
                    <tr>
                      <td><code>__cf_bm / _edge</code></td>
                      <td>Essential</td>
                      <td>Cloudflare/edge infrastructure bot management and DDoS protection</td>
                      <td>30 Minutes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 04 */}
            <section id="third-parties" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">04</span>
                <h2>Third-Party Trackers &amp; Analytics</h2>
              </div>
              <p>
                Unlike many commercial websites, Vraunix Studio does not rely on ad monetization or marketing
                networks. We believe your visit should remain private:
              </p>
              <div className="studio-legal__callout">
                <p>
                  <strong>No Tracking Pixels:</strong> We do not load Facebook/Meta Pixel, LinkedIn Insight Tag,
                  Google Ads conversion tags, or behavioral analytics cookies on this public website.
                </p>
              </div>
              <p>
                If we introduce server-side privacy-first analytics in the future (such as self-hosted Plausible
                or aggregate edge logs), it will operate entirely cookie-free without collecting personally
                identifiable information.
              </p>
            </section>

            {/* Section 05 */}
            <section id="management" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">05</span>
                <h2>Managing Your Browser Preferences</h2>
              </div>
              <p>
                Most modern browsers allow you to control cookie settings, including blocking all cookies,
                blocking third-party cookies only, or clearing cookies when you close your browser.
              </p>
              <div className="studio-legal__subblock">
                <h3>Browser Setting Instructions</h3>
                <ul className="studio-legal__bullet-list">
                  <li>
                    <strong>Google Chrome:</strong> Settings &rarr; Privacy and security &rarr; Third-party cookies.
                  </li>
                  <li>
                    <strong>Apple Safari:</strong> Preferences &rarr; Privacy &rarr; Prevent cross-site tracking.
                  </li>
                  <li>
                    <strong>Mozilla Firefox:</strong> Settings &rarr; Privacy &amp; Security &rarr; Enhanced
                    Tracking Protection.
                  </li>
                  <li>
                    <strong>Microsoft Edge:</strong> Settings &rarr; Cookies and site permissions &rarr; Manage and
                    delete cookies.
                  </li>
                </ul>
              </div>
              <p>
                Please note: Blocking essential cookies may affect form submission reliability or prevent
                authorized staff members from signing into their workspace.
              </p>
            </section>

            {/* Section 06 */}
            <section id="contact" className="studio-legal__section">
              <div className="studio-legal__section-header">
                <span className="studio-legal__section-num">06</span>
                <h2>Questions &amp; Contact</h2>
              </div>
              <p>
                If you have questions regarding our cookie practices or wish to inquire about our privacy
                engineering standards, feel free to contact us:
              </p>
              <div className="studio-legal__contact-panel">
                <div className="studio-legal__contact-info">
                  <h3>{COMPANY.name}</h3>
                  <p>Technical Inquiries &amp; Data Governance</p>
                  <a href={`mailto:${COMPANY.email}`} className="studio-legal__email-btn">
                    {COMPANY.email}
                  </a>
                </div>
                <div className="studio-legal__contact-meta">
                  <p><strong>Status:</strong> Active &amp; Compliant</p>
                  <p><strong>Response Time:</strong> Within 1&ndash;2 business days</p>
                </div>
              </div>
            </section>
          </article>
        </div>
      </section>
    </div>
  );
}
