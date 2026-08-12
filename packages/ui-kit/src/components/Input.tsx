import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className = "", id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label ? <span className="font-semibold text-ink">{label}</span> : null}
      <input
        id={inputId}
        {...props}
        className={[
          "h-11 w-full rounded-xl border bg-white px-3.5 text-ink placeholder:text-ink-faint transition",
          "focus:border-brand-400 focus:outline-none focus:shadow-focus",
          error ? "border-red-400" : "border-surface-border",
          className,
        ].join(" ")}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-ink-muted">{hint}</span> : null}
    </label>
  );
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className = "", ...props }: TextAreaProps) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label ? <span className="font-semibold text-ink">{label}</span> : null}
      <textarea
        {...props}
        className={[
          "min-h-[110px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-ink placeholder:text-ink-faint transition",
          "focus:border-brand-400 focus:outline-none focus:shadow-focus",
          error ? "border-red-400" : "border-surface-border",
          className,
        ].join(" ")}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
