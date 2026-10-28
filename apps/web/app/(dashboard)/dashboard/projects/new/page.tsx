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

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clients = useApiResource<Client[]>("/clients?limit=100");

  const [clientId, setClientId] = useState(searchParams.get("clientId") ?? "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planning");
  const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [price, setPrice] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setToast(null);
    try {
      const result = await api<{ id: string }>("/projects", {
        method: "POST",
        body: {
          clientId,
          name,
          description: description || undefined,
          status,
          currency,
          priceMinor: price ? Math.round(Number(price) * 100) : 0,
          targetDate: targetDate || undefined,
          deliverables: deliverables.split("\n").map((d) => d.trim()).filter(Boolean),
          milestones: [],
        },
      });
      router.push(`/dashboard/projects/${result.data.id}`);
    } catch (cause) {
      setToast({ tone: "danger", message: cause instanceof ApiError ? cause.message : "Could not create project" });
      setBusy(false);
    }
  }

  if (clients.loading && !clients.data) return <Spinner label="Loading clients" />;
  if (clients.error) return <ErrorState message={clients.error} />;

  return (
    <div className="dashboard-page new-project-page" style={{ width: '100%' }}>
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', width: '100%' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.1 }}>
            New Project Track
          </h1>
          <p style={{ color: 'var(--vx-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Initialize a development track and scope deliverables for a client.
          </p>
        </div>

        <Button
          variant="ghost"
          className="vx-button vx-button--secondary vx-button--md"
          onClick={() => router.push("/dashboard/projects")}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={submit} className="form panel" style={{ borderRadius: '1.25rem', padding: '2.5rem', width: '100%', background: '#ffffff', border: '1px solid rgba(20,20,20,0.1)' }}>
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem' }}>
          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Project Name *</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              placeholder="e.g. Enterprise Web Platform"
            />
          </label>

          <label className="field">
            <span>Client *</span>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
              <option value="">Choose a client</option>
              {clients.data?.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Production Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="client_review">Client Review</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
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
              <span>Valuation Price</span>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
                placeholder="0.00"
              />
            </label>
          </div>

          <label className="field">
            <span>Target Delivery Date</span>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </label>

          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Deliverables (One per line)</span>
            <textarea
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              rows={5}
              placeholder="Design System Architecture&#10;Frontend & Backend Integration&#10;Security & Performance Audit"
            />
          </label>

          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Project Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide a summary of goals and context for this track..."
            />
          </label>
        </div>

        <div className="form-actions" style={{ marginTop: '2.5rem', justifyContent: 'flex-end', display: 'flex', gap: '1rem' }}>
          <Button
            type="button"
            variant="ghost"
            className="vx-button vx-button--secondary vx-button--md"
            onClick={() => router.push("/dashboard/projects")}
          >
            Cancel
          </Button>
          <Button type="submit" className="vx-button vx-button--primary vx-button--md" loading={busy}>
            Create Project Track
            <Icon name="plus" size={16} style={{ marginLeft: '4px' }} />
          </Button>
        </div>
      </form>
    </div>
  );
}
