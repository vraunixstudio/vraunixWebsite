"use client";

import Link from "next/link";
import { COMPANY } from "@vraunix/shared";
import type { PublicSettings } from "@vraunix/shared";
import { Logo } from "@/components/ui/logo";

export function SiteFooter({ settings }: { settings?: PublicSettings }) {
  const year = new Date().getFullYear();
  const company = settings?.company || COMPANY;

  return (
    <footer className="studio-footer">
      <div className="container">
        <div className="studio-footer__main">
          <div className="studio-footer__brand-block">
            <Logo textOnly />
            <p className="studio-footer__tagline">
              First-class website development and digital engineering for growing
              businesses.
            </p>
          </div>

          <nav className="studio-footer__nav" aria-label="Footer">
            <div className="studio-footer__col">
              <h4>Navigation</h4>
              <ul>
                <li><Link href="/#home">Home</Link></li>
                <li><Link href="/#services">Services</Link></li>
                <li><Link href="/#process">Process</Link></li>
              </ul>
            </div>

            <div className="studio-footer__col">
              <h4>Legal</h4>
              <ul>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms &amp; Conditions</Link></li>
                <li><Link href="/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="studio-footer__bottom">
          <p>&copy; {year} {company.name}. All rights reserved.</p>
          <div className="studio-footer__links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
