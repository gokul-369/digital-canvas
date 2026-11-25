import React, { useRef, useCallback } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.25)",
  ...rest
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (!divRef.current || !overlayRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      overlayRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${spotlightColor}, transparent 80%)`;
    },
    [spotlightColor],
  );

  const handleMouseEnter = useCallback(() => {
    if (overlayRef.current) overlayRef.current.style.opacity = "0.35";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
  }, []);

  const handleFocus = useCallback(() => {
    if (overlayRef.current) overlayRef.current.style.opacity = "0.35";
  }, []);

  const handleBlur = useCallback(() => {
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
      className={`relative p-5 overflow-hidden rounded-2xl
  backdrop-blur-xl
  transition-[transform,box-shadow,border-color] duration-300 cursor-pointer
  group ease-out hover:-translate-y-1 transform-gpu will-change-transform
  ${className}`}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
