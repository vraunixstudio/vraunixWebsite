"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/dashboard/feedback";
import { Icon } from "@/components/icons";

export default function NewClientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setToast(null);
    try {
      const result = await api<{ id: string }>("/clients", {
        method: "POST",
        body: { name, contactName, email, phone, country, notes },
      });
      router.push(`/dashboard/clients/${result.data.id}`);
    } catch (cause) {
      setToast({ tone: "danger", message: cause instanceof ApiError ? cause.message : "Could not create client" });
      setBusy(false);
    }
  }

  return (
    <div className="dashboard-page">
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}
      <div className="client-detail__header">
        <div className="client-detail__identity">
          <div className="client-detail__heading">
            <h1 className="client-dialog__title">New client</h1>
          </div>
        </div>
      </div>
      <form onSubmit={submit} className="form panel">
        <div className="form-grid">
          <label className="field">
            <span>Name *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </label>
          <label className="field">
            <span>Contact name</span>
            <input value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </label>
          <label className="field">
            <span>Email *</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="field">
            <span>Country</span>
            <input value={country} onChange={(e) => setCountry(e.target.value)} />
          </label>
        </div>
        <label className="field">
          <span>Notes</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        </label>
        <div className="form-actions">
          <Button type="submit" className="vx-button vx-button--primary vx-button--md" loading={busy}>
            Create client
            <Icon name="plus" size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
}
