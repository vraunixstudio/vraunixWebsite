export const buttonVariants = {
  primary: "vx-button--primary",
  secondary: "vx-button--secondary",
  ghost: "vx-button--ghost",
  danger: "vx-button--danger",
  quiet: "vx-button--quiet",
} as const;

export const buttonSizes = {
  sm: "vx-button--sm",
  md: "vx-button--md",
  lg: "vx-button--lg",
} as const;

export const badgeTones = {
  neutral: "vx-badge--neutral",
  accent: "vx-badge--accent",
  success: "vx-badge--success",
  warning: "vx-badge--warning",
  danger: "vx-badge--danger",
  info: "vx-badge--info",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;
export type BadgeTone = keyof typeof badgeTones;
