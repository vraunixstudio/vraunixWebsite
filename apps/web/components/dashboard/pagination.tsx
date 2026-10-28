import type { PaginationMeta } from "@vraunix/shared";
import { Icon } from "@/components/icons";

export function Pagination({
  meta,
  onPage,
}: {
  meta: PaginationMeta | undefined;
  onPage: (page: number) => void;
}) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      <p>
        Page {meta.page} of {meta.totalPages} · {meta.total} record
        {meta.total === 1 ? "" : "s"}
      </p>
      <div>
        <button
          type="button"
          className="vx-button vx-button--ghost vx-button--sm"
          onClick={() => onPage(meta.page - 1)}
          disabled={meta.page <= 1}
        >
          <Icon name="arrow-left" size={15} />
          Previous
        </button>
        <button
          type="button"
          className="vx-button vx-button--ghost vx-button--sm"
          onClick={() => onPage(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
        >
          Next
          <Icon name="arrow-right" size={15} />
        </button>
      </div>
    </nav>
  );
}
