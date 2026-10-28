"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import type { Inquiry } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useApiResource } from "@/lib/use-api";
import { date } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/dashboard/feedback";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/icons";

export default function InquiriesPage() {
  return (
    <Suspense fallback={<InquiriesLoading />}>
      <InquiriesDirectory />
    </Suspense>
  );
}

function InquiriesLoading() {
  return (
    <div className="dashboard-page" style={{ width: '100%' }}>
      <div className="clients-directory" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="panel" style={{ background: '#fff', border: '1px solid rgba(20,20,20,0.1)', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <Skeleton style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <Skeleton style={{ height: '18px', width: '60%', marginBottom: '0.25rem' }} />
                <Skeleton style={{ height: '14px', width: '40%' }} />
              </div>
            </div>
            <Skeleton style={{ height: '40px', width: '100%', marginBottom: '1rem' }} />
            <Skeleton style={{ height: '36px', width: '120px', borderRadius: '99px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function InquiriesDirectory() {
  const router = useRouter();
  const { data, loading, error, reload } = useApiResource<Inquiry[]>("/inquiries");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  async function convert(id: string) {
    setBusyId(id);
    try {
      const result = await api<{ id: string }>(`/clients/from-inquiry/${id}`, { method: "POST" });
      router.push(`/dashboard/clients/${result.data.id}`);
    } catch (cause) {
      setToast({ tone: "danger", message: cause instanceof ApiError ? cause.message : "Could not convert" });
    } finally {
      setBusyId(null);
    }
  }

  if (loading && !data) return <InquiriesLoading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data || data.length === 0) return <EmptyState icon="target" title="No inquiries yet" description="New submissions will appear here." />;

  return (
    <div className="dashboard-page">
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}
      <div className="clients-directory">
        {data.map((inquiry) => (
          <div key={inquiry.id} className="client-card">
            <span className="client-card__top">
              <span className="client-card__avatar">{inquiry.name.slice(0, 2).toUpperCase()}</span>
              <span className="client-card__identity">
                <strong>{inquiry.businessName || inquiry.name}</strong>
                <small>{inquiry.email}</small>
              </span>
            </span>
            <span className="client-card__meta">
              <span><small>Status</small><strong>{inquiry.status}</strong></span>
              <span><small>Received</small><strong>{date(inquiry.createdAt)}</strong></span>
            </span>
            {inquiry.message && <p>{inquiry.message}</p>}
            <div className="form-actions">
              {inquiry.status !== "converted" && (
                <Button className="vx-button vx-button--primary vx-button--md" onClick={() => convert(inquiry.id)} loading={busyId === inquiry.id}>
                  <Icon name="plus" size={16} />
                  Convert to client
                </Button>
              )}
              {inquiry.clientId && (
                <Button className="vx-button vx-button--secondary vx-button--md" onClick={() => router.push(`/dashboard/clients/${inquiry.clientId}`)}>
                  View client
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
