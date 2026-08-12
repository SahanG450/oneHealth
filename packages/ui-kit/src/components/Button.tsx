import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const variantClass: Record<Variant, string> = {
  primary:
    "text-white bg-brand-gradient shadow-soft hover:bg-brand-gradient-hover disabled:opacity-60",
  secondary:
    "text-brand-700 bg-brand-50 border border-brand-200 hover:bg-brand-100 disabled:opacity-60",
  ghost: "text-ink bg-transparent hover:bg-surface-muted disabled:opacity-60",
  danger: "text-white bg-red-600 hover:bg-red-700 disabled:opacity-60",
};

/** Canonical OneHealth button — use everywhere (web + admin). */
export function Button({
  variant = "primary",
  size = "md",
  loading,
  fullWidth,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition focus-visible:outline-none focus-visible:shadow-focus",
        sizeClass[size],
        variantClass[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? <span className="oh-btn-spinner" aria-hidden /> : null}
      {children}
    </button>
  );
}
