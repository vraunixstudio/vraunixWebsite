import Link from "next/link";

export function Logo({
  href = "/",
  compact = false,
  textOnly = false,
  className = "",
}: {
  href?: string;
  compact?: boolean;
  textOnly?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`vx-logo ${className}`.trim()} aria-label="Vraunix Studio home">
      {!textOnly && (
        <span className="vx-logo__mark" aria-hidden="true">
          V
        </span>
      )}
      {!compact && (
        <span className="vx-logo__type">
          <span className="vx-logo__name">Vraunix Studio</span>
        </span>
      )}
    </Link>
  );
}
