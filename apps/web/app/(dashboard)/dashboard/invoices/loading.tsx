import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardListLoading() {
  return (
    <div className="dashboard-page" style={{ width: '100%' }}>
      <div className="toolbar" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton style={{ height: '44px', width: '300px', borderRadius: '99px' }} />
        <Skeleton style={{ height: '44px', width: '140px', borderRadius: '99px' }} />
      </div>

      <div className="clients-directory" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {[...Array(9)].map((_, i) => (
          <div key={i} className="panel" style={{ background: '#fff', border: '1px solid rgba(20,20,20,0.1)', borderRadius: '1.25rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <Skeleton style={{ height: '24px', width: '60%' }} />
              <Skeleton style={{ height: '20px', width: '40px', borderRadius: '99px' }} />
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <Skeleton style={{ height: '16px', width: '80%' }} />
              <Skeleton style={{ height: '16px', width: '40%' }} />
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(20,20,20,0.05)', display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton style={{ height: '14px', width: '30%' }} />
              <Skeleton style={{ height: '14px', width: '20%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
