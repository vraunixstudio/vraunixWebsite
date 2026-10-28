"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CURRENCY_CODES, DEFAULT_CURRENCY } from "@vraunix/shared";
import type { Client } from "@/lib/types";
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
  const [clientId, setClientId] = useState(searchParams.get("clientId") ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState("");
  const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [total, setTotal] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

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
            Draft a clear service scope and pricing agreement for your client.
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
              placeholder="e.g. Website Redesign & Brand Strategy"
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

          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Scope Deliverables (One per line)</span>
            <textarea
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              rows={5}
              placeholder="Custom UI/UX Design System&#10;Next.js Web Application Development&#10;SEO Optimization & Launch Support"
            />
          </label>

          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Terms & Summary Notes</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Outline project timeline, payment terms, or special conditions..."
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
