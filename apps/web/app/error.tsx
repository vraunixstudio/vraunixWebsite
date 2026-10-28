"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ThemeProvider } from "@/theme";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const dashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ThemeProvider>
      <div className="not-found">
        <div className="not-found__inner">
          <p className="not-found__kicker">
            <span aria-hidden="true">/</span> ERROR{" "}
            <span aria-hidden="true">/</span>
          </p>
          <h1 className="not-found__title">
            Something went
            <br />
            <em>wrong.</em>
          </h1>
          <p className="not-found__copy">
            An unexpected interruption occurred. You can retry, or return to a
            stable part of the studio.
          </p>
          <div className="not-found__actions">
            <button
              type="button"
              className="vx-button vx-button--pill-dark"
              onClick={reset}
            >
              Try again
            </button>
            <Link
              href={dashboard ? "/dashboard" : "/"}
              className="vx-button vx-button--pill-outline"
            >
              {dashboard ? "Back to dashboard" : "Return home"}
            </Link>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
