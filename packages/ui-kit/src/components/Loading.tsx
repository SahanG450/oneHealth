import React from "react";

export interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

/** Canonical branded loader — same visual language across web, admin, and mobile ports. */
export function Loading({ label = "Loading…", fullScreen, size = "md" }: LoadingProps) {
  const dim = size === "sm" ? 32 : size === "lg" ? 64 : 48;
  const content = (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div className="oh-loader" style={{ width: dim, height: dim }}>
        <svg viewBox="0 0 64 64" className="oh-loader-svg" aria-hidden>
          <circle cx="32" cy="32" r="26" className="oh-loader-ring" />
          <path
            className="oh-loader-arc"
            d="M32 6a26 26 0 0 1 26 26"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path className="oh-loader-cross" d="M32 22v20M22 32h20" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      {label ? <p className="text-sm font-medium text-ink-muted animate-oh-pulse">{label}</p> : null}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }
  return content;
}
