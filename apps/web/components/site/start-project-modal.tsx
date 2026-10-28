"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api, ApiError } from "@/lib/api";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";

type ContactResult = {
  reference: string;
  receivedAt: string;
};

type StartProjectModalProps = {
  open: boolean;
  onClose: () => void;
};

const SERVICES = [
  "Website Development",
  "UI / UX Design",
  "Web Applications",
  "Core Web Vitals",
  "Care & Scaling",
  "Architecture Audit",
];

const STAGES = [
  "New Project / MVP",
  "Redesign Site",
  "Feature Expansion",
  "Engineering Partner",
];

const BUDGETS = [
  "NPR 10k - 20k",
  "NPR 20k - 35k",
  "NPR 35k - 50k",
  "NPR 50k+",
];

const TIMELINES = [
  "Immediately",
  "Within 1 month",
  "1 - 3 months",
  "Exploring",
];

export function StartProjectModal({ open, onClose }: StartProjectModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  // Form state
  const [selectedServices, setSelectedServices] = useState<string[]>(["Website Development"]);
  const [selectedStage, setSelectedStage] = useState<string>("New Project / MVP");
  const [selectedBudget, setSelectedBudget] = useState<string>(BUDGETS[0]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>("Within 1 month");
  const [projectBrief, setProjectBrief] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(true);

  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!open || !mounted) return null;

  function handleClose() {
    onClose();
    if (status === "sent") {
      setStatus("idle");
      setReference(null);
      setError(null);
      setCurrentStep(1);
    }
  }

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.length > 1 ? prev.filter((s) => s !== service) : prev
        : [...prev, service]
    );
  }

  function handleNext() {
    setError(null);
    if (currentStep === 1) {
      if (selectedServices.length === 0) {
        setError("Please select at least one capability.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  }

  function handleBack() {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!name.trim()) { setError("Please provide your full name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please provide a valid email address."); return; }
    if (!privacyConsent) { setError("Please agree to the privacy notice."); return; }

    setStatus("sending");
    const fullMessage = [
      `[Selected Services: ${selectedServices.join(", ")}]`,
      `[Project Stage: ${selectedStage}]`,
      `[Budget Range: ${selectedBudget}]`,
      `[Target Timeline: ${selectedTimeline}]`,
      businessName ? `[Company / Brand: ${businessName}]` : "",
      phone ? `[Phone / Chat: ${phone}]` : "",
      projectBrief ? `\nProject Brief & Requirements:\n${projectBrief}` : "",
    ].filter(Boolean).join("\n");

    try {
      const result = await api<ContactResult>("/public/contact", {
        method: "POST",
        body: { name: name.trim(), email: email.trim(), businessName: businessName.trim() || undefined, phone: phone.trim() || undefined, message: fullMessage, privacyConsent: true },
      });
      setReference(result.data.reference);
      setStatus("sent");
    } catch (cause) {
      setStatus("idle");
      setError(cause instanceof ApiError ? cause.message : "Submission failed. Please try again.");
    }
  }

  const StepIndicator = ({ step }: { step: number }) => (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem' }}>
      {[1, 2, 3].map((s) => (
        <div key={s} style={{
          height: '3px',
          flex: 1,
          borderRadius: '1px',
          background: s <= step ? '#000' : 'rgba(20,20,20,0.06)',
          transition: 'background 0.4s ease'
        }} />
      ))}
    </div>
  );

  const ChoiceButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '0.75rem 1rem',
        borderRadius: '0.75rem',
        border: '1.5px solid',
        borderColor: active ? '#000' : 'rgba(20,20,20,0.08)',
        background: active ? '#000' : 'transparent',
        color: active ? '#fff' : '#000',
        textAlign: 'left',
        fontSize: '0.82rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,20,20,0.4)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'grid',
        placeItems: 'center',
        padding: '1.25rem',
        overflowY: 'auto'
      }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '540px',
          borderRadius: '1.75rem',
          border: '1px solid #000',
          boxShadow: '0 32px 80px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '2rem 2.25rem 0', textAlign: 'center' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vx-muted)', display: 'block', marginBottom: '0.4rem' }}>
            / STUDIO /
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, fontFamily: 'var(--vx-font-display)', margin: 0 }}>
            {status === 'sent' ? 'Received' : 'Get Started'}
          </h2>
          <button
            onClick={handleClose}
            style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(20,20,20,0.1)', display: 'grid', placeItems: 'center', background: 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        <div style={{ padding: '1.5rem 2.25rem 2.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#000', color: '#fff', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}>
                <Icon name="check" size={28} />
              </div>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--vx-muted)', marginBottom: '1.5rem' }}>
                Thank you, <strong>{name}</strong>. Brief received. Reference: <strong>{reference}</strong>.
              </p>
              <Button onClick={handleClose} style={{ width: '100%', borderRadius: '99px', background: '#000', color: '#fff' }}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <StepIndicator step={currentStep} />

              <div style={{ minHeight: '320px' }}>
                {currentStep === 1 && (
                  <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--vx-muted)', display: 'block', marginBottom: '0.75rem' }}>Select Capabilities</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                        {SERVICES.map((s) => (
                          <ChoiceButton
                            key={s}
                            label={s}
                            active={selectedServices.includes(s)}
                            onClick={() => toggleService(s)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--vx-muted)', display: 'block', marginBottom: '0.75rem' }}>Stage</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                        {STAGES.map((s) => (
                          <ChoiceButton
                            key={s}
                            label={s}
                            active={selectedStage === s}
                            onClick={() => setSelectedStage(s)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--vx-muted)', display: 'block', marginBottom: '0.75rem' }}>Budget Range</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                        {BUDGETS.map((b) => (
                          <ChoiceButton
                            key={b}
                            label={b}
                            active={selectedBudget === b}
                            onClick={() => setSelectedBudget(b)}
                          />
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--vx-muted)', display: 'block', marginBottom: '0.75rem' }}>Target Timeline</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                        {TIMELINES.map((t) => (
                          <ChoiceButton
                            key={t}
                            label={t}
                            active={selectedTimeline === t}
                            onClick={() => setSelectedTimeline(t)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--vx-muted)', display: 'block', marginBottom: '0.6rem' }}>Brief / Notes</label>
                      <textarea
                        style={{ width: '100%', minHeight: '100px', borderRadius: '0.75rem', border: '1.5px solid #000', padding: '1rem', fontSize: '0.9rem', background: '#fff', outline: 'none', resize: 'none' }}
                        placeholder="Tell us about your project goals..."
                        value={projectBrief}
                        onChange={(e) => setProjectBrief(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div className="field">
                        <span style={{ color: '#000', fontWeight: 700 }}>Full Name *</span>
                        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Doe" style={{ height: '48px', fontSize: '0.9rem', border: '1.5px solid #000', borderRadius: '0.75rem', padding: '0 1rem', background: '#fff' }} />
                      </div>
                      <div className="field">
                        <span style={{ color: '#000', fontWeight: 700 }}>Email *</span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@company.com" style={{ height: '48px', fontSize: '0.9rem', border: '1.5px solid #000', borderRadius: '0.75rem', padding: '0 1rem', background: '#fff' }} />
                      </div>
                      <div className="field">
                        <span style={{ color: '#000', fontWeight: 700 }}>Company (Optional)</span>
                        <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Studio Name" style={{ height: '48px', fontSize: '0.9rem', border: '1.5px solid #000', borderRadius: '0.75rem', padding: '0 1rem', background: '#fff' }} />
                      </div>
                    </div>

                    <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', alignItems: 'flex-start' }}>
                      <input type="checkbox" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#000', flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.82rem', color: '#000', fontWeight: 500, lineHeight: 1.4 }}>
                        I agree to be contacted by Vraunix Studio regarding this enquiry.
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {error && (
                <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(220, 50, 50, 0.08)', borderRadius: '0.5rem', color: 'rgb(200, 40, 40)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon name="alert" size={14} />
                  {error}
                </div>
              )}

              {/* Footer */}
              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                {currentStep > 1 && (
                  <Button variant="ghost" onClick={handleBack} type="button" style={{ borderRadius: '99px', minWidth: '100px', border: '1.5px solid #000' }}>
                    Back
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button onClick={handleNext} type="button" style={{ borderRadius: '99px', minWidth: '140px', background: '#000', color: '#fff' }}>
                    Continue <Icon name="arrow-right" size={14} style={{ marginLeft: '6px' }} />
                  </Button>
                ) : (
                  <Button type="submit" loading={status === 'sending'} style={{ borderRadius: '99px', minWidth: '180px', background: '#000', color: '#fff' }}>
                    Submit Brief
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  , document.body);
}
