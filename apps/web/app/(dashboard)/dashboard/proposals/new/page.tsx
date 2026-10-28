"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CURRENCY_CODES, DEFAULT_CURRENCY, DEFAULT_PROPOSAL_ABOUT_TEMPLATE, PROPOSAL_TEMPLATES } from "@vraunix/shared";
import type { Client, Settings } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useApiResource } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/dashboard/feedback";
import { ErrorState, Spinner } from "@/components/ui/states";
import { Icon } from "@/components/icons";

export default function NewProposalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clients = useApiResource<Client[]>("/clients?limit=100");
  const settings = useApiResource<Settings>("/settings");

  const [clientId, setClientId] = useState(searchParams.get("clientId") ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState("");
  const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [total, setTotal] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("default");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  // Auto-apply default template as soon as settings load
  useEffect(() => {
    if (settings.data && !description) {
      const defaultAbout = settings.data.proposal?.defaultAbout || DEFAULT_PROPOSAL_ABOUT_TEMPLATE;
      setDescription(defaultAbout);
    }
  }, [settings.data]);

  function handleTemplateSelect(templateId: string) {
    setSelectedTemplate(templateId);
    if (templateId === "default") {
      const defaultAbout = settings.data?.proposal?.defaultAbout || DEFAULT_PROPOSAL_ABOUT_TEMPLATE;
      setDescription(defaultAbout);
      setToast({ tone: "success", message: "Auto-applied studio default proposal template." });
    } else {
      const found = PROPOSAL_TEMPLATES.find((t) => t.id === templateId);
      if (found) {
        setDescription(found.about);
        if (!scope.trim()) {
          setScope(found.defaultScope.join("\n"));
        }
        setToast({ tone: "success", message: `Applied ${found.name} template.` });
      }
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setToast(null);
    try {
      const result = await api<{ id: string }>("/proposals", {
        method: "POST",
        body: {
          clientId,
          title,
          description: description || undefined,
          scope: scope.split("\n").map((s) => s.trim()).filter(Boolean),
          pricing: { currency, totalMinor: Math.round(Number(total || 0) * 100) },
        },
      });
      router.push(`/dashboard/proposals/${result.data.id}`);
    } catch (cause) {
      setToast({ tone: "danger", message: cause instanceof ApiError ? cause.message : "Could not create proposal" });
      setBusy(false);
    }
  }

  if (clients.loading && !clients.data) return <Spinner label="Loading clients" />;
  if (clients.error) return <ErrorState message={clients.error} />;

  return (
    <div className="dashboard-page new-proposal-page" style={{ width: '100%' }}>
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', width: '100%' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.1 }}>
            New Proposal
          </h1>
          <p style={{ color: 'var(--vx-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Draft a clear service scope and pricing agreement with auto-applied templates.
          </p>
        </div>

        <Button
          variant="ghost"
          className="vx-button vx-button--secondary vx-button--md"
          onClick={() => router.push("/dashboard/proposals")}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={submit} className="form panel" style={{ borderRadius: '1.25rem', padding: '2.5rem', width: '100%', background: '#ffffff', border: '1px solid rgba(20,20,20,0.1)' }}>
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem' }}>
          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Proposal Title *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={2}
              placeholder="e.g. Next-Generation Web Platform & Brand Strategy"
            />
          </label>

          <label className="field">
            <span>Target Client *</span>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
              <option value="">Choose a client</option>
              {clients.data?.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <label className="field">
              <span>Currency</span>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {CURRENCY_CODES.map((code) => <option key={code} value={code}>{code}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Valuation Total</span>
              <input
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                inputMode="decimal"
                placeholder="0.00"
              />
            </label>
          </div>

          {/* Template Bar */}
          <div style={{ gridColumn: '1 / -1', background: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '0.875rem', border: '1px solid rgba(20,20,20,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--vx-color-ink)' }}>
                  Proposal &ldquo;About&rdquo; Template
                </span>
                <span className="vx-badge vx-badge--success" style={{ fontSize: '0.72rem', textTransform: 'none' }}>
                  Auto-Applied
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--vx-muted)' }}>
                You can select a different preset or edit the text directly below
              </span>
            </div>

            <div style={{ marginBottom: '0.8rem' }}>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(20,20,20,0.2)', fontSize: '0.85rem', minWidth: '250px', background: '#ffffff' }}
              >
                <option value="default">Studio Default Template</option>
                {PROPOSAL_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Proposal About / Overview Field */}
          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
              <span>Proposal &ldquo;About&rdquo; & Project Overview *</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--vx-muted)' }}>
                Editable text — customize freely for this client
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              style={{ lineHeight: 1.6 }}
              placeholder="Outline project objectives, strategic approach, and quality standards..."
            />
          </label>

          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Scope Deliverables (One per line)</span>
            <textarea
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              rows={5}
              placeholder="Custom UI/UX Design System&#10;Next.js Web Application Development&#10;SEO Optimization & Launch Support"
            />
          </label>
        </div>

        <div className="form-actions" style={{ marginTop: '2.5rem', justifyContent: 'flex-end', display: 'flex', gap: '1rem' }}>
          <Button
            type="button"
            variant="ghost"
            className="vx-button vx-button--secondary vx-button--md"
            onClick={() => router.push("/dashboard/proposals")}
          >
            Cancel
          </Button>
          <Button type="submit" className="vx-button vx-button--primary vx-button--md" loading={busy}>
            Create & Save Proposal
            <Icon name="plus" size={16} style={{ marginLeft: '4px' }} />
          </Button>
        </div>
      </form>
    </div>
  );
}
