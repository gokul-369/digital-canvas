import { useState, type FC } from "react";
import {
  HiOutlineServerStack,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineLockClosed,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
  HiOutlineBolt,
} from "react-icons/hi2";
import { SiGreensock } from "react-icons/si";

interface LogoDef {
  url?: string;
  invertDark?: boolean;
  icon?: "dokploy" | "shield" | "clock" | "lock" | "opensource" | "gsap" | "lenis";
}

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

function resolveLogo(name: string): LogoDef {
  const key = name.toLowerCase();

  if (key.includes("next")) {
    return { url: `${DEVICON}/nextjs/nextjs-original.svg`, invertDark: true };
  }
  if (key.includes("postgres")) {
    return { url: `${DEVICON}/postgresql/postgresql-original.svg` };
  }
  if (key.includes("docker")) {
    return { url: `${DEVICON}/docker/docker-original.svg` };
  }
  if (key.includes("oracle") || key.includes("oci")) {
    return { url: `${DEVICON}/oracle/oracle-original.svg` };
  }
  if (key.includes("cloudflare")) {
    return { url: `${DEVICON}/cloudflare/cloudflare-original.svg` };
  }
  if (key.includes("typescript")) {
    return { url: `${DEVICON}/typescript/typescript-original.svg` };
  }
  if (key.includes("tailwind")) {
    return { url: `${DEVICON}/tailwindcss/tailwindcss-original.svg` };
  }
  if (key.includes("ubuntu")) {
    return { url: `${DEVICON}/ubuntu/ubuntu-original.svg` };
  }
  if (key.includes("nginx")) {
    return { url: `${DEVICON}/nginx/nginx-original.svg` };
  }
  if (key.includes("bash")) {
    return { url: `${DEVICON}/bash/bash-original.svg`, invertDark: true };
  }
  if (key.includes("react")) {
    return { url: `${DEVICON}/react/react-original.svg` };
  }
  if (key.includes("three")) {
    return { url: `${DEVICON}/threejs/threejs-original.svg`, invertDark: true };
  }
  if (key.includes("vite")) {
    return { url: `${DEVICON}/vitejs/vitejs-original.svg` };
  }
  if (key.includes("vercel")) {
    return { url: `${DEVICON}/vercel/vercel-original.svg`, invertDark: true };
  }
  if (key.includes("dokploy")) {
    return { icon: "dokploy" };
  }
  if (key.includes("gsap")) {
    return { icon: "gsap" };
  }
  if (key.includes("lenis")) {
    return { icon: "lenis" };
  }
  if (key.includes("ufw") || key.includes("iptables") || key.includes("ingress") || key.includes("firewall")) {
    return { icon: "shield" };
  }
  if (key.includes("24/7") || key.includes("continuous")) {
    return { icon: "clock" };
  }
  if (key.includes("closed") || key.includes("private")) {
    return { icon: "lock" };
  }
  if (key.includes("public") || key.includes("open source")) {
    return { icon: "opensource" };
  }
  return { icon: "dokploy" };
}

export const TechLogo: FC<{ name: string; size?: number; className?: string }> = ({
  name,
  size = 16,
  className = "",
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const def = resolveLogo(name);

  if (def.url && !imgFailed) {
    return (
      <img
        src={def.url}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={() => setImgFailed(true)}
        style={{ width: size, height: size }}
        className={`object-contain shrink-0 ${def.invertDark ? "dark:invert" : ""} ${className}`}
      />
    );
  }

  const style = { width: size, height: size };

  switch (def.icon) {
    case "gsap":
      return <SiGreensock style={style} className={`text-emerald-500 shrink-0 ${className}`} />;
    case "lenis":
      return <HiOutlineBolt style={style} className={`text-pink-500 shrink-0 ${className}`} />;
    case "shield":
      return <HiOutlineShieldCheck style={style} className={`text-violet-500 shrink-0 ${className}`} />;
    case "clock":
      return <HiOutlineClock style={style} className={`text-emerald-500 shrink-0 ${className}`} />;
    case "lock":
      return <HiOutlineLockClosed style={style} className={`text-amber-500 shrink-0 ${className}`} />;
    case "opensource":
      return <HiOutlineGlobeAlt style={style} className={`text-emerald-500 shrink-0 ${className}`} />;
    case "dokploy":
      return <HiOutlineServerStack style={style} className={`text-sky-500 shrink-0 ${className}`} />;
    default:
      return <HiOutlineSparkles style={style} className={`text-indigo-500 shrink-0 ${className}`} />;
  }
};
