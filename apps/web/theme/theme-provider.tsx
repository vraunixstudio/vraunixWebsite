import type { ReactNode } from "react";
import { cssVariables } from "./css-variables";
import type { ThemeName } from "./colors";

export function ThemeProvider({
  children,
  theme = "light",
  className = "",
}: {
  children: ReactNode;
  theme?: ThemeName;
  className?: string;
}) {
  return (
    <div
      className={`vx-theme ${className}`.trim()}
      data-theme={theme}
      style={cssVariables(theme)}
    >
      {children}
    </div>
  );
}
