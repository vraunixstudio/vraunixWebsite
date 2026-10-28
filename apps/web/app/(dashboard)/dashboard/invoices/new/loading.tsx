import { Skeleton } from "@/components/ui/skeleton";

export default function NewPageLoading() {
  return (
    <div className="dashboard-page" style={{ width: '100%' }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <Skeleton style={{ height: '40px', width: '250px', marginBottom: '0.5rem' }} />
          <Skeleton style={{ height: '20px', width: '200px' }} />
        </div>
        <Skeleton style={{ height: '40px', width: '100px', borderRadius: '99px' }} />
      </div>

      {/* Form Container Skeleton */}
      <div className="panel" style={{ background: '#fff', border: '1px solid rgba(20,20,20,0.1)', borderRadius: '1.25rem', padding: '2.5rem', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <Skeleton style={{ height: '16px', width: '100px', marginBottom: '0.5rem' }} />
              <Skeleton style={{ height: '48px', width: '100%', borderRadius: '0.5rem' }} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Skeleton style={{ height: '40px', width: '100px', borderRadius: '99px' }} />
          <Skeleton style={{ height: '40px', width: '140px', borderRadius: '99px' }} />
        </div>
      </div>
    </div>
  );
}
