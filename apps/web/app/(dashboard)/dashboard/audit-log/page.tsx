"use client";

import { Suspense, useState } from "react";
import type { AuditLog } from "@/lib/types";
import { useApiResource, useDebouncedValue } from "@/lib/use-api";
import { date } from "@/lib/format";
import { SearchBox } from "@/components/dashboard/search";
import { Pagination } from "@/components/dashboard/pagination";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { AuditLogPageSkeleton } from "@/components/dashboard/page-skeletons";

export default function AuditLogPage() {
  return (
    <Suspense fallback={<AuditLogPageSkeleton />}>
      <AuditLogDirectory />
    </Suspense>
  );
}

function AuditLogDirectory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(search);

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", "9");
  if (debounced.trim()) queryParams.set("search", debounced.trim());

  const { data, meta, loading, error, reload } = useApiResource<AuditLog[]>(
    `/audit-logs?${queryParams.toString()}`
  );

  if (loading && !data) return <AuditLogPageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const hasLogs = data && data.length > 0;

  return (
    <div className="dashboard-page audit-page" style={{ width: '100%' }}>
      <div className="toolbar clients-toolbar" style={{ marginBottom: '1.5rem', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, maxWidth: '600px' }}>
          <SearchBox
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search audit actions or actors..."
            className="clients-search"
            clearable
          />
        </div>
      </div>

      {!hasLogs ? (
        <EmptyState
          icon="activity"
          title={search ? "No matching audit events" : "No audit logs yet"}
          description={search ? "Try a different search term." : "System events and staff activities will appear here."}
        />
      ) : (
        <div className="panel" style={{ background: '#ffffff', borderRadius: '1.25rem', border: '1px solid rgba(20,20,20,0.1)', overflow: 'hidden', width: '100%' }}>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(20,20,20,0.08)', color: 'var(--vx-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1.2rem 1.5rem', fontWeight: 700 }}>Action</th>
                  <th style={{ padding: '1.2rem 1.5rem', fontWeight: 700 }}>Entity Type</th>
                  <th style={{ padding: '1.2rem 1.5rem', fontWeight: 700 }}>Actor</th>
                  <th style={{ padding: '1.2rem 1.5rem', fontWeight: 700 }}>Timestamp</th>
                  <th style={{ padding: '1.2rem 1.5rem', fontWeight: 700, textAlign: 'right' }}>Event ID</th>
                </tr>
              </thead>
              <tbody>
                {data.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(20,20,20,0.06)' }}>
                    <td style={{ padding: '1.1rem 1.5rem', fontWeight: 700, color: 'var(--vx-ink)' }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '1.1rem 1.5rem' }}>
                      <span className="vx-badge vx-badge--info">
                        {log.entityType}
                      </span>
                    </td>
                    <td style={{ padding: '1.1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{log.actorName || log.actorEmail}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--vx-muted)' }}>{log.actorEmail}</div>
                    </td>
                    <td style={{ padding: '1.1rem 1.5rem', color: 'var(--vx-muted)', whiteSpace: 'nowrap' }}>
                      {date(log.createdAt)}
                    </td>
                    <td style={{ padding: '1.1rem 1.5rem', textAlign: 'right', fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--vx-muted)' }}>
                      {log.id.slice(0, 12)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} onPage={setPage} />
        </div>
      )}
    </div>
  );
}
