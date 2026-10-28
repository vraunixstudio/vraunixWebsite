import type { ReactNode } from "react";
import { ThemeProvider } from "@/theme";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { BackToTop } from "@/components/site/back-to-top";
import { getPublicSettings } from "@/lib/public";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getPublicSettings();
  return (
    <ThemeProvider>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <BackToTop />
      <SiteFooter settings={settings} />
    </ThemeProvider>
  );
}
