"use client";

import Link from "next/link";
import {
  PROJECT_STATUSES,
  type DashboardOverview,
} from "@vraunix/shared";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApiResource } from "@/lib/use-api";
import { date, initials, money, titleCase } from "@/lib/format";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState, Spinner } from "@/components/ui/states";
import { Icon } from "@/components/icons";
import DashboardOverviewLoading from "./loading";

const chartColors = [
  "#141414",
  "#8c8a75",
  "#89b2e8",
  "#d9a84e",
  "#e86c4f",
  "#a2cbb5",
];

const tooltipStyle = {
  border: "1px solid rgba(20, 20, 20, 0.12)",
  borderRadius: "0.8rem",
  background: "#ffffff",
  boxShadow: "0 18px 40px rgba(20, 20, 20, 0.1)",
  fontSize: "0.78rem",
  color: "#141414",
};

function compactAmount(minor: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(minor / 100);
}

function activityLabel(action: string): string {
  if (!action.includes(".")) return action;
  return titleCase(action.replace(/[._]/g, " "));
}

export default function DashboardPage() {
  const { data, loading, error, reload } =
    useApiResource<DashboardOverview>("/overview");

  if (loading && !data) return <DashboardOverviewLoading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  if (!data) return null;

  const proposalTotal =
    data.proposalPipeline.reduce((sum, item) => sum + item.count, 0) ?? 0;
  const projectStages = PROJECT_STATUSES.map((status) => ({
    status,
    label: titleCase(status),
    count: data.projectMix.find((item) => item.status === status)?.count ?? 0,
  }));

  return (
    <div className="dashboard-page overview-page">
      <div className="dashboard-page-actions">
        <Link
          href="/dashboard/clients"
          className="vx-button vx-button--secondary vx-button--md"
        >
          <Icon name="building" size={16} />
          Clients
        </Link>
        <Link
          href="/dashboard/proposals?create=1"
          className="vx-button vx-button--primary vx-button--md"
        >
          <Icon name="plus" size={16} />
          New proposal
        </Link>
      </div>

      <section className="stat-grid overview-stats">
        <StatCard
          label="Active clients"
          value={data.activeClients}
          hint={`${data.newClients} added this month`}
          href="/dashboard/clients"
          tone={data.newClients > 0 ? "accent" : "default"}
        />
        <StatCard
          label="Work in progress"
          value={data.activeProjects}
          hint={`${data.proposalsAwaiting} proposals awaiting`}
          href="/dashboard/projects"
        />
        <StatCard
          label="Proposals out"
          value={data.proposalsAwaiting}
          hint="Waiting for a decision"
          href="/dashboard/proposals?status=sent"
          tone={data.proposalsAwaiting > 0 ? "accent" : "default"}
        />
        <StatCard
          label="Outstanding"
          value={money(data.unpaidInvoices.balanceMinor)}
          hint={`${data.unpaidInvoices.count} open invoices`}
          href="/dashboard/invoices"
          tone={data.overdueInvoices.count > 0 ? "danger" : "default"}
        />
      </section>

      <section className="overview-charts">
        <article className="overview-panel overview-panel--wide">
          <header className="overview-panel__header">
            <div>
              <h2>Revenue rhythm</h2>
              <p>Invoiced value against verified payments.</p>
            </div>
            <div className="chart-legend">
              <span>
                <i style={{ background: chartColors[0] }} />
                Invoiced
              </span>
              <span>
                <i style={{ background: chartColors[1] }} />
                Collected
              </span>
            </div>
          </header>
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={data.revenueTrend}
                margin={{ top: 12, right: 8, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="invoicedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors[0]} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={chartColors[0]} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="collectedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors[1]} stopOpacity={0.24} />
                    <stop offset="100%" stopColor={chartColors[1]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(20,20,20,0.08)"
                  strokeDasharray="3 5"
                />
                <XAxis
                  dataKey="month"
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8a8a80", fontSize: 11 }}
                  tickMargin={12}
                  height={38}
                  padding={{ left: 12, right: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8a8a80", fontSize: 11 }}
                  tickFormatter={(value) => compactAmount(Number(value))}
                  tickCount={5}
                  width={46}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ stroke: "rgba(20,20,20,0.16)", strokeDasharray: "3 4" }}
                  formatter={(value) => money(Number(value))}
                />
                <Area
                  type="monotone"
                  dataKey="invoicedMinor"
                  name="Invoiced"
                  stroke={chartColors[0]}
                  strokeWidth={2}
                  fill="url(#invoicedFill)"
                  activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="collectedMinor"
                  name="Collected"
                  stroke={chartColors[1]}
                  strokeWidth={2}
                  fill="url(#collectedFill)"
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="overview-panel overview-panel--compact">
          <header className="overview-panel__header">
            <div>
              <h2>Proposal pipeline</h2>
              <p>Where every offer currently sits.</p>
            </div>
          </header>
          {proposalTotal === 0 ? (
            <EmptyState
              icon="file"
              title="No proposals yet"
              description="Create the first proposal to start tracking the pipeline."
            />
          ) : (
            <>
              <div className="donut-frame">
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={data.proposalPipeline}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={58}
                      outerRadius={82}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {data.proposalPipeline.map((item, index) => (
                        <Cell
                          key={item.status}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value, name) => [
                        `${value} proposal${Number(value) === 1 ? "" : "s"}`,
                        titleCase(String(name)),
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center">
                  <strong>{proposalTotal}</strong>
                  <span>Total</span>
                </div>
              </div>
              <ul className="chart-legend-list">
                {data.proposalPipeline.map((item, index) => (
                  <li key={item.status}>
                    <span>
                      <i
                        style={{
                          background: chartColors[index % chartColors.length],
                        }}
                      />
                      {titleCase(item.status)}
                    </span>
                    <strong>{item.count}</strong>
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>
      </section>

      <section className="overview-lists">
        <article className="overview-panel">
          <header className="overview-panel__header">
            <div>
              <h2>Newest clients</h2>
              <p>Latest relationships in the studio.</p>
            </div>
            <Link href="/dashboard/clients" className="vx-text-link">
              View all
              <Icon name="arrow-right" size={14} />
            </Link>
          </header>
          {data.recentClients.length === 0 ? (
            <EmptyState
              icon="building"
              title="No clients yet"
              description="Client records will appear here as you add them."
            />
          ) : (
            <div className="overview-client-list">
              {data.recentClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/dashboard/clients/${client.id}`}
                  className="overview-client"
                >
                  <span className="overview-client__avatar">
                    {initials(client.name)}
                  </span>
                  <span className="overview-client__body">
                    <strong>{client.name}</strong>
                    <span>
                      {client.contactName || client.email}
                      {client.country ? ` · ${client.country}` : ""}
                    </span>
                  </span>
                  <span className="overview-client__date">
                    {date(client.createdAt)}
                  </span>
                  <Icon name="chevron-right" size={16} />
                </Link>
              ))}
            </div>
          )}
        </article>

        <article className="overview-panel">
          <header className="overview-panel__header">
            <div>
              <h2>Invoice watchlist</h2>
              <p>Nearest balances still to collect.</p>
            </div>
            <Link href="/dashboard/invoices" className="vx-text-link">
              View all
              <Icon name="arrow-right" size={14} />
            </Link>
          </header>
          {data.upcomingInvoices.length === 0 ? (
            <EmptyState
              icon="receipt"
              title="Nothing outstanding"
              description="Open invoices with a balance will appear here."
            />
          ) : (
            <div className="overview-invoice-list">
              {data.upcomingInvoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/dashboard/invoices?invoice=${invoice.id}`}
                  className="overview-invoice"
                >
                  <span className="overview-invoice__mark">
                    <Icon name="receipt" size={17} />
                  </span>
                  <span className="overview-invoice__body">
                    <strong>{invoice.number}</strong>
                    <span>
                      {invoice.clientName} · due {date(invoice.dueDate)}
                    </span>
                  </span>
                  <span className="overview-invoice__amount">
                    <strong>
                      {money(invoice.balanceMinor, invoice.currency)}
                    </strong>
                    <StatusBadge status={invoice.status} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="overview-lists overview-lists--lower">
        <article className="overview-panel">
          <header className="overview-panel__header">
            <div>
              <h2>Project mix</h2>
              <p>Delivery work by current stage.</p>
            </div>
          </header>
          {data.projectMix.length === 0 ? (
            <EmptyState
              icon="briefcase"
              title="No projects yet"
              description="Project stages will appear when delivery begins."
            />
          ) : (
            <div className="chart-frame">
              <ResponsiveContainer width="100%" height={264}>
                <LineChart
                  data={projectStages}
                  margin={{ top: 22, right: 18, left: -14, bottom: 8 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(20,20,20,0.08)"
                    strokeDasharray="3 5"
                  />
                  <XAxis
                    dataKey="label"
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#62625b", fontSize: 10 }}
                    tickMargin={12}
                    height={66}
                    angle={-32}
                    textAnchor="end"
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#8a8a80", fontSize: 10 }}
                    tickCount={5}
                    width={30}
                    domain={[0, "dataMax + 4"]}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, _name, item) => [
                      `${value} project${Number(value) === 1 ? "" : "s"}`,
                      item.payload.label,
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Projects"
                    stroke={chartColors[0]}
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "#ffffff",
                      stroke: chartColors[0],
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6, fill: chartColors[0], strokeWidth: 0 }}
                  >
                    <LabelList
                      dataKey="count"
                      position="top"
                      offset={10}
                      fill="#141414"
                      fontSize={10}
                      fontWeight={600}
                    />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        <article className="overview-panel">
          <header className="overview-panel__header">
            <div>
              <h2>Recent activity</h2>
              <p>Latest updates across the workspace.</p>
            </div>
          </header>
          {data.recentActivity.length === 0 ? (
            <EmptyState
              icon="activity"
              title="No activity yet"
              description="Updates are recorded as work moves forward."
            />
          ) : (
            <ol className="overview-activity">
              {data.recentActivity.map((item) => (
                <li key={item.id}>
                  <span className="overview-activity__dot" aria-hidden="true" />
                  <div>
                    <p>{activityLabel(item.action)}</p>
                    <span>
                      {titleCase(item.actorName)} · {date(item.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </article>
      </section>
    </div>
  );
}
