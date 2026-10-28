import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardOverviewLoading() {
  return (
    <div className="dashboard-page overview-page" style={{ width: '100%' }}>
      <div className="dashboard-page-actions" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <Skeleton style={{ height: '44px', width: '120px', borderRadius: '99px' }} />
        <Skeleton style={{ height: '44px', width: '160px', borderRadius: '99px' }} />
      </div>

      <section className="stat-grid overview-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="panel" style={{ background: '#fff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(20,20,20,0.1)' }}>
            <Skeleton style={{ height: '16px', width: '100px', marginBottom: '0.75rem' }} />
            <Skeleton style={{ height: '32px', width: '80px' }} />
          </div>
        ))}
      </section>

      <section className="overview-charts" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <Skeleton style={{ height: '350px', width: '100%', borderRadius: '1.25rem' }} />
        <Skeleton style={{ height: '350px', width: '100%', borderRadius: '1.25rem' }} />
      </section>

      <section className="overview-lists" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Skeleton style={{ height: '300px', width: '100%', borderRadius: '1.25rem' }} />
        <Skeleton style={{ height: '300px', width: '100%', borderRadius: '1.25rem' }} />
      </section>
    </div>
  );
}
