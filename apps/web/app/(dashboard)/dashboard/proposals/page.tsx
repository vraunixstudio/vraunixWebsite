"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Proposal } from "@/lib/types";
import { useApiResource, useDebouncedValue } from "@/lib/use-api";
import { money, date } from "@/lib/format";
import { SearchBox } from "@/components/dashboard/search";
import { Pagination } from "@/components/dashboard/pagination";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/icons";

export default function ProposalsPage() {
  return (
    <Suspense fallback={<DashboardListLoading />}>
      <ProposalsDirectory />
    </Suspense>
  );
}

function DashboardListLoading() {
  return (
    <div className="dashboard-page proposals-page" style={{ width: '100%' }}>
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

function ProposalsDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId") ?? undefined;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(search);

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", "9");
  if (clientId) queryParams.set("clientId", clientId);
  if (debounced.trim()) queryParams.set("search", debounced.trim());

  const { data, meta, loading, error, reload } = useApiResource<Proposal[]>(
    `/proposals?${queryParams.toString()}`
  );

  if (loading && !data) return <DashboardListLoading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const hasProposals = data && data.length > 0;

  return (
    <div className="dashboard-page proposals-page" style={{ width: '100%' }}>
      <div className="toolbar clients-toolbar" style={{ marginBottom: '1.5rem' }}>
        <SearchBox
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by title or reference number..."
          className="clients-search"
          clearable
        />
        <Button
          className="vx-button vx-button--primary vx-button--md"
          onClick={() => router.push(`/dashboard/proposals/new${clientId ? `?clientId=${clientId}` : ""}`)}
        >
          <Icon name="plus" size={16} />
          New proposal
        </Button>
      </div>

      {!hasProposals ? (
        <EmptyState
          icon="file"
          title={search ? "No matching proposals" : "No proposals found"}
          description={search ? "Try a different title or reference number." : "Create a proposal to send to a client."}
          action={
            !search ? (
              <Button
                className="vx-button vx-button--secondary vx-button--md"
                onClick={() => router.push(`/dashboard/proposals/new${clientId ? `?clientId=${clientId}` : ""}`)}
              >
                <Icon name="plus" size={16} />
                Create the first proposal
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="clients-directory">
            {data.map((proposal) => (
              <button
                key={proposal.id}
                type="button"
                className="client-card"
                onClick={() => router.push(`/dashboard/proposals/${proposal.id}`)}
              >
                <span className="client-card__top">
                  <span className="client-card__identity">
                    <strong style={{ fontSize: '1.05rem', letterSpacing: '-0.02em' }}>{proposal.title}</strong>
                    <small style={{ fontSize: '0.78rem', color: 'var(--vx-muted)' }}>{proposal.number}</small>
                  </span>
                  <span className="client-card__arrow" aria-hidden="true">
                    <Icon name="arrow-up-right" size={17} />
                  </span>
                </span>

                <span className="client-card__meta">
                  <span>
                    <small>Valuation</small>
                    <strong>{money(proposal.pricing.totalMinor, proposal.pricing.currency)}</strong>
                  </span>
                  <span>
                    <small>Status</small>
                    <strong style={{ textTransform: 'capitalize' }}>{proposal.status}</strong>
                  </span>
                </span>

                <span className="client-card__footer">
                  <span>Created {date(proposal.createdAt)}</span>
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
