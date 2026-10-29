"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Project, Client, Proposal } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useApiResource } from "@/lib/use-api";
import { date, money } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/dashboard/feedback";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Icon } from "@/components/icons";
import { ProjectDetailSkeleton } from "@/components/dashboard/page-skeletons";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: project, loading, error, reload } = useApiResource<Project>(`/projects/${id}`);
  const { data: client } = useApiResource<Client>(project ? `/clients/${project.clientId}` : null);
  const { data: proposal } = useApiResource<Proposal>(project?.proposalId ? `/proposals/${project.proposalId}` : null);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  useEffect(() => {
    if (project && !editing) {
      setName(project.name);
      setDescription(project.description ?? "");
      setStatus(project.status);
      setTargetDate(project.targetDate?.split('T')[0] ?? "");
    }
  }, [project, editing]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setToast(null);
    try {
      await api(`/projects/${id}`, {
        method: "PATCH",
        body: { name, description, status, targetDate: targetDate || undefined }
      });
      setEditing(false);
      setToast({ tone: "success", message: "Project tracked successfully." });
      reload();
    } catch (cause) {
      setToast({ tone: "danger", message: cause instanceof ApiError ? cause.message : "Update failed" });
    } finally {
      setBusy(false);
    }
  }

  if (loading && !project) return <ProjectDetailSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!project) return <EmptyState icon="briefcase" title="Project not found" />;

  const statusTone: Record<string, "info" | "success" | "warning" | "danger"> = {
    planning: "info",
    in_progress: "warning",
    client_review: "info",
    completed: "success",
    on_hold: "warning",
    cancelled: "danger",
  };

  return (
    <div className="dashboard-page project-detail-page" style={{ width: '100%' }}>
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}

      {!editing ? (
        <div style={{ display: 'grid', gap: '2.5rem', width: '100%' }}>
          {/* Top Title & Inline Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.1 }}>
                {project.name}
              </h1>
              <p style={{ color: 'var(--vx-muted)', fontSize: '0.95rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`vx-badge vx-badge--${statusTone[project.status] ?? "info"}`}>
                  {project.status.replace('_', ' ')}
                </span>
                {client && (
                  <>
                    <span>·</span>
                    <a href={`/dashboard/clients/${client.id}`} className="vx-text-link">{client.name}</a>
                  </>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Button
                className="vx-button vx-button--primary vx-button--md"
                onClick={() => router.push(`/dashboard/invoices/new?clientId=${project.clientId}&projectId=${project.id}`)}
              >
                <Icon name="receipt" size={15} />
                Create Invoice
              </Button>
            </div>
          </div>

          {/* Minimal Key Metrics */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%' }}>
            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <span className="stat-card__label">Project Value</span>
              <strong>{money(project.priceMinor ?? 0, project.currency)}</strong>
            </div>
            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <span className="stat-card__label">Target Date</span>
              <strong style={{ fontSize: '1.5rem' }}>{project.targetDate ? date(project.targetDate) : "—"}</strong>
            </div>
            <div className="stat-card" style={{ padding: '1.5rem' }}>
              <span className="stat-card__label">Milestones</span>
              <strong>{project.milestones?.length || 0}</strong>
            </div>
          </div>

          {/* Project Particulars & Deliverables Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', width: '100%', alignItems: 'start' }}>
            {/* Particulars White Container */}
            <div className="panel" style={{ background: '#ffffff', padding: '1.8rem 2rem', borderRadius: '1.25rem', border: '1px solid rgba(20,20,20,0.1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--vx-font-display)' }}>
                Track Details
              </h3>
              <dl className="detail-list" style={{ display: 'grid', gap: '1.2rem' }}>
                <div>
                  <dt>Linked Client</dt>
                  <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>
                    {client ? (
                      <a href={`/dashboard/clients/${client.id}`} className="vx-text-link">
                        {client.name}
                        <Icon name="external" size={12} style={{ marginLeft: '4px' }} />
                      </a>
                    ) : "—"}
                  </dd>
                </div>
                {proposal && (
                  <div>
                    <dt>Source Proposal</dt>
                    <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>
                      <a href={`/dashboard/proposals/${proposal.id}`} className="vx-text-link">
                        {proposal.number}
                        <Icon name="external" size={12} style={{ marginLeft: '4px' }} />
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt>Start Date</dt>
                  <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>{date(project.createdAt)}</dd>
                </div>
                <div>
                  <dt>Last Active</dt>
                  <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>{date(project.updatedAt)}</dd>
                </div>
              </dl>
            </div>

            {/* Deliverables / Status summary */}
            <div className="panel" style={{ background: '#ffffff', padding: '1.8rem 2rem', borderRadius: '1.25rem', border: '1px solid rgba(20,20,20,0.1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--vx-font-display)' }}>
                Deliverables Track
              </h3>
              {project.deliverables && project.deliverables.length > 0 ? (
                <ul className="tick-list" style={{ display: 'grid', gap: '0.8rem' }}>
                  {project.deliverables.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <Icon name="check" size={16} style={{ marginTop: '2px', color: 'var(--vx-color-ink)' }} />
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--vx-muted)', fontSize: '0.9rem' }}>No defined deliverables listed for this track.</p>
              )}
            </div>
          </div>

          {/* Description / Summary */}
          {project.description && (
            <div className="panel" style={{ background: '#ffffff', borderRadius: '1.25rem', padding: '1.8rem 2rem', border: '1px solid rgba(20,20,20,0.1)', width: '100%' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.6rem' }}>Internal Context & Description</h3>
              <p style={{ color: 'var(--vx-muted)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {project.description}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', width: '100%' }}>
            <h2 style={{ fontFamily: 'var(--vx-font-display)', fontSize: '1.8rem', fontWeight: 800 }}>
              Edit Project Track
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
                <span>Track Name *</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>

              <label className="field">
                <span>Production Status</span>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="client_review">Client Review</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>

              <label className="field">
                <span>Target Delivery Date</span>
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
              </label>

              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span>Internal Description</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />
              </label>
            </div>

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <Button type="button" variant="ghost" className="vx-button vx-button--secondary vx-button--md" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" className="vx-button vx-button--primary vx-button--md" loading={busy}>
                Update Track
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
