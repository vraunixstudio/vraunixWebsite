import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <section className="page-intro theme-dark">
      <div className="container page-intro__grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <div className="page-intro__aside">
          <p>{description}</p>
          {aside}
        </div>
      </div>
      <div className="page-intro__rule" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
