import Link from "next/link";
import { ThemeProvider } from "@/theme";

export default function NotFound() {
  return (
    <ThemeProvider>
      <div className="not-found">
        <div className="not-found__inner">
          <p className="not-found__kicker">
            <span aria-hidden="true">/</span> 404 <span aria-hidden="true">/</span>
          </p>
          <h1 className="not-found__title">
            This page is not
            <br />
            <em>where you left it.</em>
          </h1>
          <p className="not-found__copy">
            The link may be outdated, or the page may have moved. The rest of the
            studio is still here.
          </p>
          <div className="not-found__actions">
            <Link href="/" className="vx-button vx-button--pill-dark">
              Return home
            </Link>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
