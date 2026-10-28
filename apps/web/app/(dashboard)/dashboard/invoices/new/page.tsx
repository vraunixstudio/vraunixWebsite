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

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clients = useApiResource<Client[]>("/clients?limit=100");

  const [clientId, setClientId] = useState(searchParams.get("clientId") ?? "");
  const [projectId, setProjectId] = useState(searchParams.get("projectId") ?? "");
  const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [taxRate, setTaxRate] = useState("0");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setToast(null);
    try {
      const result = await api<{ id: string }>("/invoices", {
        method: "POST",
        body: {
          clientId,
          projectId: projectId || undefined,
          currency,
          issueDate: new Date().toISOString().slice(0, 10),
          dueDate,
          lineItems: [{ description, quantity, unitPrice }],
          taxRatePercent: taxRate,
          notes: notes || undefined,
        },
      });
      router.push(`/dashboard/invoices/${result.data.id}`);
    } catch (cause) {
      setToast({ tone: "danger", message: cause instanceof ApiError ? cause.message : "Could not create invoice" });
      setBusy(false);
    }
  }

  if (clients.loading && !clients.data) return <Spinner label="Loading clients" />;
  if (clients.error) return <ErrorState message={clients.error} />;

  return (
    <div className="dashboard-page new-invoice-page" style={{ width: '100%' }}>
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', width: '100%' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.1 }}>
            New Invoice
          </h1>
          <p style={{ color: 'var(--vx-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Generate a billable payment request for your client.
          </p>
        </div>

        <Button
          variant="ghost"
          className="vx-button vx-button--secondary vx-button--md"
          onClick={() => router.push("/dashboard/invoices")}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={submit} className="form panel" style={{ borderRadius: '1.25rem', padding: '2.5rem', width: '100%', background: '#ffffff', border: '1px solid rgba(20,20,20,0.1)' }}>
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem' }}>
          <label className="field">
            <span>Target Client *</span>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
              <option value="">Choose a client</option>
              {clients.data?.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Payment Due Date *</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </label>

          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Line Item Description *</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="e.g. Phase 1 Web Application Development"
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', gridColumn: '1 / -1' }}>
            <label className="field">
              <span>Quantity</span>
              <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" />
            </label>

            <label className="field">
              <span>Currency</span>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {CURRENCY_CODES.map((code) => <option key={code} value={code}>{code}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Unit Price</span>
              <input
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                inputMode="decimal"
                placeholder="0.00"
              />
            </label>
          </div>

          <label className="field">
            <span>Tax Rate (%)</span>
            <input value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="0" />
          </label>

          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Billing Notes & Terms</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Bank transfer details or payment instructions..."
            />
          </label>
        </div>

        <div className="form-actions" style={{ marginTop: '2.5rem', justifyContent: 'flex-end', display: 'flex', gap: '1rem' }}>
          <Button
            type="button"
            variant="ghost"
            className="vx-button vx-button--secondary vx-button--md"
            onClick={() => router.push("/dashboard/invoices")}
          >
            Cancel
          </Button>
          <Button type="submit" className="vx-button vx-button--primary vx-button--md" loading={busy}>
            Issue Invoice
            <Icon name="plus" size={16} style={{ marginLeft: '4px' }} />
          </Button>
        </div>
      </form>
    </div>
  );
}
