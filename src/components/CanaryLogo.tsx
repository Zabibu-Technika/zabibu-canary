// The Canary mark — an amber canary on a terminal-green branch.
// Built from primitives so it stays crisp at favicon size.

export function CanaryLogo({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* tail */}
      <path d="M11.5 19 L2.5 13.5 L6 21.5 Z" fill="#f5b73f" />
      {/* body */}
      <ellipse cx="17.5" cy="17" rx="9" ry="7" transform="rotate(-14 17.5 17)" fill="#f5b73f" />
      {/* head */}
      <circle cx="24" cy="11" r="5.2" fill="#f5b73f" />
      {/* beak */}
      <path d="M28.4 10.1 L31.4 11.8 L28.4 13.5 Z" fill="#e8912d" />
      {/* eye */}
      <circle cx="25" cy="9.8" r="1.2" fill="#0a0e14" />
      {/* wing */}
      <path d="M11.5 15.5 Q17.5 13.5 20.5 18.5 Q14.5 20.5 11.5 15.5 Z" fill="#d99a2b" />
      {/* legs */}
      <path d="M15.5 23.5 v2.5 M20 23.5 v2.5" stroke="#e8912d" strokeWidth="1.4" strokeLinecap="round" />
      {/* branch — terminal green, the canary's post */}
      <path d="M6 27.5 H26" stroke="#3fb950" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
