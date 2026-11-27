import { useId } from "react";

export function AIBrandMark({ className = "h-4 w-4" }: { className?: string }) {
  const uid = useId();
  const gradId = `ai-mark-grad-${uid}`;
  const ringId = `ai-mark-ring-${uid}`;

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
          x1="10"
          y1="54"
          x2="54"
          y2="10"
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
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke={`url(#${ringId})`}
        strokeWidth="3.2"
        strokeDasharray="116 32"
        strokeLinecap="round"
      />
      <path
        d="M32 12C33.6 23.8 40.2 30.4 52 32C40.2 33.6 33.6 40.2 32 52C30.4 40.2 23.8 33.6 12 32C23.8 30.4 30.4 23.8 32 12Z"
        fill={`url(#${gradId})`}
      />
      <circle cx="50" cy="16" r="3" fill="#38bdf8" />
    </svg>
  );
}
