import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  buttonSizes,
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from "@/theme";

function classes(variant: ButtonVariant, size: ButtonSize, className = "") {
  return `vx-button ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`.trim();
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classes(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="vx-button__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  );
}
