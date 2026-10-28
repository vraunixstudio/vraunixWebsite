"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import type { Proposal, Client } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useApiResource } from "@/lib/use-api";
import { money, date } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/dashboard/feedback";
import { EmptyState, ErrorState, Spinner } from "@/components/ui/states";
import { Icon } from "@/components/icons";

export default function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: proposal, loading, error, reload } = useApiResource<Proposal>(`/proposals/${id}`);
  const { data: client } = useApiResource<Client>(proposal ? `/clients/${proposal.clientId}` : null);

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    setToast(null);
    try {
      await action();
      setToast({ tone: "success", message: success });
      reload();
    } catch (cause) {
      setToast({ tone: "danger", message: cause instanceof ApiError ? cause.message : "Action failed" });
    } finally {
      setBusy(false);
    }
  }

  if (loading && !proposal) return <Spinner label="Loading proposal" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!proposal) return <EmptyState icon="file" title="Proposal not found" />;

  const statusTone: Record<string, "info" | "success" | "warning" | "danger"> = {
    draft: "warning",
    sent: "info",
    accepted: "success",
    declined: "danger",
    expired: "danger",
  };

  return (
    <div className="dashboard-page proposal-detail-page" style={{ width: '100%' }}>
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}

      <div style={{ display: 'grid', gap: '2.5rem', width: '100%' }}>
        {/* Header with Title and Inline Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.1 }}>
              {proposal.title}
            </h1>
            <p style={{ color: 'var(--vx-muted)', fontSize: '0.95rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{proposal.number}</span>
              <span>·</span>
              <span className={`vx-badge vx-badge--${statusTone[proposal.status] ?? "info"}`}>
                {proposal.status}
              </span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {proposal.status === "draft" && (
              <Button
                className="vx-button vx-button--primary vx-button--md"
                onClick={() => run(() => api(`/proposals/${id}/send`, { method: "POST" }), "Proposal sent.")}
                loading={busy}
              >
                <Icon name="send" size={15} />
                Send Proposal
              </Button>
            )}
            {proposal.status === "sent" && (
              <>
                <Button
                  className="vx-button vx-button--primary vx-button--md"
                  onClick={() => run(() => api(`/proposals/${id}/accept`, { method: "POST" }), "Proposal accepted.")}
                  loading={busy}
                >
                  <Icon name="check" size={15} />
                  Accept
                </Button>
                <Button
                  className="vx-button vx-button--secondary vx-button--md"
                  onClick={() => run(async () => {
                    await api(`/proposals/${id}/accept`, { method: "POST" });
                    await api(`/projects/from-proposal/${id}`, { method: "POST" });
                  }, "Accepted and project created.")}
                  loading={busy}
                >
                  <Icon name="briefcase" size={15} />
                  Accept & Project
                </Button>
              </>
            )}
            {proposal.status === "accepted" && (
              <Button
                className="vx-button vx-button--secondary vx-button--md"
                onClick={() => run(() => api(`/projects/from-proposal/${id}`, { method: "POST" }), "Project created.")}
                loading={busy}
              >
                <Icon name="briefcase" size={15} />
                Create Project
              </Button>
            )}
            <Button
              className="vx-button vx-button--secondary vx-button--md"
              onClick={() => router.push(`/dashboard/invoices/new?clientId=${proposal.clientId}&proposalId=${proposal.id}`)}
            >
              <Icon name="receipt" size={15} />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Minimal Key Metrics */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%' }}>
          <div className="stat-card" style={{ padding: '1.5rem' }}>
            <span className="stat-card__label">Total Valuation</span>
            <strong>{money(proposal.pricing.totalMinor, proposal.pricing.currency)}</strong>
          </div>
          <div className="stat-card" style={{ padding: '1.5rem' }}>
            <span className="stat-card__label">Status</span>
            <strong style={{ textTransform: 'capitalize', fontSize: '1.5rem' }}>{proposal.status}</strong>
          </div>
          <div className="stat-card" style={{ padding: '1.5rem' }}>
            <span className="stat-card__label">Scope Items</span>
            <strong>{proposal.scope?.length || 0}</strong>
          </div>
        </div>

        {/* Proposal Particulars & Scope Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', width: '100%', alignItems: 'start' }}>
          {/* Particulars White Container */}
          <div className="panel" style={{ background: '#ffffff', padding: '1.8rem 2rem', borderRadius: '1.25rem', border: '1px solid rgba(20,20,20,0.1)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--vx-font-display)' }}>
              Particulars
            </h3>
            <dl className="detail-list" style={{ display: 'grid', gap: '1.2rem' }}>
              <div>
                <dt>Proposal Reference</dt>
                <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>{proposal.number}</dd>
              </div>
              <div>
                <dt>Client</dt>
                <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>
                  {client ? (
                    <a href={`/dashboard/clients/${client.id}`} className="vx-text-link">
                      {client.name}
                      <Icon name="external" size={12} style={{ marginLeft: '4px' }} />
                    </a>
                  ) : (
                    proposal.clientId
                  )}
                </dd>
              </div>
              <div>
                <dt>Currency</dt>
                <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>{proposal.pricing.currency}</dd>
              </div>
              <div>
                <dt>Created On</dt>
                <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>{date(proposal.createdAt)}</dd>
              </div>
              {proposal.sentAt && (
                <div>
                  <dt>Sent On</dt>
                  <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>{date(proposal.sentAt)}</dd>
                </div>
              )}
              {proposal.acceptedAt && (
                <div>
                  <dt>Accepted On</dt>
                  <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>{date(proposal.acceptedAt)}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Scope & Deliverables */}
          <div className="panel" style={{ background: '#ffffff', padding: '1.8rem 2rem', borderRadius: '1.25rem', border: '1px solid rgba(20,20,20,0.1)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--vx-font-display)' }}>
              Scope & Deliverables
            </h3>
            {proposal.scope && proposal.scope.length > 0 ? (
              <ul className="tick-list" style={{ display: 'grid', gap: '0.8rem' }}>
                {proposal.scope.map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <Icon name="check" size={16} style={{ marginTop: '2px', color: 'var(--vx-color-ink)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--vx-muted)', fontSize: '0.9rem' }}>No defined scope items listed.</p>
            )}
          </div>
        </div>

        {/* Description / Summary */}
        {proposal.description && (
          <div className="panel" style={{ background: '#ffffff', borderRadius: '1.25rem', padding: '1.8rem 2rem', border: '1px solid rgba(20,20,20,0.1)', width: '100%' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.6rem' }}>Description & Terms</h3>
            <p style={{ color: 'var(--vx-muted)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {proposal.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
