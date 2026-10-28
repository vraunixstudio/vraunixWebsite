import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="vx-loading" role="status">
      <span className="vx-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  icon = "sparkles",
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="vx-empty">
      <span className="vx-empty__icon">
        <Icon name={icon} size={22} />
      </span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="vx-alert vx-alert--danger" role="alert" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Icon name="alert" size={18} />
        <div>
          <strong>Something needs attention</strong>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            background: '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '99px',
            padding: '0.5rem 1.25rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'transform 0.2s ease',
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
