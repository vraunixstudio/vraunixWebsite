"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CURRENCY_CODES, DEFAULT_CURRENCY } from "@vraunix/shared";
import type { Client } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useApiResource } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/dashboard/feedback";
import { ErrorState } from "@/components/ui/states";
import { Icon } from "@/components/icons";
import { NewInvoicePageSkeleton } from "@/components/dashboard/page-skeletons";

type LineItem = {
  description: string;
  quantity: string;
  unitPrice: string;
};

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clients = useApiResource<Client[]>("/clients?limit=100");

  const [clientId, setClientId] = useState(searchParams.get("clientId") ?? "");
  const projectId = searchParams.get("projectId") ?? "";
  const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: "", quantity: "1", unitPrice: "" }]);
  const [taxRate, setTaxRate] = useState("0");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  function addLineItem() {
    setLineItems([...lineItems, { description: "", quantity: "1", unitPrice: "" }]);
  }

  function removeLineItem(index: number) {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  }

  function updateLineItem(index: number, field: keyof LineItem, value: string) {
    setLineItems((items) =>
      items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const next: LineItem = { ...item };
        next[field] = value;
        return next;
      })
    );
  }

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
          lineItems: lineItems.map((item) => ({
            description: item.description || "",
            quantity: item.quantity || "1",
            unitPrice: item.unitPrice || "0",
          })),
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

  if (clients.loading && !clients.data) return <NewInvoicePageSkeleton />;
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
            <span>Currency</span>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCY_CODES.map((code) => <option key={code} value={code}>{code}</option>)}
            </select>
          </label>

          <div style={{ gridColumn: '1 / -1', display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Line Items</span>
              <Button type="button" variant="ghost" onClick={addLineItem} className="vx-button vx-button--secondary vx-button--sm">
                <Icon name="plus" size={14} />
                Add Item
              </Button>
            </div>
            {lineItems.map((item, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                <label className="field">
                  <span>Description *</span>
                  <input value={item.description} onChange={(e) => updateLineItem(index, 'description', e.target.value)} required placeholder="Item description" />
                </label>
                <label className="field">
                  <span>Quantity</span>
                  <input value={item.quantity} onChange={(e) => updateLineItem(index, 'quantity', e.target.value)} placeholder="1" />
                </label>
                <label className="field">
                  <span>Unit Price</span>
                  <input value={item.unitPrice} onChange={(e) => updateLineItem(index, 'unitPrice', e.target.value)} inputMode="decimal" placeholder="0.00" />
                </label>
                <Button type="button" variant="ghost" onClick={() => removeLineItem(index)} disabled={lineItems.length === 1} className="vx-button vx-button--secondary vx-button--sm" style={{ marginBottom: '0.25rem' }}>
                  <Icon name="trash" size={14} />
                </Button>
              </div>
            ))}
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
