import React from "react";

export function Card({
  children,
  className = "",
  interactive,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-surface-border bg-white p-5 shadow-soft",
        interactive ? "transition hover:border-brand-200 hover:shadow-md" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: "brand" | "success" | "warning" | "neutral" | "danger";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-800",
    neutral: "bg-slate-100 text-slate-700",
    danger: "bg-red-50 text-red-700",
  };
  return (
    <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-navy-soft md:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-ink-muted">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-surface-muted px-6 py-14 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-md text-sm text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/** Shared login/register shell — identical look for web + admin. */
export function AuthShell({
  title,
  subtitle,
  children,
  logoSrc = "/logo.png",
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  logoSrc?: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className="oh-auth-bg min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={logoSrc} alt="OneHealth" className="mb-4 h-14 object-contain" />
          <h1 className="font-display text-2xl font-bold text-navy-soft">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-ink-muted">{subtitle}</p> : null}
        </div>
        <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-soft">{children}</div>
        {footer ? <div className="mt-5 text-center text-sm text-ink-muted">{footer}</div> : null}
      </div>
    </div>
  );
}
