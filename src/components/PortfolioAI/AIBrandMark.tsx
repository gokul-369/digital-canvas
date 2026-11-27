import { useId } from "react";

export function AIBrandMark({ className = "h-4 w-4" }: { className?: string }) {
  const uid = useId();
  const gradId = `helios-grad-${uid}`;
  const ringId = `helios-ring-${uid}`;
  const maskId = `helios-mask-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="12"
          y1="52"
          x2="52"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient
          id={ringId}
          x1="8"
          y1="8"
          x2="56"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.35" />
        </linearGradient>
        <mask id={maskId}>
          <rect width="64" height="64" fill="white" />
          <circle cx="38" cy="27" r="15.5" fill="black" />
        </mask>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="25"
        stroke={`url(#${ringId})`}
        strokeWidth="2.8"
        strokeDasharray="112 45"
        strokeLinecap="round"
      />
      <circle
        cx="31"
        cy="33"
        r="18.5"
        fill={`url(#${gradId})`}
        mask={`url(#${maskId})`}
      />
      <circle cx="48" cy="17" r="2.6" fill="#38bdf8" />
    </svg>
  );
}
