export const breakpoints = {
  xs: 360,
  sm: 480,
  md: 720,
  lg: 960,
  xl: 1200,
  "2xl": 1440,
} as const;

export function mediaUp(value: keyof typeof breakpoints): string {
  return `@media (min-width: ${breakpoints[value]}px)`;
}
