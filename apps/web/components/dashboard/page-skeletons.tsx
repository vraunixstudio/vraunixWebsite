import type { CSSProperties, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonLineProps = {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: CSSProperties["borderRadius"];
  className?: string;
  style?: CSSProperties;
};

function Line({
  width = "100%",
  height = "0.75rem",
  radius = "0.45rem",
  className,
  style,
}: SkeletonLineProps) {
  return (
    <Skeleton
      className={className}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

function PageSkeleton({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`dashboard-page ${className ?? ""}`.trim()}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy="true"
    >
      <span className="sr-only">Loading {label}…</span>
      {children}
    </div>
  );
}

function PageHeaderSkeleton({
  actions = 1,
  titleWidth = "min(24rem, 74%)",
  subtitle = true,
  subtitleWidth = "min(30rem, 88%)",
}: {
  actions?: number;
  titleWidth?: CSSProperties["width"];
  subtitle?: boolean;
  subtitleWidth?: CSSProperties["width"];
}) {
  return (
    <div className="skeleton-detail-header">
      <div className="skeleton-detail-header__copy">
        <Line
          className="skeleton-detail-title"
          width={titleWidth}
          height="clamp(2.4rem, 4.5vw, 3.5rem)"
          radius="0.65rem"
        />
        {subtitle && <Line width={subtitleWidth} height="0.78rem" />}
      </div>
      {actions > 0 && (
        <div className="skeleton-detail-actions" aria-hidden="true">
          {Array.from({ length: actions }, (_, index) => (
            <Line key={index} width="6.8rem" height="2.65rem" radius="9999px" />
          ))}
        </div>
      )}
    </div>
  );
}

function ToolbarSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className="toolbar clients-toolbar skeleton-toolbar" aria-hidden="true">
      <Line className="skeleton-search" height="2.65rem" radius="0.9rem" />
      {action && (
        <Line
          className="skeleton-toolbar__action"
          width="8.75rem"
          height="2.75rem"
          radius="9999px"
        />
      )}
    </div>
  );
}

function CardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "inquiry";
}) {
  const inquiry = variant === "inquiry";
  return (
    <div
      className={`client-card skeleton-card${inquiry ? " skeleton-card--inquiry" : ""}`}
      aria-hidden="true"
    >
      <span className="client-card__top">
        {inquiry && (
          <Line width="2.75rem" height="2.75rem" radius="50%" />
        )}
        <span className="client-card__identity">
          <Line width={inquiry ? "62%" : "72%"} height="0.95rem" />
          <Line width={inquiry ? "48%" : "56%"} height="0.68rem" />
        </span>
        {!inquiry && (
          <Line
            className="skeleton-card__arrow"
            width="1.95rem"
            height="1.95rem"
            radius="50%"
          />
        )}
      </span>

      <span className="client-card__meta">
        <span>
          <Line width="3.8rem" height="0.5rem" />
          <Line width="68%" height="0.75rem" />
        </span>
        <span>
          <Line width="4.4rem" height="0.5rem" />
          <Line width="56%" height="0.75rem" />
        </span>
      </span>

      {inquiry ? (
        <>
          <Line width="100%" height="0.65rem" />
          <Line width="82%" height="0.65rem" />
          <div className="form-actions skeleton-card__actions">
            <Line width="8.7rem" height="2.3rem" radius="9999px" />
          </div>
        </>
      ) : (
        <span className="client-card__footer">
          <Line width="7rem" height="0.58rem" />
          <Line width="5rem" height="0.58rem" />
        </span>
      )}
    </div>
  );
}

function DirectorySkeleton({
  count = 9,
  variant = "default",
}: {
  count?: number;
  variant?: "default" | "inquiry";
}) {
  return (
    <div className="clients-directory skeleton-directory" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}

function PaginationSkeleton() {
  return (
    <nav className="pagination skeleton-pagination" aria-hidden="true">
      <p>
        <Line width="9rem" height="0.62rem" />
      </p>
      <div>
        <Line width="5.8rem" height="2.1rem" radius="9999px" />
        <Line width="4.7rem" height="2.1rem" radius="9999px" />
      </div>
    </nav>
  );
}

function StatCardSkeleton({ hint = false }: { hint?: boolean }) {
  return (
    <div className="stat-card skeleton-stat-card">
      <div className="stat-card__head">
        <Line width="6.2rem" height="0.55rem" />
        <Line width="1rem" height="1rem" radius="50%" />
      </div>
      <Line width="5.4rem" height="2rem" radius="0.5rem" />
      {hint && <Line width="7.5rem" height="0.62rem" />}
    </div>
  );
}

function DetailStatsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="skeleton-detail-stats" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="stat-card skeleton-stat-card skeleton-detail-stat"
        >
          <Line width="7rem" height="0.58rem" />
          <Line width="5rem" height="2rem" radius="0.5rem" />
        </div>
      ))}
    </div>
  );
}

function DetailRowSkeleton({
  labelWidth = "5.2rem",
  valueWidth = "58%",
}: {
  labelWidth?: CSSProperties["width"];
  valueWidth?: CSSProperties["width"];
}) {
  return (
    <div className="skeleton-detail-row">
      <Line width={labelWidth} height="0.52rem" />
      <Line width={valueWidth} height="0.76rem" />
    </div>
  );
}

function DetailPanelSkeleton({
  titleWidth = "7rem",
  rows = 4,
  className,
}: {
  titleWidth?: CSSProperties["width"];
  rows?: number;
  className?: string;
}) {
  return (
    <div className={`skeleton-panel ${className ?? ""}`.trim()} aria-hidden="true">
      <Line
        className="skeleton-panel__title"
        width={titleWidth}
        height="0.98rem"
      />
      <div className="skeleton-detail-list">
        {Array.from({ length: rows }, (_, index) => (
          <DetailRowSkeleton
            key={index}
            labelWidth={index % 2 === 0 ? "5rem" : "6.4rem"}
            valueWidth={index % 3 === 0 ? "68%" : "52%"}
          />
        ))}
      </div>
    </div>
  );
}

function ChecklistSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="skeleton-checklist" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="skeleton-checklist__row">
          <Line width="1rem" height="1rem" radius="0.3rem" />
          <Line width={index % 2 === 0 ? "88%" : "72%"} height="0.78rem" />
        </div>
      ))}
    </div>
  );
}

function NotesPanelSkeleton() {
  return (
    <div className="skeleton-panel" aria-hidden="true">
      <Line
        className="skeleton-panel__title"
        width="9.5rem"
        height="0.9rem"
      />
      <div className="skeleton-paragraph">
        <Line width="100%" height="0.72rem" />
        <Line width="92%" height="0.72rem" />
        <Line width="68%" height="0.72rem" />
      </div>
    </div>
  );
}

function QuickActionsSkeleton() {
  return (
    <div aria-hidden="true">
      <Line
        className="skeleton-section-title"
        width="7.5rem"
        height="0.98rem"
      />
      <div className="skeleton-quick-list">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="client-dialog__quick-link skeleton-quick-link">
            <Line width="1rem" height="1rem" radius="0.3rem" />
            <span>
              <Line width="5rem" height="0.72rem" />
              <Line width="6.4rem" height="0.55rem" />
            </span>
            <Line width="0.8rem" height="0.8rem" radius="0.2rem" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldSkeleton({
  labelWidth = "5.5rem",
  inputHeight = "2.95rem",
  full = false,
  className,
}: {
  labelWidth?: CSSProperties["width"];
  inputHeight?: CSSProperties["height"];
  full?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`skeleton-field${full ? " skeleton-field--full" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <Line width={labelWidth} height="0.55rem" />
      <Line height={inputHeight} radius="0.8rem" />
    </div>
  );
}

function FormActionsSkeleton({ buttons = 2 }: { buttons?: number }) {
  return (
    <div className="form-actions skeleton-form-actions" aria-hidden="true">
      {buttons > 1 && (
        <Line width="5.5rem" height="2.55rem" radius="9999px" />
      )}
      <Line width="8.8rem" height="2.55rem" radius="9999px" />
    </div>
  );
}

function FormPanelSkeleton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`skeleton-form-panel ${className ?? ""}`.trim()}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

function TemplateBarSkeleton() {
  return (
    <div className="skeleton-template-bar" aria-hidden="true">
      <div className="skeleton-template-bar__head">
        <Line width="12rem" height="0.72rem" />
        <Line width="8rem" height="0.55rem" />
      </div>
      <div className="skeleton-template-bar__controls">
        <Line width="11rem" height="2rem" radius="9999px" />
        <Line width="6.8rem" height="2rem" radius="9999px" />
      </div>
    </div>
  );
}

function OverviewRowSkeleton() {
  return (
    <div className="overview-client" aria-hidden="true">
      <Line width="2.1rem" height="2.1rem" radius="50%" />
      <span className="overview-client__body">
        <Line width="58%" height="0.72rem" />
        <Line width="74%" height="0.55rem" />
      </span>
      <Line width="4.4rem" height="0.55rem" />
      <Line width="1rem" height="1rem" radius="0.3rem" />
    </div>
  );
}

function InvoiceRowSkeleton() {
  return (
    <div className="overview-invoice" aria-hidden="true">
      <Line width="2.1rem" height="2.1rem" radius="0.62rem" />
      <span className="overview-invoice__body">
        <Line width="42%" height="0.72rem" />
        <Line width="76%" height="0.55rem" />
      </span>
      <span className="overview-invoice__amount">
        <Line width="3.8rem" height="0.68rem" />
        <Line width="3rem" height="1rem" radius="9999px" />
      </span>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <ol className="overview-activity" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <li key={index}>
          <span className="overview-activity__dot" />
          <div>
            <Line width={index % 2 === 0 ? "82%" : "66%"} height="0.7rem" />
            <Line
              width={index % 2 === 0 ? "42%" : "34%"}
              height="0.52rem"
              style={{ marginTop: "0.28rem" }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

function PaymentListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="skeleton-payment-list" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="skeleton-payment-row">
          <div>
            <Line width="5.2rem" height="0.78rem" />
            <Line
              width="8rem"
              height="0.55rem"
              style={{ marginTop: "0.3rem" }}
            />
          </div>
          <Line width="4rem" height="1.15rem" radius="9999px" />
        </div>
      ))}
    </div>
  );
}

export function DashboardOverviewSkeleton() {
  return (
    <PageSkeleton label="dashboard overview" className="overview-page">
      <div className="dashboard-page-actions" aria-hidden="true">
        <Line width="6rem" height="2.65rem" radius="9999px" />
        <Line width="8rem" height="2.65rem" radius="9999px" />
      </div>

      <section className="stat-grid overview-stats" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <StatCardSkeleton key={index} hint />
        ))}
      </section>

      <section className="overview-charts" aria-hidden="true">
        <article className="overview-panel overview-panel--wide">
          <header className="overview-panel__header">
            <div className="skeleton-panel-heading">
              <Line width="8.5rem" height="0.95rem" />
              <Line width="14rem" height="0.62rem" />
            </div>
            <div className="chart-legend skeleton-legend">
              <Line width="4.3rem" height="0.55rem" />
              <Line width="4.7rem" height="0.55rem" />
            </div>
          </header>
          <div className="chart-frame">
            <div className="vx-skeleton skeleton-chart-plot" />
          </div>
        </article>

        <article className="overview-panel overview-panel--compact">
          <header className="overview-panel__header">
            <div className="skeleton-panel-heading">
              <Line width="7.2rem" height="0.95rem" />
              <Line width="11rem" height="0.62rem" />
            </div>
          </header>
          <div className="donut-frame skeleton-donut-frame">
            <Skeleton className="skeleton-donut" />
            <span className="donut-center">
              <Line width="2rem" height="1.5rem" />
              <Line width="2.4rem" height="0.5rem" />
            </span>
          </div>
          <div className="chart-legend-list skeleton-legend-list">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index}>
                <Line width="5.8rem" height="0.55rem" />
                <Line width="1.2rem" height="0.55rem" />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="overview-lists" aria-hidden="true">
        <article className="overview-panel">
          <header className="overview-panel__header">
            <div className="skeleton-panel-heading">
              <Line width="7.4rem" height="0.95rem" />
              <Line width="10.5rem" height="0.62rem" />
            </div>
            <Line width="3.7rem" height="0.55rem" />
          </header>
          <div className="overview-client-list">
            {Array.from({ length: 4 }, (_, index) => (
              <OverviewRowSkeleton key={index} />
            ))}
          </div>
        </article>

        <article className="overview-panel">
          <header className="overview-panel__header">
            <div className="skeleton-panel-heading">
              <Line width="7.8rem" height="0.95rem" />
              <Line width="11.5rem" height="0.62rem" />
            </div>
            <Line width="3.7rem" height="0.55rem" />
          </header>
          <div className="overview-invoice-list">
            {Array.from({ length: 4 }, (_, index) => (
              <InvoiceRowSkeleton key={index} />
            ))}
          </div>
        </article>
      </section>

      <section className="overview-lists overview-lists--lower" aria-hidden="true">
        <article className="overview-panel">
          <header className="overview-panel__header">
            <div className="skeleton-panel-heading">
              <Line width="6.7rem" height="0.95rem" />
              <Line width="10rem" height="0.62rem" />
            </div>
          </header>
          <div className="chart-frame">
            <div className="vx-skeleton skeleton-chart-plot skeleton-chart-plot--short" />
          </div>
        </article>

        <article className="overview-panel">
          <header className="overview-panel__header">
            <div className="skeleton-panel-heading">
              <Line width="7.1rem" height="0.95rem" />
              <Line width="10.8rem" height="0.62rem" />
            </div>
          </header>
          <ActivitySkeleton />
        </article>
      </section>
    </PageSkeleton>
  );
}

export function ClientsPageSkeleton() {
  return (
    <PageSkeleton label="clients" className="clients-page">
      <ToolbarSkeleton />
      <DirectorySkeleton />
      <PaginationSkeleton />
    </PageSkeleton>
  );
}

export function InquiriesPageSkeleton() {
  return (
    <PageSkeleton label="inquiries" className="inquiries-page">
      <DirectorySkeleton count={6} variant="inquiry" />
    </PageSkeleton>
  );
}

export function InvoicesPageSkeleton() {
  return (
    <PageSkeleton label="invoices" className="invoices-page">
      <ToolbarSkeleton />
      <DirectorySkeleton />
      <PaginationSkeleton />
    </PageSkeleton>
  );
}

export function ProjectsPageSkeleton() {
  return (
    <PageSkeleton label="projects" className="projects-page">
      <ToolbarSkeleton />
      <DirectorySkeleton />
      <PaginationSkeleton />
    </PageSkeleton>
  );
}

export function ProposalsPageSkeleton() {
  return (
    <PageSkeleton label="proposals" className="proposals-page">
      <ToolbarSkeleton />
      <DirectorySkeleton />
      <PaginationSkeleton />
    </PageSkeleton>
  );
}

export function AuditLogPageSkeleton() {
  return (
    <PageSkeleton label="audit log" className="audit-page">
      <ToolbarSkeleton action={false} />
      <div className="panel skeleton-table-panel" aria-hidden="true">
        <div className="skeleton-table-scroll">
          <table className="skeleton-table">
            <thead>
              <tr>
                {Array.from({ length: 5 }, (_, index) => (
                  <th key={index}>
                    <Line
                      width={index === 4 ? "3.2rem" : "5.5rem"}
                      height="0.55rem"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 9 }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  <td>
                    <Line width="9rem" height="0.75rem" />
                  </td>
                  <td>
                    <Line width="5rem" height="1.25rem" radius="9999px" />
                  </td>
                  <td>
                    <Line width="7rem" height="0.75rem" />
                    <Line
                      width="8.5rem"
                      height="0.55rem"
                      style={{ marginTop: "0.28rem" }}
                    />
                  </td>
                  <td>
                    <Line width="5.5rem" height="0.7rem" />
                  </td>
                  <td>
                    <Line width="4.2rem" height="0.65rem" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationSkeleton />
      </div>
    </PageSkeleton>
  );
}

export function ClientDetailSkeleton() {
  return (
    <PageSkeleton label="client details" className="client-detail-page">
      <div className="skeleton-detail-stack">
        <PageHeaderSkeleton actions={2} titleWidth="min(22rem, 70%)" />
        <DetailStatsSkeleton />
        <div className="skeleton-detail-grid">
          <DetailPanelSkeleton rows={4} />
          <QuickActionsSkeleton />
        </div>
        <NotesPanelSkeleton />
      </div>
    </PageSkeleton>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <PageSkeleton label="project details" className="project-detail-page">
      <div className="skeleton-detail-stack">
        <PageHeaderSkeleton actions={1} titleWidth="min(25rem, 72%)" />
        <DetailStatsSkeleton />
        <div className="skeleton-detail-grid">
          <DetailPanelSkeleton rows={4} />
          <div className="skeleton-panel" aria-hidden="true">
            <Line
              className="skeleton-panel__title"
              width="9rem"
              height="0.98rem"
            />
            <ChecklistSkeleton rows={4} />
          </div>
        </div>
        <NotesPanelSkeleton />
      </div>
    </PageSkeleton>
  );
}

export function ProposalDetailSkeleton() {
  return (
    <PageSkeleton label="proposal details" className="proposal-detail-page">
      <div className="skeleton-detail-stack">
        <PageHeaderSkeleton actions={3} titleWidth="min(28rem, 76%)" />
        <DetailStatsSkeleton />
        <div className="skeleton-detail-grid">
          <DetailPanelSkeleton rows={5} />
          <div className="skeleton-panel" aria-hidden="true">
            <Line
              className="skeleton-panel__title"
              width="10.5rem"
              height="0.98rem"
            />
            <ChecklistSkeleton rows={4} />
          </div>
        </div>
        <NotesPanelSkeleton />
      </div>
    </PageSkeleton>
  );
}

export function InvoiceDetailSkeleton() {
  return (
    <PageSkeleton label="invoice details" className="invoice-detail-page">
      <div className="skeleton-detail-stack">
        <PageHeaderSkeleton actions={2} titleWidth="min(19rem, 64%)" />
        <DetailStatsSkeleton />
        <div className="skeleton-detail-grid">
          <DetailPanelSkeleton rows={3} />
          <div className="skeleton-detail-column">
            <div className="skeleton-panel" aria-hidden="true">
              <Line
                className="skeleton-panel__title"
                width="8.8rem"
                height="0.98rem"
              />
              <div className="skeleton-inline-fields">
                <FieldSkeleton labelWidth="7rem" />
                <FieldSkeleton labelWidth="7.5rem" />
              </div>
              <Line
                width="8rem"
                height="2.3rem"
                radius="9999px"
                style={{ marginTop: "1.5rem" }}
              />
            </div>
            <div className="skeleton-panel" aria-hidden="true">
              <Line
                className="skeleton-panel__title"
                width="8.2rem"
                height="0.98rem"
              />
              <PaymentListSkeleton />
            </div>
          </div>
        </div>
        <div className="skeleton-panel" aria-hidden="true">
          <Line
            className="skeleton-panel__title"
            width="8.4rem"
            height="0.9rem"
          />
          <PaymentListSkeleton rows={3} />
        </div>
      </div>
    </PageSkeleton>
  );
}

export function InvoicePaymentsSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-atomic="true" aria-busy="true">
      <span className="sr-only">Loading invoice payments…</span>
      <PaymentListSkeleton />
    </div>
  );
}

export function NewClientPageSkeleton() {
  return (
    <PageSkeleton label="new client form">
      <div className="skeleton-detail-header">
        <div className="skeleton-detail-header__copy">
          <Line width="12rem" height="2rem" radius="0.5rem" />
        </div>
      </div>
      <FormPanelSkeleton>
        <div className="skeleton-form-grid skeleton-form-grid--two">
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
        <FieldSkeleton
          className="skeleton-form-spaced"
          labelWidth="3.5rem"
          inputHeight="7rem"
          full
        />
        <FormActionsSkeleton buttons={1} />
      </FormPanelSkeleton>
    </PageSkeleton>
  );
}

export function NewInvoicePageSkeleton() {
  return (
    <PageSkeleton label="new invoice form" className="new-invoice-page">
      <PageHeaderSkeleton actions={1} titleWidth="15rem" subtitleWidth="24rem" />
      <FormPanelSkeleton>
        <div className="skeleton-form-grid">
          <FieldSkeleton labelWidth="7rem" />
          <FieldSkeleton labelWidth="8rem" />
          <FieldSkeleton labelWidth="4rem" full />
          <div className="skeleton-field skeleton-field--full">
            <div className="skeleton-line-items__head">
              <Line width="5.8rem" height="0.65rem" />
              <Line width="5.2rem" height="2rem" radius="9999px" />
            </div>
            <div className="skeleton-line-items">
              <div className="skeleton-line-item">
                <FieldSkeleton labelWidth="6.5rem" />
                <FieldSkeleton labelWidth="3.5rem" />
                <FieldSkeleton labelWidth="4.5rem" />
                <Line width="2.2rem" height="2.2rem" radius="0.6rem" />
              </div>
            </div>
          </div>
          <FieldSkeleton labelWidth="5rem" />
          <FieldSkeleton labelWidth="10.5rem" inputHeight="6.8rem" full />
        </div>
        <FormActionsSkeleton />
      </FormPanelSkeleton>
    </PageSkeleton>
  );
}

export function NewProjectPageSkeleton() {
  return (
    <PageSkeleton label="new project form" className="new-project-page">
      <PageHeaderSkeleton actions={1} titleWidth="18rem" subtitleWidth="27rem" />
      <FormPanelSkeleton>
        <div className="skeleton-form-grid">
          <FieldSkeleton labelWidth="7rem" full />
          <FieldSkeleton labelWidth="4rem" />
          <FieldSkeleton labelWidth="7.5rem" />
          <div className="skeleton-field skeleton-field--full">
            <div className="skeleton-compound-field">
              <FieldSkeleton labelWidth="4rem" />
              <FieldSkeleton labelWidth="7rem" />
            </div>
          </div>
          <FieldSkeleton labelWidth="8.5rem" />
          <FieldSkeleton labelWidth="10rem" inputHeight="7.5rem" full />
          <FieldSkeleton labelWidth="8.5rem" inputHeight="6rem" full />
        </div>
        <FormActionsSkeleton />
      </FormPanelSkeleton>
    </PageSkeleton>
  );
}

export function NewProposalPageSkeleton() {
  return (
    <PageSkeleton label="new proposal form" className="new-proposal-page">
      <PageHeaderSkeleton actions={1} titleWidth="16rem" subtitleWidth="28rem" />
      <FormPanelSkeleton>
        <div className="skeleton-form-grid">
          <FieldSkeleton labelWidth="7.5rem" full />
          <FieldSkeleton labelWidth="6rem" />
          <div className="skeleton-field skeleton-field--full">
            <div className="skeleton-compound-field">
              <FieldSkeleton labelWidth="4rem" />
              <FieldSkeleton labelWidth="6.5rem" />
            </div>
          </div>
          <TemplateBarSkeleton />
          <FieldSkeleton labelWidth="13rem" inputHeight="11.5rem" full />
          <FieldSkeleton labelWidth="12rem" inputHeight="7rem" full />
        </div>
        <FormActionsSkeleton />
      </FormPanelSkeleton>
    </PageSkeleton>
  );
}

export function SettingsPageSkeleton() {
  return (
    <PageSkeleton label="settings" className="settings-page">
      <div className="skeleton-detail-header">
        <div className="skeleton-detail-header__copy">
          <Line width="16rem" height="clamp(2.4rem, 4.5vw, 3.5rem)" radius="0.65rem" />
          <Line width="min(38rem, 92%)" height="0.78rem" />
        </div>
      </div>

      <div className="skeleton-settings-form" aria-hidden="true">
        <FormPanelSkeleton>
          <Line width="14rem" height="1.2rem" radius="0.4rem" />
          <Line
            width="min(30rem, 85%)"
            height="0.66rem"
            style={{ marginTop: "0.55rem", marginBottom: "1.8rem" }}
          />
          <div className="skeleton-form-grid">
            <FieldSkeleton />
            <FieldSkeleton labelWidth="6.5rem" />
            <FieldSkeleton labelWidth="8rem" inputHeight="5.4rem" full />
            <FieldSkeleton labelWidth="6rem" />
            <FieldSkeleton labelWidth="6.5rem" />
            <FieldSkeleton labelWidth="7.5rem" />
            <FieldSkeleton labelWidth="5.5rem" />
            <FieldSkeleton labelWidth="7.5rem" />
            <FieldSkeleton labelWidth="4.8rem" />
            <FieldSkeleton labelWidth="4.5rem" />
            <FieldSkeleton labelWidth="5.5rem" />
            <FieldSkeleton labelWidth="12rem" inputHeight="5rem" full />
          </div>
        </FormPanelSkeleton>

        <FormPanelSkeleton>
          <Line width="18rem" height="1.2rem" radius="0.4rem" />
          <Line
            width="min(34rem, 88%)"
            height="0.66rem"
            style={{ marginTop: "0.55rem", marginBottom: "1.8rem" }}
          />
          <div className="skeleton-form-grid">
            <FieldSkeleton labelWidth="8rem" />
            <FieldSkeleton labelWidth="9rem" />
            <TemplateBarSkeleton />
            <FieldSkeleton labelWidth="14rem" inputHeight="13rem" full />
            <FieldSkeleton labelWidth="13rem" inputHeight="6rem" full />
          </div>
        </FormPanelSkeleton>

        <FormActionsSkeleton buttons={1} />
      </div>
    </PageSkeleton>
  );
}
