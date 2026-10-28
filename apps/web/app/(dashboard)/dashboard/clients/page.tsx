"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@/lib/types";
import { useApiResource, useDebouncedValue } from "@/lib/use-api";
import { date } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/icons";
import { SearchBox } from "@/components/dashboard/search";
import { Pagination } from "@/components/dashboard/pagination";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/states";

export default function ClientsPage() {
  return (
    <Suspense fallback={<DashboardListLoading />}>
      <ClientsDirectory />
    </Suspense>
  );
}

function DashboardListLoading() {
  return (
    <div className="dashboard-page clients-page" style={{ width: '100%' }}>
      <div className="toolbar" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton style={{ height: '44px', width: '300px', borderRadius: '99px' }} />
        <Skeleton style={{ height: '44px', width: '140px', borderRadius: '99px' }} />
      </div>
      <div className="clients-directory" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {[...Array(9)].map((_, i) => (
          <div key={i} className="panel" style={{ background: '#fff', border: '1px solid rgba(20,20,20,0.1)', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <Skeleton style={{ height: '24px', width: '60%' }} />
              <Skeleton style={{ height: '20px', width: '40px', borderRadius: '99px' }} />
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <Skeleton style={{ height: '16px', width: '80%' }} />
              <Skeleton style={{ height: '16px', width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientsDirectory() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(search);

  const query = new URLSearchParams({ page: String(page), limit: "9" });
  if (debounced.trim()) query.set("search", debounced.trim());

  const { data, meta, loading, error, reload } = useApiResource<Client[]>(
    `/clients?${query.toString()}`
  );

  return (
    <div className="dashboard-page clients-page" style={{ width: '100%' }}>
      <div className="toolbar clients-toolbar" style={{ marginBottom: '1.5rem' }}>
        <SearchBox
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search client, contact, email, or country"
          className="clients-search"
          clearable
        />
        <Button
          className="vx-button vx-button--primary vx-button--md"
          onClick={() => router.push("/dashboard/clients/new")}
        >
          <Icon name="plus" size={16} />
          Add client
        </Button>
      </div>

      {loading && !data ? (
        <DashboardListLoading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon="building"
          title={search ? "No matching clients" : "No clients yet"}
          description={
            search
              ? "Try a different name, contact, email, or country."
              : "Add your first client to start proposals and invoices."
          }
          action={
            !search ? (
              <Button
                className="vx-button vx-button--secondary vx-button--md"
                onClick={() => router.push("/dashboard/clients/new")}
              >
                <Icon name="plus" size={16} />
                Add the first client
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="clients-directory">
            {data.map((client) => (
              <button
                key={client.id}
                type="button"
                className="client-card"
                onClick={() => router.push(`/dashboard/clients/${client.id}`)}
              >
                <span className="client-card__top">
                  <span className="client-card__identity">
                    <strong style={{ fontSize: '1.05rem', letterSpacing: '-0.02em' }}>{client.name}</strong>
                    <small style={{ fontSize: '0.78rem', color: 'var(--vx-muted)' }}>{client.email}</small>
                  </span>
                  <span className="client-card__arrow" aria-hidden="true">
                    <Icon name="arrow-up-right" size={17} />
                  </span>
                </span>

                <span className="client-card__meta">
                  <span>
                    <small>Contact</small>
                    <strong>{client.contactName || "—"}</strong>
                  </span>
                  <span>
                    <small>Location</small>
                    <strong>{client.country || "—"}</strong>
                  </span>
                </span>

                <span className="client-card__footer">
                  <span>Client since {date(client.createdAt)}</span>
                  <span className="client-card__open">
                    Open detail
                    <Icon name="arrow-right" size={14} />
                  </span>
                </span>
              </button>
            ))}
          </div>
          <Pagination meta={meta} onPage={setPage} />
        </>
      )}
    </div>
  );
}
