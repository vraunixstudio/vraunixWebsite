import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      <div className="section-heading__aside">
        {description && <p>{description}</p>}
        {href && linkLabel && (
          <Link href={href} className="vx-text-link">
            {linkLabel}
            <Icon name="arrow-up-right" size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}
