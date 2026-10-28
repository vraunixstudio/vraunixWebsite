import { Skeleton } from "@/components/ui/skeleton";

export default function DetailPageLoading() {
  return (
    <div className="dashboard-page" style={{ width: '100%' }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <Skeleton style={{ height: '40px', width: '250px', marginBottom: '0.5rem' }} />
          <Skeleton style={{ height: '20px', width: '150px' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton style={{ height: '40px', width: '100px', borderRadius: '99px' }} />
          <Skeleton style={{ height: '40px', width: '100px', borderRadius: '99px' }} />
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%' }}>
        {/* Left Column / Particulars */}
        <div className="panel" style={{ background: '#fff', border: '1px solid rgba(20,20,20,0.1)', borderRadius: '1.25rem', padding: '2rem' }}>
          <Skeleton style={{ height: '24px', width: '120px', marginBottom: '1.5rem' }} />
          <div style={{ display: 'grid', gap: '1.2rem' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton style={{ height: '14px', width: '80px', marginBottom: '0.4rem' }} />
                <Skeleton style={{ height: '18px', width: '180px' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column / Content */}
        <div className="panel" style={{ background: '#fff', border: '1px solid rgba(20,20,20,0.1)', borderRadius: '1.25rem', padding: '2rem' }}>
          <Skeleton style={{ height: '24px', width: '150px', marginBottom: '1.5rem' }} />
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} style={{ height: '60px', width: '100%', borderRadius: '0.75rem' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
