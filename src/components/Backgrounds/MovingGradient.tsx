import type { pageProp } from "../../types";

export default function MovingGradient({ theme }: pageProp) {
  const gradient =
    theme === "light"
      ? `bg-white`
      : `bg-[radial-gradient(900px_circle_at_0%_0%,rgba(129,140,248,0.28),transparent_60%),radial-gradient(900px_circle_at_100%_100%,rgba(56,189,248,0.22),transparent_60%),radial-gradient(800px_circle_at_50%_50%,rgba(15,23,42,1),transparent_70%)]
`;
  return (
    <div
      className={`
    fixed inset-0 -z-10 w-full
    ${gradient}
  `}
    />
  );
}
