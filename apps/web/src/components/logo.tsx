/** Folio mark — folded-page corner + geometric F. Matches the app icon. */
export function Logo({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" fill="none" aria-hidden className={className}>
      <path
        d="M200,0 H724 L1024,300 V824 A200,200 0 0 1 824,1024 H200 A200,200 0 0 1 0,824 V200 A200,200 0 0 1 200,0 Z"
        fill="#5277ff"
      />
      <path d="M724,0 L1024,300 L724,300 Z" fill="#3a56cf" />
      <g fill="#ffffff">
        <rect x="318" y="300" width="112" height="446" rx="18" />
        <rect x="318" y="300" width="392" height="112" rx="18" />
        <rect x="318" y="476" width="306" height="104" rx="16" />
      </g>
    </svg>
  );
}
