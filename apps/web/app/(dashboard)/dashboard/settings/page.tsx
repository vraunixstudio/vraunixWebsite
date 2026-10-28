"use client";

import { useState, useEffect } from "react";
import type { Settings } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useApiResource } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/dashboard/feedback";
import { ErrorState, Spinner } from "@/components/ui/states";
import { Icon } from "@/components/icons";
import { DEFAULT_PROPOSAL_ABOUT_TEMPLATE, PROPOSAL_TEMPLATES } from "@vraunix/shared";

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
        method: "PATCH",
        body: formData,
      });
      setToast({ tone: "success", message: "Studio settings and proposal templates saved successfully." });
      reload();
    } catch (cause) {
      setToast({ tone: "danger", message: cause instanceof ApiError ? cause.message : "Could not save settings" });
    } finally {
      setBusy(false);
    }
  }

  function applyPreset(aboutText: string) {
    setFormData((prev) => ({
      ...prev,
      proposal: {
        ...(prev.proposal ?? { prefix: "VX-PRP", validityDays: 30 }),
        defaultAbout: aboutText,
      },
    }));
    setToast({ tone: "success", message: "Template preset loaded into Proposal About field. Click Save below to apply." });
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
            Configure studio identity, document defaults, and customize the auto-applied proposal templates.
          </p>
        </div>
      </div>

      <form onSubmit={submit} style={{ display: 'grid', gap: '2rem', width: '100%' }}>
        {/* Company Profile Panel */}
        <div className="form panel" style={{ borderRadius: '1.25rem', padding: '2.5rem', width: '100%', background: '#ffffff', border: '1px solid rgba(20,20,20,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            Company Profile & Branding
          </h2>
          <p style={{ color: 'var(--vx-muted)', fontSize: '0.85rem', marginBottom: '1.8rem' }}>
            These details appear on your generated invoices, client proposals, and system documents.
          </p>

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
              <span>Location / Address</span>
              <input
                value={formData.company?.location ?? ""}
                onChange={(e) => setFormData({ ...formData, company: { ...formData.company!, location: e.target.value } })}
              />
            </label>

            <label className="field">
              <span>Website URL</span>
              <input
                value={formData.company?.website ?? ""}
                onChange={(e) => setFormData({ ...formData, company: { ...formData.company!, website: e.target.value } })}
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

            <label className="field" style={{ gridColumn: '1 / -1' }}>
              <span>Default Invoice Payment Terms & Instructions</span>
              <textarea
                value={formData.invoice?.paymentTerms ?? ""}
                onChange={(e) => setFormData({ ...formData, invoice: { ...formData.invoice!, paymentTerms: e.target.value } })}
                rows={3}
                placeholder="Bank transfer details, accepted payment methods, and due terms..."
              />
            </label>
          </div>
        </div>

        {/* Proposal Templates & Defaults Panel */}
        <div className="form panel" style={{ borderRadius: '1.25rem', padding: '2.5rem', width: '100%', background: '#ffffff', border: '1px solid rgba(20,20,20,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Icon name="file" size={20} />
                Proposal Defaults & Auto-Applied Template
              </h2>
              <p style={{ color: 'var(--vx-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                This template is automatically applied to the &ldquo;About / Project Overview&rdquo; section of every new proposal. You can edit this default template anytime.
              </p>
            </div>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem' }}>
            <label className="field">
              <span>Proposal Number Prefix *</span>
              <input
                value={formData.proposal?.prefix ?? "VX-PRP"}
                onChange={(e) => setFormData({ ...formData, proposal: { ...(formData.proposal ?? { prefix: "VX-PRP", validityDays: 30 }), prefix: e.target.value } })}
                required
              />
            </label>

            <label className="field">
              <span>Proposal Validity (Days) *</span>
              <input
                type="number"
                min={1}
                max={365}
                value={formData.proposal?.validityDays ?? 30}
                onChange={(e) => setFormData({ ...formData, proposal: { ...(formData.proposal ?? { prefix: "VX-PRP", validityDays: 30 }), validityDays: Number(e.target.value) } })}
                required
              />
            </label>

            {/* Template Preset Selector */}
            <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--vx-color-ink)' }}>
                  Load Template Presets into Default:
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--vx-muted)' }}>
                  Clicking a preset will load its text below for you to review and edit
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => applyPreset(DEFAULT_PROPOSAL_ABOUT_TEMPLATE)}
                  className="vx-button vx-button--secondary vx-button--sm"
                  style={{ fontSize: '0.8rem' }}
                >
                  Standard Studio Default
                </button>
                {PROPOSAL_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => applyPreset(tmpl.about)}
                    className="vx-button vx-button--secondary vx-button--sm"
                    style={{ fontSize: '0.8rem' }}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Proposal About Field */}
            <label className="field" style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Auto-Applied Proposal &ldquo;About&rdquo; Template *</span>
                <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600 }}>Auto-applies to new proposals</span>
              </div>
              <textarea
                value={formData.proposal?.defaultAbout ?? DEFAULT_PROPOSAL_ABOUT_TEMPLATE}
                onChange={(e) => setFormData({ ...formData, proposal: { ...(formData.proposal ?? { prefix: "VX-PRP", validityDays: 30 }), defaultAbout: e.target.value } })}
                rows={9}
                style={{ fontFamily: 'var(--vx-font-sans)', lineHeight: 1.6 }}
                placeholder="Enter the default proposal introduction, strategy, and quality standards..."
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--vx-muted)', marginTop: '0.35rem' }}>
                Markdown headings (###) and paragraphs are supported and will render with executive Swiss typography on the generated PDF.
              </span>
            </label>

            <label className="field" style={{ gridColumn: '1 / -1' }}>
              <span>Default Proposal Terms & Conditions</span>
              <textarea
                value={formData.proposal?.defaultTerms ?? ""}
                onChange={(e) => setFormData({ ...formData, proposal: { ...(formData.proposal ?? { prefix: "VX-PRP", validityDays: 30 }), defaultTerms: e.target.value } })}
                rows={4}
                placeholder="Standard commercial and delivery terms included on proposal acceptance..."
              />
            </label>
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="form-actions" style={{ justifyContent: 'flex-end', display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Button type="submit" className="vx-button vx-button--primary vx-button--md" loading={busy}>
            Save All Studio Settings
            <Icon name="check" size={16} style={{ marginLeft: '4px' }} />
          </Button>
        </div>
      </form>
    </div>
  );
}
