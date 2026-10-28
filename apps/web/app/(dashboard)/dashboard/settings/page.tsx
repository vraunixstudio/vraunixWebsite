"use client";

import { useState, useEffect } from "react";
import type { Settings } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useApiResource } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/dashboard/feedback";
import { ErrorState, Spinner } from "@/components/ui/states";
import { Icon } from "@/components/icons";

export default function SettingsPage() {
  const { data: settings, loading, error, reload } = useApiResource<Settings>("/settings");
  const [formData, setFormData] = useState<Partial<Settings>>({});
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setToast(null);
    try {
      await api("/settings", {
        method: "PUT",
        body: formData,
      });
      setToast({ tone: "success", message: "Settings saved successfully." });
      reload();
    } catch (cause) {
      setToast({ tone: "danger", message: cause instanceof ApiError ? cause.message : "Could not save settings" });
    } finally {
      setBusy(false);
    }
  }

  if (loading && !settings) return <Spinner label="Loading settings" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="dashboard-page settings-page" style={{ width: '100%' }}>
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', width: '100%' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.1 }}>
            Studio Settings
          </h1>
          <p style={{ color: 'var(--vx-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Configure enterprise parameters, company profile, and document defaults.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="form panel" style={{ borderRadius: '1.25rem', padding: '2.5rem', width: '100%', background: '#ffffff', border: '1px solid rgba(20,20,20,0.1)' }}>
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem' }}>
          <label className="field">
            <span>Company Name *</span>
            <input
              value={formData.company?.name ?? ""}
              onChange={(e) => setFormData({ ...formData, company: { ...formData.company!, name: e.target.value } })}
              required
            />
          </label>

          <label className="field">
            <span>Company Slogan</span>
            <input
              value={formData.company?.slogan ?? ""}
              onChange={(e) => setFormData({ ...formData, company: { ...formData.company!, slogan: e.target.value } })}
            />
          </label>

          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Company Description</span>
            <textarea
              value={formData.company?.description ?? ""}
              onChange={(e) => setFormData({ ...formData, company: { ...formData.company!, description: e.target.value } })}
              rows={3}
            />
          </label>

          <label className="field">
            <span>Contact Email *</span>
            <input
              type="email"
              value={formData.company?.email ?? ""}
              onChange={(e) => setFormData({ ...formData, company: { ...formData.company!, email: e.target.value } })}
              required
            />
          </label>

          <label className="field">
            <span>Contact Phone</span>
            <input
              value={formData.company?.phone ?? ""}
              onChange={(e) => setFormData({ ...formData, company: { ...formData.company!, phone: e.target.value } })}
            />
          </label>

          <label className="field">
            <span>Default Tax Rate (%)</span>
            <input
              value={formData.tax?.defaultRatePercent ?? ""}
              onChange={(e) => setFormData({ ...formData, tax: { ...formData.tax!, defaultRatePercent: e.target.value } })}
            />
          </label>

          <label className="field">
            <span>Tax Label</span>
            <input
              value={formData.tax?.label ?? ""}
              onChange={(e) => setFormData({ ...formData, tax: { ...formData.tax!, label: e.target.value } })}
            />
          </label>

          <label className="field">
            <span>Invoice Prefix</span>
            <input
              value={formData.invoice?.prefix ?? ""}
              onChange={(e) => setFormData({ ...formData, invoice: { ...formData.invoice!, prefix: e.target.value } })}
            />
          </label>

          <label className="field">
            <span>Proposal Prefix</span>
            <input
              value={formData.proposal?.prefix ?? ""}
              onChange={(e) => setFormData({ ...formData, proposal: { ...formData.proposal!, prefix: e.target.value } })}
            />
          </label>
        </div>

        <div className="form-actions" style={{ marginTop: '2.5rem', justifyContent: 'flex-end', display: 'flex', gap: '1rem' }}>
          <Button type="submit" className="vx-button vx-button--primary vx-button--md" loading={busy}>
            Save Studio Settings
            <Icon name="check" size={16} style={{ marginLeft: '4px' }} />
          </Button>
        </div>
      </form>
    </div>
  );
}
