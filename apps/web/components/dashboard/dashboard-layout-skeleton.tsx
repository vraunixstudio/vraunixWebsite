"use client";

import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function matchesPath(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function NavRow({
  width,
  active = false,
  trigger = false,
}: {
  width: string;
  active?: boolean;
  trigger?: boolean;
}) {
  return (
    <span
      className={`dashboard-shell-skeleton__nav-row${active ? " is-active" : ""}${
        trigger ? " dashboard-shell-skeleton__nav-row--trigger" : ""
      }`}
    >
      <Skeleton className="dashboard-shell-skeleton__nav-icon" />
      <Skeleton
        className="dashboard-shell-skeleton__nav-label"
        style={{ width }}
      />
      {trigger && (
        <Skeleton className="dashboard-shell-skeleton__nav-chevron" />
      )}
    </span>
  );
}

export function DashboardLayoutSkeleton() {
  const pathname = usePathname() ?? "/dashboard";

  return (
    <div
      className="dashboard dashboard-shell-skeleton"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy="true"
    >
      <span className="sr-only">Loading workspace</span>

      <aside className="dashboard-sidebar" aria-hidden="true">
        <div className="dashboard-sidebar__header">
          <div className="dashboard-sidebar__top">
            <Skeleton className="dashboard-shell-skeleton__logo" />
          </div>
        </div>

        <nav className="dashboard-nav">
          <NavRow
            width="4.85rem"
            active={matchesPath(pathname, "/dashboard")}
          />

          <div className="dashboard-nav__group">
            <NavRow width="4.4rem" trigger />
            <div className="dashboard-nav__group-items">
              <NavRow
                width="4.65rem"
                active={matchesPath(pathname, "/dashboard/clients")}
              />
              <NavRow
                width="5.1rem"
                active={matchesPath(pathname, "/dashboard/inquiries")}
              />
            </div>
          </div>

          <NavRow
            width="5.55rem"
            active={matchesPath(pathname, "/dashboard/proposals")}
          />
          <NavRow
            width="5.35rem"
            active={matchesPath(pathname, "/dashboard/projects")}
          />
          <NavRow
            width="5rem"
            active={matchesPath(pathname, "/dashboard/invoices")}
          />

          <div className="dashboard-nav__group">
            <NavRow width="4.6rem" trigger />
          </div>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar" aria-hidden="true">
          <div className="dashboard-topbar__left">
            <Skeleton className="dashboard-shell-skeleton__menu" />
            <div className="dashboard-search dashboard-shell-skeleton__search">
              <Skeleton className="dashboard-shell-skeleton__search-input" />
            </div>
          </div>
          <div className="dashboard-topbar__right">
            <span className="dashboard-sync dashboard-shell-skeleton__sync">
              <span className="dashboard-sync__dot" />
            </span>
            <span
              className="dashboard-profile dashboard-shell-skeleton__profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                background: "transparent",
                border: "none",
                padding: 0,
              }}
            >
              <span
                className="dashboard-shell-skeleton__profile-body"
                style={{ textAlign: "right" }}
              >
                <Skeleton className="dashboard-shell-skeleton__profile-name" />
                <Skeleton className="dashboard-shell-skeleton__profile-role" />
              </span>
              <Skeleton className="dashboard-shell-skeleton__signout" />
            </span>
          </div>
        </header>

        <div className="dashboard-content" aria-hidden="true">
          <header className="workspace-heading">
            {pathname !== "/dashboard" && (
              <Skeleton className="dashboard-shell-skeleton__back" />
            )}
            <Skeleton className="dashboard-shell-skeleton__heading" />
          </header>

          <div className="dashboard-page dashboard-shell-skeleton__page">
            <Skeleton className="dashboard-shell-skeleton__panel" />
            <Skeleton className="dashboard-shell-skeleton__panel" />
          </div>
        </div>
      </div>
    </div>
  );
}
