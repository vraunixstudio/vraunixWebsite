import { Skeleton } from "@/components/ui/skeleton";

export function SiteLayoutSkeleton() {
  return (
    <div style={{ width: '100%', padding: '4rem 0' }}>
      <div className="container" style={{ display: 'grid', gap: '3rem' }}>
        <Skeleton style={{ height: '400px', width: '100%', borderRadius: '2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <Skeleton style={{ height: '200px', width: '100%', borderRadius: '1.5rem' }} />
          <Skeleton style={{ height: '200px', width: '100%', borderRadius: '1.5rem' }} />
          <Skeleton style={{ height: '200px', width: '100%', borderRadius: '1.5rem' }} />
        </div>
      </div>
    </div>
  );
}
