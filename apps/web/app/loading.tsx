export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-label="Loading page">
      <span className="vx-spinner" aria-hidden="true" />
      <span>Preparing the page…</span>
    </div>
  );
}
