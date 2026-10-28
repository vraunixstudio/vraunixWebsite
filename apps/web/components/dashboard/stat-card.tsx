import Link from "next/link";
import { Icon } from "@/components/icons";

export function StatCard({
  label,
  value,
  hint,
  href,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: "default" | "accent" | "warning" | "danger";
}) {
  const body = (
    <>
      <div className="stat-card__head">
        <span className="stat-card__label">{label}</span>
        {href && (
          <Icon name="arrow-up-right" size={15} className="stat-card__arrow" />
        )}
      </div>
      <strong>{value}</strong>
      {hint && <p>{hint}</p>}
    </>
  );

  return href ? (
    <Link href={href} className={`stat-card stat-card--${tone}`}>
      {body}
    </Link>
  ) : (
    <div className={`stat-card stat-card--${tone}`}>{body}</div>
  );
}
