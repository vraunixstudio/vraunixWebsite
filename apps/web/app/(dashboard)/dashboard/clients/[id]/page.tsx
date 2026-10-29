"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Client, Proposal, Project, Invoice } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useApiResource } from "@/lib/use-api";
import { date } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/dashboard/feedback";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Icon } from "@/components/icons";
import { ClientDetailSkeleton } from "@/components/dashboard/page-skeletons";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: client, loading, error, reload } = useApiResource<Client>(`/clients/${id}`);

  // Related resources
  const { data: proposals } = useApiResource<Proposal[]>(`/proposals?clientId=${id}`);
  const { data: projects } = useApiResource<Project[]>(`/projects?clientId=${id}`);
  const { data: invoices } = useApiResource<Invoice[]>(`/invoices?clientId=${id}`);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  useEffect(() => {
    if (client && !editing) {
      setName(client.name);
      setContactName(client.contactName ?? "");
      setEmail(client.email);
      setPhone(client.phone ?? "");
      setCountry(client.country ?? "");
      setWebsite(client.website ?? "");
      setNotes(client.notes ?? "");
    }
  }, [client, editing]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setToast(null);
    try {
      await api(`/clients/${id}`, {
        method: "PATCH",
        body: { name, contactName, email, phone, country, website, notes }
      });
      setEditing(false);
      setToast({ tone: "success", message: "Client updated." });
      reload();
    } catch (cause) {
      setToast({ tone: "danger", message: cause instanceof ApiError ? cause.message : "Update failed" });
    } finally {
      setBusy(false);
    }
  }

  if (loading && !client) return <ClientDetailSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!client) return <EmptyState icon="building" title="Client not found" />;

  const activeProjects = projects?.filter(p => p.status !== "completed" && p.status !== "cancelled").length || 0;
  const openInvoices = invoices?.filter(i => i.status !== "paid" && i.status !== "void").length || 0;

  return (
    <div className="dashboard-page client-detail-page" style={{ width: '100%' }}>
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}

      {!editing ? (
        <div style={{ display: 'grid', gap: '2.5rem', width: '100%' }}>
          {/* Top Title & Inline Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.1 }}>
                {client.name}
              </h1>
              <p style={{ color: 'var(--vx-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                {client.email} {client.country ? `· ${client.country}` : ""}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Button className="vx-button vx-button--secondary vx-button--md" onClick={() => setEditing(true)}>
                <Icon name="pen" size={15} />
                Edit
              </Button>
              <Button
                className="vx-button vx-button--primary vx-button--md"
                onClick={() => router.push(`/dashboard/proposals/new?clientId=${id}`)}
              >
                <Icon name="plus" size={15} />
                New Proposal
              </Button>
            </div>
          </div>

          {/* Minimal Key Metrics Across Full Screen */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%' }}>
            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <span className="stat-card__label">Active Projects</span>
              <strong>{activeProjects}</strong>
            </div>
            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <span className="stat-card__label">Open Invoices</span>
              <strong>{openInvoices}</strong>
            </div>
            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <span className="stat-card__label">Total Proposals</span>
              <strong>{proposals?.length || 0}</strong>
            </div>
          </div>

          {/* Business Particulars & Quick Actions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', width: '100%', alignItems: 'start' }}>
            {/* Particulars in a White Panel */}
            <div className="panel" style={{ background: '#ffffff', padding: '1.8rem 2rem', borderRadius: '1.25rem', border: '1px solid rgba(20,20,20,0.1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--vx-font-display)' }}>
                Particulars
              </h3>
              <dl className="detail-list" style={{ display: 'grid', gap: '1.2rem' }}>
                <div>
                  <dt>Contact Person</dt>
                  <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>{client.contactName || "—"}</dd>
                </div>
                <div>
                  <dt>Direct Phone</dt>
                  <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>
                    {client.phone ? <a href={`tel:${client.phone}`}>{client.phone}</a> : "—"}
                  </dd>
                </div>
                <div>
                  <dt>Website</dt>
                  <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>
                    {client.website ? (
                      <a href={client.website.startsWith("http") ? client.website : `https://${client.website}`} target="_blank" rel="noopener noreferrer" className="vx-text-link">
                        {client.website.replace(/^https?:\/\//, "")}
                        <Icon name="external" size={12} style={{ marginLeft: '4px' }} />
                      </a>
                    ) : "—"}
                  </dd>
                </div>
                <div>
                  <dt>Client Since</dt>
                  <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>{date(client.createdAt)}</dd>
                </div>
              </dl>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--vx-font-display)' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem', width: '100%' }}>
                <button
                  type="button"
                  className="client-dialog__quick-link"
                  onClick={() => router.push(`/dashboard/proposals?clientId=${id}`)}
                >
                  <Icon name="file" size={16} />
                  <span>
                    <strong>Proposals</strong>
                    <small>{proposals?.length || 0} document{proposals?.length === 1 ? '' : 's'}</small>
                  </span>
                  <Icon name="chevron-right" size={14} />
                </button>

                <button
                  type="button"
                  className="client-dialog__quick-link"
                  onClick={() => router.push(`/dashboard/invoices?clientId=${id}`)}
                >
                  <Icon name="receipt" size={16} />
                  <span>
                    <strong>Invoices</strong>
                    <small>{invoices?.length || 0} document{invoices?.length === 1 ? '' : 's'}</small>
                  </span>
                  <Icon name="chevron-right" size={14} />
                </button>

                <button
                  type="button"
                  className="client-dialog__quick-link"
                  onClick={() => router.push(`/dashboard/projects?clientId=${id}`)}
                >
                  <Icon name="briefcase" size={16} />
                  <span>
                    <strong>Projects</strong>
                    <small>{projects?.length || 0} active / past</small>
                  </span>
                  <Icon name="chevron-right" size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          {client.notes && (
            <div className="panel" style={{ background: '#ffffff', borderRadius: '1.25rem', padding: '1.8rem 2rem', border: '1px solid rgba(20,20,20,0.1)', width: '100%' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.6rem' }}>Internal Context</h3>
              <p style={{ color: 'var(--vx-muted)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {client.notes}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', width: '100%' }}>
            <h2 style={{ fontFamily: 'var(--vx-font-display)', fontSize: '1.8rem', fontWeight: 800 }}>
              Edit Client Particulars
            </h2>
            <Button
              variant="ghost"
              className="vx-button vx-button--secondary vx-button--md"
              onClick={() => setEditing(false)}
            >
              Cancel Edit
            </Button>
          </div>

          <form onSubmit={save} className="form panel" style={{ borderRadius: '1.25rem', padding: '2rem', width: '100%', background: '#ffffff' }}>
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span>Legal Business Name *</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>

              <label className="field">
                <span>Contact Name</span>
                <input value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </label>

              <label className="field">
                <span>Primary Email *</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>

              <label className="field">
                <span>Phone Number</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>

              <label className="field">
                <span>Country</span>
                <input value={country} onChange={(e) => setCountry(e.target.value)} />
              </label>

              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span>Website</span>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
              </label>

              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span>Internal Notes</span>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} />
              </label>
            </div>

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <Button type="button" variant="ghost" className="vx-button vx-button--secondary vx-button--md" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" className="vx-button vx-button--primary vx-button--md" loading={busy}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
