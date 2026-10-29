"use client";

import { use, useEffect, useRef, useState } from "react";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "@vraunix/shared";
import type { Invoice, Payment, Client } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { invalidateApiCache, useApiResource } from "@/lib/use-api";
import { money, date, fromMinor, titleCase } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/dashboard/feedback";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Icon } from "@/components/icons";
import {
  InvoiceDetailSkeleton,
  InvoicePaymentsSkeleton,
} from "@/components/dashboard/page-skeletons";

function createPaymentKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `payment-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {
    data: invoice,
    loading,
    error,
    reload,
    mutate,
  } = useApiResource<Invoice>(`/invoices/${id}`);
  const { data: client } = useApiResource<Client>(invoice ? `/clients/${invoice.clientId}` : null);
  const payments = useApiResource<Payment[]>(`/payments?invoiceId=${id}`);

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const paymentKey = useRef<string | null>(null);

  useEffect(() => {
    paymentKey.current = null;
    setAmount("");
    setToast(null);
  }, [id]);

  async function run(action: () => Promise<unknown>, success: string): Promise<boolean> {
    setBusy(true);
    setToast(null);
    try {
      await action();
      invalidateApiCache("/invoices");
      invalidateApiCache("/payments");
      setToast({ tone: "success", message: success });
      reload();
      payments.reload();
      return true;
    } catch (cause) {
      setToast({ tone: "danger", message: cause instanceof ApiError ? cause.message : "Action failed" });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function recordPayment(event: React.FormEvent) {
    event.preventDefault();
    if (!invoice) return;

    const value = Number(amount);
    const amountMinor = Math.round(value * 100);
    if (!Number.isFinite(value) || amountMinor <= 0) {
      setToast({ tone: "danger", message: "Enter a payment amount greater than zero." });
      return;
    }
    if (amountMinor > invoice.balanceMinor) {
      setToast({ tone: "danger", message: "Payment cannot exceed the remaining balance." });
      return;
    }

    const previousInvoice = invoice;
    const nextPaidMinor = (invoice.amountPaidMinor ?? 0) + amountMinor;
    const nextBalanceMinor = Math.max(0, invoice.totalMinor - nextPaidMinor);
    const key = paymentKey.current ?? createPaymentKey();
    paymentKey.current = key;

    mutate((current) =>
      current
        ? {
            ...current,
            amountPaidMinor: nextPaidMinor,
            balanceMinor: nextBalanceMinor,
            status: nextBalanceMinor === 0 ? "paid" : "partially_paid",
          }
        : current
    );

    const recorded = await run(
      () => api("/payments", {
        method: "POST",
        body: {
          invoiceId: id,
          amount: value.toFixed(2),
          method,
          receivedAt: new Date().toISOString().slice(0, 10),
          idempotencyKey: key,
        },
      }),
      "Payment recorded and applied."
    );

    if (recorded) {
      setAmount("");
      paymentKey.current = null;
    } else {
      mutate(previousInvoice);
    }
  }

  if (loading && !invoice) return <InvoiceDetailSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!invoice) return <EmptyState icon="receipt" title="Invoice not found" />;

  const statusTone: Record<string, "info" | "success" | "warning" | "danger"> = {
    draft: "warning",
    issued: "info",
    partially_paid: "warning",
    paid: "success",
    overdue: "danger",
    void: "danger",
  };
  const paymentTone: Record<Payment["verificationStatus"], "success" | "warning" | "danger"> = {
    verified: "success",
    pending: "warning",
    rejected: "danger",
  };

  return (
    <div className="dashboard-page invoice-detail-page" style={{ width: '100%' }}>
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}

      <div style={{ display: 'grid', gap: '2.5rem', width: '100%' }}>
        {/* Top Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.1 }}>
              {invoice.number}
            </h1>
            <p style={{ color: 'var(--vx-muted)', fontSize: '0.95rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`vx-badge vx-badge--${statusTone[invoice.status] ?? "info"}`}>
                {invoice.status.replace('_', ' ')}
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
              className="vx-button vx-button--secondary vx-button--md"
              onClick={() => window.open(`/api/v1/invoices/${id}/pdf`, '_blank')}
            >
              <Icon name="download" size={15} />
              Download PDF
            </Button>
            {invoice.status === "draft" && (
              <Button
                className="vx-button vx-button--primary vx-button--md"
                onClick={() => run(() => api(`/invoices/${id}/issue`, { method: "POST" }), "Invoice issued.")}
                loading={busy}
              >
                <Icon name="send" size={15} />
                Issue Invoice
              </Button>
            )}
          </div>
        </div>

        {/* Minimal Key Metrics */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%' }}>
          <div className="stat-card" style={{ padding: '1.5rem' }}>
            <span className="stat-card__label">Total Amount</span>
            <strong className="vx-tabular">{money(invoice.totalMinor, invoice.currency)}</strong>
          </div>
          <div className="stat-card" style={{ padding: '1.5rem' }}>
            <span className="stat-card__label">Amount Paid</span>
            <strong className="vx-tabular">{money(invoice.amountPaidMinor || 0, invoice.currency)}</strong>
          </div>
          <div className="stat-card" style={{ padding: '1.5rem' }}>
            <span className="stat-card__label">Balance Due</span>
            <strong className="vx-tabular">{money(invoice.balanceMinor, invoice.currency)}</strong>
          </div>
        </div>

        {/* Particulars & Payments Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', width: '100%', alignItems: 'start' }}>
          {/* Particulars White Container */}
          <div className="panel" style={{ background: '#ffffff', padding: '1.8rem 2rem', borderRadius: '1.25rem', border: '1px solid rgba(20,20,20,0.1)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--vx-font-display)' }}>
              Particulars
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
              <div>
                <dt>Issue Date</dt>
                <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>{date(invoice.issueDate)}</dd>
              </div>
              <div>
                <dt>Due Date</dt>
                <dd style={{ fontWeight: 600, marginTop: '0.2rem' }}>{date(invoice.dueDate)}</dd>
              </div>
            </dl>
          </div>

          {/* Record Payment or Payment Records */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {!["draft", "void"].includes(invoice.status) && invoice.balanceMinor > 0 && (
              <form onSubmit={recordPayment} className="panel payment-form">
                <h3 className="payment-form__title">Record Payment</h3>
                <div className="payment-form__grid">
                  <label className="field">
                    <span>Amount ({invoice.currency}) *</span>
                    <input
                      className="vx-tabular"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      min="0.01"
                      max={fromMinor(invoice.balanceMinor, invoice.currency)}
                      step="0.01"
                      inputMode="decimal"
                    />
                  </label>

                  <label className="field">
                    <span>Payment Method</span>
                    <select value={method} onChange={(e) => setMethod(e.target.value)}>
                      {PAYMENT_METHODS.map((value) => (
                        <option key={value} value={value}>
                          {PAYMENT_METHOD_LABELS[value]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="payment-form__footer">
                  <p className="payment-form__remaining">
                    Remaining balance
                    <strong className="vx-tabular">{money(invoice.balanceMinor, invoice.currency)}</strong>
                  </p>
                  <Button type="submit" className="vx-button vx-button--primary vx-button--md" loading={busy}>
                    Record Payment
                  </Button>
                </div>
              </form>
            )}

            <div className="panel" style={{ background: '#ffffff', padding: '1.8rem 2rem', borderRadius: '1.25rem', border: '1px solid rgba(20,20,20,0.1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--vx-font-display)' }}>
                Payment History
              </h3>
              {payments.loading ? (
                <InvoicePaymentsSkeleton />
              ) : !payments.data || payments.data.length === 0 ? (
                <p style={{ color: 'var(--vx-muted)', fontSize: '0.9rem' }}>No payments recorded yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                  {payments.data.map((p) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(20,20,20,0.06)' }}>
                      <div>
                        <strong className="vx-tabular" style={{ fontSize: '0.95rem' }}>{money(p.amountMinor, p.currency)}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--vx-muted)' }}>
                          {p.number} · {p.method.replace(/_/g, ' ')} · {date(p.receivedAt)}
                          {p.reference ? ` · ${p.reference}` : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                        <span className={`vx-badge vx-badge--${paymentTone[p.verificationStatus] ?? 'info'}`}>
                          {titleCase(p.verificationStatus)}
                        </span>
                        {p.verificationStatus === 'pending' && (
                          <Button
                            type="button"
                            className="vx-button vx-button--secondary vx-button--sm"
                            onClick={() => run(
                              () => api(`/payments/${p.id}/verify`, { method: 'POST' }),
                              'Payment verified and applied.'
                            )}
                            loading={busy}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Line Items */}
        {invoice.lineItems && invoice.lineItems.length > 0 && (
          <div className="panel" style={{ background: '#ffffff', borderRadius: '1.25rem', padding: '1.8rem 2rem', border: '1px solid rgba(20,20,20,0.1)', width: '100%' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>Billed Line Items</h3>
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {invoice.lineItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid rgba(20,20,20,0.06)' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{item.description}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--vx-muted)' }}>Qty: {item.quantity}</div>
                  </div>
                  <strong className="vx-tabular" style={{ fontSize: '0.95rem' }}>{money(item.amountMinor, invoice.currency)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
