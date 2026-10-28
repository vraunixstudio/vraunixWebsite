import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "arrow-up-right"
  | "arrow-right"
  | "arrow-left"
  | "arrow-down"
  | "check"
  | "x"
  | "menu"
  | "chevron-down"
  | "chevron-right"
  | "plus"
  | "minus"
  | "download"
  | "search"
  | "mail"
  | "phone"
  | "map-pin"
  | "send"
  | "sparkles"
  | "layers"
  | "shield"
  | "zap"
  | "code"
  | "pen"
  | "blocks"
  | "refresh"
  | "gauge"
  | "lifebuoy"
  | "message"
  | "smartphone"
  | "target"
  | "wrench"
  | "clipboard"
  | "dashboard"
  | "users"
  | "briefcase"
  | "file"
  | "receipt"
  | "ticket"
  | "settings"
  | "logout"
  | "calendar"
  | "clock"
  | "alert"
  | "info"
  | "external"
  | "lock"
  | "eye"
  | "trash"
  | "filter"
  | "grid"
  | "list"
  | "building"
  | "wallet"
  | "activity";

const paths: Record<IconName, ReactNode> = {
  "arrow-up-right": <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>,
  "arrow-right": <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  "arrow-left": <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
  "arrow-down": <><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  x: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  phone: <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-4-2-2 2a14 14 0 0 1-8-8l2-2-2-4Z" />,
  "map-pin": <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
  sparkles: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" /></>,
  layers: <><path d="m12 2 9 5-9 5-9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  zap: <path d="M13 2 3 14h8l-1 8 10-12h-8Z" />,
  code: <><path d="m8 9-4 3 4 3" /><path d="m16 9 4 3-4 3" /><path d="m14 5-4 14" /></>,
  pen: <><path d="m12 19 7-7-4-4-7 7-2 6Z" /><path d="m14 7 3-3 4 4-3 3" /></>,
  blocks: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  refresh: <><path d="M20 7h-5V2" /><path d="M20 7a9 9 0 1 0 1 7" /></>,
  gauge: <><path d="M4 18a8 8 0 1 1 16 0" /><path d="m12 14 4-4" /><path d="M4 18h16" /></>,
  lifebuoy: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="m5.6 5.6 3.7 3.7" /><path d="m14.7 14.7 3.7 3.7" /><path d="m18.4 5.6-3.7 3.7" /><path d="m9.3 14.7-3.7 3.7" /></>,
  message: <path d="M21 12a8 8 0 0 1-8 8H5l-3 2 1-5a8 8 0 1 1 18-5Z" />,
  smartphone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.7 9.7 6 7.3 3.6a4 4 0 0 0 5 5L21 17.3a2 2 0 0 1-3 3l-9-9" />,
  clipboard: <><rect x="4" y="4" width="16" height="18" rx="2" /><path d="M9 2h6v4H9Z" /><path d="m9 13 2 2 4-4" /></>,
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-2a6 6 0 0 1 12 0v2" /><path d="M16 5a3 3 0 0 1 0 6" /><path d="M18 14a5 5 0 0 1 3 4.5V21" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V4h8v3" /><path d="M3 12h18" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h6" /></>,
  receipt: <><path d="M5 3v18l3-2 4 2 4-2 3 2V3l-3 2-4-2-4 2Z" /><path d="M9 9h6" /><path d="M9 13h6" /></>,
  ticket: <><path d="M3 9a2 2 0 0 0 0 6v4h18v-4a2 2 0 0 0 0-6V5H3Z" /><path d="M9 5v14" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4" /><path d="M16 3v4" /><path d="M3 10h18" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  alert: <><path d="M10.3 3.6 2.2 18a2 2 0 0 0 1.8 3h16a2 2 0 0 0 1.8-3L13.7 3.6a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></>,
  external: <><path d="M15 3h6v6" /><path d="m10 14 11-11" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m6 6 1 15h10l1-15" /><path d="M10 11v6" /><path d="M14 11v6" /></>,
  filter: <path d="M3 4h18l-7 8v6l-4 2v-8Z" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  list: <><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></>,
  building: <><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M16 9h2a2 2 0 0 1 2 2v10" /><path d="M2 21h20" /><path d="M8 7h4" /><path d="M8 11h4" /><path d="M8 15h4" /></>,
  wallet: <><path d="M3 6a2 2 0 0 1 2-2h14v4" /><path d="M3 6v12a2 2 0 0 0 2 2h16V8H5a2 2 0 0 1-2-2Z" /><path d="M16 14h2" /></>,
  activity: <path d="M3 12h4l3 8 4-16 3 8h4" />,
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.7,
  ...props
}: { name: IconName; size?: number; strokeWidth?: number } & Omit<
  SVGProps<SVGSVGElement>,
  "name"
>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

export function serviceIcon(name: string): IconName {
  const map: Record<string, IconName> = {
    Code2: "code",
    PenTool: "pen",
    Blocks: "blocks",
    RefreshCw: "refresh",
    Gauge: "gauge",
    LifeBuoy: "lifebuoy",
    MessageSquare: "message",
    Smartphone: "smartphone",
    Target: "target",
    Wrench: "wrench",
    ClipboardCheck: "clipboard",
  };
  return map[name] ?? "sparkles";
}
