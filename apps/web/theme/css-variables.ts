import type { CSSProperties } from "react";
import { palette, semanticColors, type ThemeName } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { radii } from "./radii";
import { shadows } from "./shadows";
import { borders } from "./borders";
import { zIndex } from "./z-index";
import { layout } from "./layout";
import { motion } from "./motion";

const paletteVariables = {
  "--vx-color-ink": palette.ink,
  "--vx-color-ink-raised": palette.inkRaised,
  "--vx-color-ink-soft": palette.inkSoft,
  "--vx-color-pine": palette.pine,
  "--vx-color-paper": palette.paper,
  "--vx-color-paper-deep": palette.paperDeep,
  "--vx-color-paper-bright": palette.paperBright,
  "--vx-color-white": palette.white,
  "--vx-color-lime": palette.lime,
  "--vx-color-lime-deep": palette.limeDeep,
  "--vx-color-mint": palette.mint,
  "--vx-color-coral": palette.coral,
  "--vx-color-sky": palette.sky,
  "--vx-color-amber": palette.amber,
  "--vx-color-olive": palette.olive,
  "--vx-color-olive-deep": palette.oliveDeep,
  "--vx-color-danger": palette.danger,
  "--vx-color-success": palette.success,
  "--vx-color-warning": palette.warning,
} as const;

const typographyVariables = {
  "--vx-font-display": typography.family.display,
  "--vx-font-body": typography.family.body,
  "--vx-font-mono": typography.family.mono,
  "--vx-weight-regular": typography.weight.regular,
  "--vx-weight-medium": typography.weight.medium,
  "--vx-weight-semibold": typography.weight.semibold,
  "--vx-weight-bold": typography.weight.bold,
  "--vx-weight-black": typography.weight.black,
  "--vx-text-xs": typography.size.xs,
  "--vx-text-sm": typography.size.sm,
  "--vx-text-base": typography.size.base,
  "--vx-text-md": typography.size.md,
  "--vx-text-lg": typography.size.lg,
  "--vx-text-xl": typography.size.xl,
  "--vx-text-2xl": typography.size["2xl"],
  "--vx-text-3xl": typography.size["3xl"],
  "--vx-text-4xl": typography.size["4xl"],
  "--vx-text-display": typography.size.display,
  "--vx-text-display-sm": typography.size.displaySm,
  "--vx-leading-tight": typography.lineHeight.tight,
  "--vx-leading-snug": typography.lineHeight.snug,
  "--vx-leading-normal": typography.lineHeight.normal,
  "--vx-leading-relaxed": typography.lineHeight.relaxed,
  "--vx-tracking-tight": typography.letterSpacing.tight,
  "--vx-tracking-snug": typography.letterSpacing.snug,
  "--vx-tracking-normal": typography.letterSpacing.normal,
  "--vx-tracking-wide": typography.letterSpacing.wide,
  "--vx-tracking-widest": typography.letterSpacing.widest,
  "--vx-measure-narrow": typography.measure.narrow,
  "--vx-measure-normal": typography.measure.normal,
  "--vx-measure-wide": typography.measure.wide,
} as const;

const spacingVariables = Object.fromEntries(
  Object.entries(spacing).map(([key, value]) => [`--vx-space-${key}`, value])
) as Record<string, string>;

const radiusVariables = Object.fromEntries(
  Object.entries(radii).map(([key, value]) => [`--vx-radius-${key}`, value])
) as Record<string, string>;

const shadowVariables = Object.fromEntries(
  Object.entries(shadows).map(([key, value]) => [`--vx-shadow-${key}`, value])
) as Record<string, string>;

const motionVariables = {
  "--vx-duration-instant": motion.duration.instant,
  "--vx-duration-fast": motion.duration.fast,
  "--vx-duration-normal": motion.duration.normal,
  "--vx-duration-slow": motion.duration.slow,
  "--vx-duration-reveal": motion.duration.reveal,
  "--vx-ease-standard": motion.easing.standard,
  "--vx-ease-emphasis": motion.easing.emphasis,
  "--vx-ease-spring": motion.easing.spring,
  "--vx-z-sticky": String(zIndex.sticky),
  "--vx-z-header": String(zIndex.header),
  "--vx-z-overlay": String(zIndex.overlay),
  "--vx-z-modal": String(zIndex.modal),
  "--vx-z-toast": String(zIndex.toast),
  "--vx-border-hairline": borders.hairline,
  "--vx-border-medium": borders.medium,
  "--vx-border-heavy": borders.heavy,
  "--vx-container": layout.container,
  "--vx-container-wide": layout.containerWide,
  "--vx-container-narrow": layout.containerNarrow,
  "--vx-header-height": layout.headerHeight,
  "--vx-sidebar-width": layout.sidebarWidth,
  "--vx-prose": layout.prose,
} as const;

export function cssVariables(theme: ThemeName = "light"): CSSProperties {
  const semantic = semanticColors[theme];
  return {
    ...paletteVariables,
    ...typographyVariables,
    ...spacingVariables,
    ...radiusVariables,
    ...shadowVariables,
    ...motionVariables,
    "--vx-bg": semantic.bg,
    "--vx-surface": semantic.surface,
    "--vx-elev": semantic.elev,
    "--vx-text": semantic.text,
    "--vx-muted": semantic.muted,
    "--vx-faint": semantic.faint,
    "--vx-border-color": semantic.border,
    "--vx-border-color-strong": semantic.borderStrong,
    "--vx-accent": semantic.accent,
    "--vx-accent-strong": semantic.accentStrong,
    "--vx-accent-text": semantic.accentText,
    "--vx-highlight": semantic.highlight,
    "--vx-info": semantic.info,
    "--vx-inverse-bg": semantic.inverseBg,
    "--vx-inverse-text": semantic.inverseText,
  } as CSSProperties;
}
