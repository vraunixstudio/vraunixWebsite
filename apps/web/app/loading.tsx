import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      className="route-skeleton"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy="true"
    >
      <span className="sr-only">Loading page…</span>
      <div className="container route-skeleton__inner">
        <Skeleton className="route-skeleton__kicker" />
        <Skeleton className="route-skeleton__title" />
        <Skeleton className="route-skeleton__title route-skeleton__title--short" />
        <Skeleton className="route-skeleton__copy" />
        <div className="route-skeleton__grid">
          <Skeleton className="route-skeleton__panel" />
          <Skeleton className="route-skeleton__panel" />
          <Skeleton className="route-skeleton__panel" />
        </div>
      </div>
    </main>
  );
}
