import useTheme from "../../hooks/useTheme";

interface MovingGradientProps {
  className?: string;
  variant?: "experience" | "gallery" | "home";
}

export default function MovingGradient({
  className = "",
  variant = "experience",
}: MovingGradientProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none select-none ${
        isDark ? "bg-[#08090d]" : "bg-slate-50"
      } ${className}`}
    >
      {/* Subtle tech micro-dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-25"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)"
            : "radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 85%)",
        }}
      />

      {/* Floating Aurora / Ambient Glow Orbs */}
      <div className="absolute inset-0 filter blur-[90px] md:blur-[140px] opacity-70 dark:opacity-60 transform-gpu">
        {/* Orb 1: Indigo / Violet (Top Left) */}
        <div
          className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full animate-float-1 transform-gpu"
          style={{
            background: isDark
              ? variant === "gallery"
                ? "radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(139, 92, 246, 0.15) 60%, transparent 80%)"
                : variant === "home"
                  ? "radial-gradient(circle, rgba(147, 131, 210, 0.32) 0%, rgba(137, 152, 225, 0.16) 60%, transparent 80%)"
                  : "radial-gradient(circle, rgba(129, 140, 248, 0.32) 0%, rgba(99, 102, 241, 0.18) 60%, transparent 80%)"
              : "radial-gradient(circle, rgba(165, 180, 252, 0.35) 0%, rgba(199, 210, 254, 0.15) 60%, transparent 80%)",
          }}
        />

        {/* Orb 2: Cyan / Sky Blue (Bottom Right) */}
        <div
          className="absolute -bottom-[15%] -right-[10%] w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full animate-float-2 transform-gpu"
          style={{
            background: isDark
              ? variant === "gallery"
                ? "radial-gradient(circle, rgba(20, 184, 166, 0.28) 0%, rgba(56, 189, 248, 0.12) 60%, transparent 80%)"
                : variant === "home"
                  ? "radial-gradient(circle, rgba(137, 152, 225, 0.26) 0%, rgba(147, 131, 210, 0.12) 60%, transparent 80%)"
                  : "radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(99, 102, 241, 0.14) 60%, transparent 80%)"
              : "radial-gradient(circle, rgba(186, 230, 253, 0.35) 0%, rgba(224, 242, 254, 0.15) 60%, transparent 80%)",
          }}
        />

        {/* Orb 3: Warm Accent (Center / Middle) */}
        <div
          className="absolute top-[35%] left-[25%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full animate-float-3 transform-gpu"
          style={{
            background: isDark
              ? variant === "gallery"
                ? "radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(236, 72, 153, 0.08) 60%, transparent 80%)"
                : variant === "home"
                  ? "radial-gradient(circle, rgba(171, 167, 185, 0.18) 0%, rgba(147, 131, 210, 0.1) 60%, transparent 80%)"
                  : "radial-gradient(circle, rgba(251, 191, 36, 0.14) 0%, rgba(168, 85, 247, 0.12) 60%, transparent 80%)"
              : "radial-gradient(circle, rgba(254, 243, 199, 0.35) 0%, rgba(253, 230, 138, 0.12) 60%, transparent 80%)",
          }}
        />
      </div>

      {/* Atmospheric center depth radial */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 50%, transparent 40%, rgba(8, 9, 13, 0.6) 100%)"
            : "radial-gradient(circle at 50% 50%, transparent 40%, rgba(248, 250, 252, 0.6) 100%)",
        }}
      />
    </div>
  );
}
