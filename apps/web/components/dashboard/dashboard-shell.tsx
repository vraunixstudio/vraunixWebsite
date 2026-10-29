"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { SessionUser } from "@vraunix/shared";
import { Icon, type IconName } from "@/components/icons";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { api, resetCsrf } from "@/lib/api";
import { money } from "@/lib/format";
import type { Client, Inquiry, Invoice, Project, Proposal } from "@/lib/types";
import { useDebouncedValue } from "@/lib/use-api";

type NavItem = {
  label: string;
  href: string;
  icon: IconName;
  adminOnly?: boolean;
  children?: NavItem[];
};

type RecordSearchResult = {
  key: string;
  title: string;
  subtitle: string;
  typeLabel: string;
  href: string;
  icon: IconName;
};

const navigation: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "dashboard" },
  {
    label: "Clients",
    href: "/dashboard/clients",
    icon: "building",
    children: [
      { label: "Clients", href: "/dashboard/clients", icon: "building" },
      { label: "Inquiries", href: "/dashboard/inquiries", icon: "target" },
    ],
  },
  { label: "Proposals", href: "/dashboard/proposals", icon: "file" },
  { label: "Projects", href: "/dashboard/projects", icon: "briefcase" },
  { label: "Invoices", href: "/dashboard/invoices", icon: "receipt" },
  {
    label: "Admin",
    href: "/dashboard/settings",
    icon: "settings",
    adminOnly: true,
    children: [
      { label: "Settings", href: "/dashboard/settings", icon: "settings" },
      { label: "Audit log", href: "/dashboard/audit-log", icon: "activity" },
    ],
  },
];

function matchesPath(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function visibleNavigation(user: SessionUser) {
  return navigation.filter((item) => !item.adminOnly || user.role === "admin");
}

function resolveLocation(pathname: string, user: SessionUser) {
  const items = visibleNavigation(user);
  const group = items.find(
    (item) =>
      matchesPath(pathname, item.href) ||
      item.children?.some((child) => matchesPath(pathname, child.href))
  );
  const child = group?.children?.find((item) => matchesPath(pathname, item.href));
  return {
    group,
    child,
    title: child?.label ?? group?.label ?? "Workspace",
  };
}

export function DashboardShell({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [recordResults, setRecordResults] = useState<RecordSearchResult[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Clients: true,
    Admin: false,
  });
  const debouncedSearch = useDebouncedValue(search, 280);

  const items = visibleNavigation(user);
  const location = resolveLocation(pathname, user);
  const searchableItems = Array.from(
    new Map(
      items
        .flatMap<NavItem & { group?: string }>((item) => [
          { ...item, group: item.children ? undefined : "Workspace" },
          ...(item.children ?? []).map((child) => ({
            ...child,
            group: item.label,
          })),
        ])
        .map((item) => [item.href, item])
    ).values()
  );
  const searchQuery = search.trim().toLowerCase();
  const pageResults = searchQuery
    ? searchableItems.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery) ||
          item.href.toLowerCase().includes(searchQuery)
      )
    : [];
  const recordsPending =
    recordsLoading ||
    (search.trim().length >= 2 && debouncedSearch.trim() !== search.trim());
  const hasSearchResults =
    recordResults.length > 0 || pageResults.length > 0;

  useEffect(() => {
    const query = debouncedSearch.trim();
    if (query.length < 2 || user.role !== "admin") {
      setRecordResults([]);
      setRecordsLoading(false);
      setRecordsError(false);
      return;
    }

    const controller = new AbortController();
    let active = true;
    const searchParam = encodeURIComponent(query);

    setRecordsLoading(true);
    setRecordsError(false);

    Promise.allSettled([
      api<Client[]>(`/clients?limit=3&search=${searchParam}`, {
        signal: controller.signal,
      }),
      api<Inquiry[]>(`/inquiries?limit=3&search=${searchParam}`, {
        signal: controller.signal,
      }),
      api<Proposal[]>(`/proposals?limit=3&search=${searchParam}`, {
        signal: controller.signal,
      }),
      api<Project[]>(`/projects?limit=3&search=${searchParam}`, {
        signal: controller.signal,
      }),
      api<Invoice[]>(`/invoices?limit=3&search=${searchParam}`, {
        signal: controller.signal,
      }),
    ])
      .then(([clients, inquiries, proposals, projects, invoices]) => {
        if (!active) return;

        const records: RecordSearchResult[] = [];

        if (clients.status === "fulfilled") {
          records.push(
            ...clients.value.data.map((client) => ({
              key: `client-${client.id}`,
              title: client.name,
              subtitle: client.contactName
                ? `${client.contactName} · ${client.email}`
                : client.email,
              typeLabel: "Client",
              href: `/dashboard/clients/${client.id}`,
              icon: "building" as const,
            }))
          );
        }

        if (inquiries.status === "fulfilled") {
          records.push(
            ...inquiries.value.data.map((inquiry) => ({
              key: `inquiry-${inquiry.id}`,
              title: inquiry.businessName || inquiry.name,
              subtitle:
                inquiry.businessName && inquiry.businessName !== inquiry.name
                  ? `${inquiry.name} · ${inquiry.email}`
                  : inquiry.email,
              typeLabel: "Inquiry",
              href: `/dashboard/inquiries?inquiry=${inquiry.id}`,
              icon: "target" as const,
            }))
          );
        }

        if (proposals.status === "fulfilled") {
          records.push(
            ...proposals.value.data.map((proposal) => ({
              key: `proposal-${proposal.id}`,
              title: proposal.title,
              subtitle: `${proposal.number} · ${proposal.status.replace(/_/g, " ")}`,
              typeLabel: "Proposal",
              href: `/dashboard/proposals/${proposal.id}`,
              icon: "file" as const,
            }))
          );
        }

        if (projects.status === "fulfilled") {
          records.push(
            ...projects.value.data.map((project) => ({
              key: `project-${project.id}`,
              title: project.name,
              subtitle: project.status.replace(/_/g, " "),
              typeLabel: "Project",
              href: `/dashboard/projects/${project.id}`,
              icon: "briefcase" as const,
            }))
          );
        }

        if (invoices.status === "fulfilled") {
          records.push(
            ...invoices.value.data.map((invoice) => ({
              key: `invoice-${invoice.id}`,
              title: invoice.number,
              subtitle: `${money(invoice.totalMinor, invoice.currency)} · ${invoice.status.replace(/_/g, " ")}`,
              typeLabel: "Invoice",
              href: `/dashboard/invoices/${invoice.id}`,
              icon: "receipt" as const,
            }))
          );
        }

        setRecordResults(records);
        setRecordsError(
          !controller.signal.aborted &&
            [clients, inquiries, proposals, projects, invoices].some(
              (result) => result.status === "rejected"
            )
        );
      })
      .catch(() => {
        if (!active) return;
        setRecordResults([]);
        setRecordsError(!controller.signal.aborted);
      })
      .finally(() => {
        if (active) setRecordsLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [debouncedSearch, user.role]);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function goToSearchResult(href: string) {
    setSearch("");
    setSearchOpen(false);
    router.push(href);
  }

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const firstResult = recordResults[0] ?? pageResults[0];
    if (firstResult) goToSearchResult(firstResult.href);
  }

  async function signOut() {
    setSigningOut(true);
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {
      // The client still clears local state and asks the server to re-check.
    } finally {
      resetCsrf();
      router.replace("/");
      router.refresh();
      setSigningOut(false);
      setConfirmSignOut(false);
    }
  }

  return (
    <div className={`dashboard ${mobileOpen ? "is-open" : ""}`}>
      <aside
        id="dashboard-sidebar"
        className={`dashboard-sidebar ${mobileOpen ? "is-open" : ""}`}
      >
        <div className="dashboard-sidebar__header">
          <div className="dashboard-sidebar__top">
            <Logo href="/dashboard" textOnly />
            <button
              type="button"
              className="vx-button dashboard-sidebar__close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <Icon name="x" size={20} />
            </button>
          </div>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          {items.map((item) => {
            if (item.children && item.children.length > 0) {
              const isOpen = openGroups[item.label] ?? false;
              return (
                <div key={item.label} className="dashboard-nav__group">
                  <button
                    type="button"
                    className="dashboard-nav__group-trigger"
                    onClick={() =>
                      setOpenGroups((current) => ({
                        ...current,
                        [item.label]: !isOpen,
                      }))
                    }
                    aria-expanded={isOpen}
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                    <Icon
                      name="chevron-right"
                      size={16}
                      className={`dashboard-nav__chevron ${isOpen ? "is-open" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="dashboard-nav__group-items">
                      {item.children.map((child) => {
                        const childActive = matchesPath(pathname, child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={childActive ? "is-active" : undefined}
                            aria-current={childActive ? "page" : undefined}
                          >
                            <Icon name={child.icon} size={18} />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const active =
              item === location.group || matchesPath(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={active ? "is-active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="vx-button dashboard-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar__left">
            <button
              type="button"
              className="vx-button dashboard-menu-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              aria-controls="dashboard-sidebar"
            >
              <Icon name="menu" size={21} />
            </button>
            <form
              className="dashboard-search"
              role="search"
              onSubmit={submitSearch}
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null
                  )
                ) {
                  setSearchOpen(false);
                }
              }}
            >
              <Icon name="search" size={16} />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search workspace"
                aria-label="Search workspace"
              />
              {searchOpen && searchQuery && (
                <div
                  className="dashboard-search__results"
                  aria-busy={recordsPending}
                >
                  {recordsPending && (
                    <p className="dashboard-search__status" role="status">
                      Searching records…
                    </p>
                  )}

                  {!recordsPending && recordResults.length > 0 && (
                    <>
                      <p className="dashboard-search__section">Records</p>
                      {recordResults.map((result) => (
                        <button
                          key={result.key}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => goToSearchResult(result.href)}
                        >
                          <Icon name={result.icon} size={16} />
                          <span className="dashboard-search__result-body">
                            <strong>{result.title}</strong>
                            <small>{result.subtitle}</small>
                          </span>
                          <span className="dashboard-search__path">
                            {result.typeLabel}
                          </span>
                        </button>
                      ))}
                    </>
                  )}

                  {!recordsPending && recordsError && (
                    <p className="dashboard-search__status">
                      Some records could not be searched.
                    </p>
                  )}

                  {pageResults.length > 0 && (
                    <>
                      <p className="dashboard-search__section">Pages</p>
                      {pageResults.map((item) => (
                        <button
                          key={item.href}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => goToSearchResult(item.href)}
                        >
                          <Icon name={item.icon} size={16} />
                          <span>{item.label}</span>
                          <span className="dashboard-search__path">
                            {item.group ?? "Workspace"}
                          </span>
                        </button>
                      ))}
                    </>
                  )}

                  {!recordsPending && !hasSearchResults && !recordsError && (
                    <p className="dashboard-search__empty">
                      No matching records or pages
                    </p>
                  )}
                </div>
              )}
            </form>
          </div>
          <div className="dashboard-topbar__right">
            <div className="dashboard-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'transparent', border: 'none', padding: 0 }}>
              <span className="dashboard-profile__body" style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.02em', display: 'block' }}>Vraunix Administrator</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--vx-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin</span>
              </span>
              <button
                className="vx-button dashboard-profile__signout"
                type="button"
                onClick={() => setConfirmSignOut(true)}
                disabled={signingOut}
                aria-label="Sign out"
                title="Sign out"
              >
                <Icon name="logout" size={16} />
              </button>
            </div>
          </div>
        </header>

        {confirmSignOut && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}>
            <div className="panel" style={{
              background: '#ffffff',
              borderRadius: '1.25rem',
              padding: '2.5rem',
              maxWidth: '440px',
              width: '100%',
              border: '1px solid rgba(20,20,20,0.1)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em', fontFamily: 'var(--vx-font-display)' }}>
                Sign Out of Workspace
              </h3>
              <p style={{ color: 'var(--vx-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Are you sure you want to sign out of your Vraunix session? You will need to re-authenticate to access the studio.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="ghost"
                  className="vx-button vx-button--secondary vx-button--md"
                  onClick={() => setConfirmSignOut(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="vx-button vx-button--primary vx-button--md"
                  onClick={signOut}
                  loading={signingOut}
                >
                  Confirm Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-content">
          <header className="workspace-heading">
            {pathname !== "/dashboard" && (
              <button
                type="button"
                className="vx-button dashboard-back-button"
                onClick={() => {
                  const parent = pathname.replace(/\/[^/]+$/, "");
                  router.push(parent || "/dashboard");
                }}
                aria-label="Go back"
              >
                <Icon name="arrow-left" size={18} />
              </button>
            )}
            <h1>{location.title}</h1>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
