import { Skeleton } from "@/components/ui/skeleton";

export default function AuditLogLoading() {
  return (
    <div className="dashboard-page" style={{ width: '100%' }}>
      <div className="toolbar" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton style={{ height: '44px', width: '300px', borderRadius: '99px' }} />
      </div>

      <div className="panel" style={{ background: '#ffffff', borderRadius: '1.25rem', border: '1px solid rgba(20,20,20,0.1)', overflow: 'hidden', width: '100%' }}>
        <div style={{ width: '100%', padding: '1.5rem' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(20,20,20,0.06)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                  <Skeleton style={{ height: '20px', width: '150px' }} />
                  <Skeleton style={{ height: '20px', width: '80px', borderRadius: '99px' }} />
                </div>
                <Skeleton style={{ height: '20px', width: '120px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
