"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Invoice } from "@/lib/types";
import { useApiResource, useDebouncedValue } from "@/lib/use-api";
import { date, money } from "@/lib/format";
import { SearchBox } from "@/components/dashboard/search";
import { Pagination } from "@/components/dashboard/pagination";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/icons";

export default function InvoicesPage() {
  return (
    <Suspense fallback={<InvoicesDirectoryLoading />}>
      <InvoicesDirectory />
    </Suspense>
  );
}

function InvoicesDirectoryLoading() {
  return (
    <div className="dashboard-page invoices-page" style={{ width: '100%' }}>
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

function InvoicesDirectory() {
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

  const { data, meta, loading, error, reload } = useApiResource<Invoice[]>(
    `/invoices?${queryParams.toString()}`
  );

  if (loading && !data) return <InvoicesDirectoryLoading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const hasInvoices = data && data.length > 0;

  return (
    <div className="dashboard-page invoices-page" style={{ width: '100%' }}>
      <div className="toolbar clients-toolbar" style={{ marginBottom: '1.5rem', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, maxWidth: '600px' }}>
          <SearchBox
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search invoice number..."
            className="clients-search"
            clearable
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button
            className="vx-button vx-button--primary vx-button--md"
            onClick={() => router.push(`/dashboard/invoices/new${clientId ? `?clientId=${clientId}` : ""}`)}
          >
            <Icon name="plus" size={16} />
            New Invoice
          </Button>
        </div>
      </div>

      {!hasInvoices ? (
        <EmptyState
          icon="receipt"
          title={search ? "No matching invoices" : "No invoices yet"}
          description={search ? "Try a different search term." : "Create an invoice to bill a client."}
          action={!search ? (
            <Button
              className="vx-button vx-button--secondary vx-button--md"
              onClick={() => router.push(`/dashboard/invoices/new${clientId ? `?clientId=${clientId}` : ""}`)}
            >
              <Icon name="plus" size={16} />
              Create Invoice
            </Button>
          ) : undefined}
        />
      ) : (
        <>
          <div className="clients-directory">
            {data.map((invoice) => (
              <button
                key={invoice.id}
                type="button"
                className="client-card"
                onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
              >
                <span className="client-card__top">
                  <span className="client-card__identity">
                    <strong style={{ fontSize: '1.05rem', letterSpacing: '-0.02em' }}>{invoice.number}</strong>
                    <small style={{ fontSize: '0.78rem', color: 'var(--vx-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {invoice.status.replace('_', ' ')}
                    </small>
                  </span>
                  <span className="client-card__arrow" aria-hidden="true">
                    <Icon name="arrow-up-right" size={17} />
                  </span>
                </span>

                <span className="client-card__meta">
                  <span>
                    <small>Total Amount</small>
                    <strong>{money(invoice.totalMinor, invoice.currency)}</strong>
                  </span>
                  <span>
                    <small>Balance Due</small>
                    <strong>{money(invoice.balanceMinor, invoice.currency)}</strong>
                  </span>
                </span>

                <span className="client-card__footer">
                  <span>Due {date(invoice.dueDate)}</span>
                  <span className="client-card__open">
                    Open invoice
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
