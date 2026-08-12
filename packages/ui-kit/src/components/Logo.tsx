export interface LogoProps {
  /** Path to logo asset (web: /logo.png). Full lockup already includes wordmark. */
  src?: string;
  markOnly?: boolean;
  className?: string;
  /** Display height in px. Default 56 for readable brand mark. */
  height?: number;
}

/**
 * OneHealth brand mark. The PNG is a full lockup (icon + "OneHealth"),
 * so we do not append duplicate text unless markOnly is used with a mark asset.
 */
export function Logo({
  src = "/logo.png",
  markOnly = false,
  className = "",
  height = 120,
}: LogoProps) {
  // Full lockup is wide (~2.7:1). Keep aspect ratio so it stays readable.
  const width = markOnly ? height : Math.round(height * 2.75);

  return (
    <img
      src={src}
      alt="OneHealth"
      width={width}
      height={height}
      className={`object-contain object-left ${className}`}
      style={{ height, width: markOnly ? height : "auto", maxWidth: markOnly ? height : width }}
    />
  );
}
