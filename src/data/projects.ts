import vigilensImg from "../assets/projects/vigilens.png";
import ociImg from "../assets/projects/oci.png";
import portfolioImg from "../assets/projects/portfolio.png";

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: string;
  domainUrl: string;
  liveUrl: string;
  githubUrl?: string;
  isPrivate: boolean;
  repoAccessNote: string;
  description: string;
  architectureHighlights: {
    title: string;
    description: string;
  }[];
  stack: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  accentColor: string;
  accentRgb: string;
  previewImage: string;
  badge: string;
}

export const projectsList: ProjectItem[] = [
  {
    id: "vigilens",
    title: "VigiLens",
    tagline: "Autonomous Endpoint Tracking & Observability Platform",
    category: "Full-Stack Observability",
    domainUrl: "vigilens.gokul.ink",
    liveUrl: "https://vigilens.gokul.ink",
    isPrivate: true,
    repoAccessNote: "Proprietary internal architecture. Database & API contracts detailed below.",
    previewImage: vigilensImg,
    description:
      "A full-stack endpoint tracking and observability platform designed to monitor API availability, payload health, and response latency in real-time. Engineered with a secure multi-tier architecture where the database is completely walled off from the open internet.",
    architectureHighlights: [
      {
        title: "Isolated Database Ingress",
        description: "PostgreSQL database instance is completely air-gapped from the public internet via strict firewall ingress rules; only the Next.js application container has access.",
      },
      {
        title: "Full-Stack Next.js Engine",
        description: "Server-side rendered telemetry views, low-latency API routes, and real-time endpoint status dashboards.",
      },
      {
        title: "Automated Dokploy Deployment",
        description: "Continuous deployment pipeline running inside an isolated Docker network on Oracle Cloud Infrastructure.",
      },
    ],
    stack: ["Next.js", "PostgreSQL", "Dokploy", "Oracle Cloud (OCI)", "TypeScript", "TailwindCSS", "Docker"],
    metrics: [
      { label: "Deployment", value: "Dokploy CI/CD" },
      { label: "Database", value: "Isolated PostgreSQL" },
      { label: "Hosting", value: "Oracle Cloud VPS" },
      { label: "Codebase Access", value: "Closed Source / Private" },
    ],
    accentColor: "#38bdf8", // Sky Cyan
    accentRgb: "56, 189, 248",
    badge: "01 · FULL STACK ENGINE",
  },
  {
    id: "oci-vps",
    title: "Oracle Cloud Infrastructure (OCI)",
    tagline: "24/7 Hardened Production Cloud Node & Dokploy Cluster",
    category: "Cloud Infrastructure & DevOps",
    domainUrl: "oci.gokul.ink",
    liveUrl: "https://oci.gokul.ink",
    isPrivate: true,
    repoAccessNote: "Production server infrastructure configs & ingress rules managed privately.",
    previewImage: ociImg,
    description:
      "A dedicated, always-on Oracle Cloud VM configured from the ground up for maximum security, multi-tenant container orchestration, and continuous operation. Governed by hardened ingress/egress rules with automated maintenance and self-sustaining cleanup routines.",
    architectureHighlights: [
      {
        title: "Hardened Security Architecture",
        description: "Custom OCI Virtual Cloud Network (VCN) with strict stateful security lists, locked down port ingress, and restricted SSH access.",
      },
      {
        title: "Centralized Dokploy Control Panel",
        description: "Multi-project container orchestration hub managing deployments, reverse proxy routing, and automatic SSL certificate generation.",
      },
      {
        title: "Self-Sustaining Maintenance",
        description: "Automated cron-based Docker image pruning, log rotation, resource monitoring, and swap optimization ensuring 24/7 uptime without manual intervention.",
      },
    ],
    stack: ["Oracle Cloud (OCI)", "Ubuntu Linux", "Dokploy", "Docker Compose", "Nginx", "UFW / iptables", "Bash"],
    metrics: [
      { label: "Uptime", value: "24/7 Continuous" },
      { label: "Firewall", value: "Strict Ingress/Egress" },
      { label: "Orchestration", value: "Dokploy Cluster" },
      { label: "Codebase Access", value: "Closed Source / Private" },
    ],
    accentColor: "#a855f7", // Violet Nebula
    accentRgb: "168, 85, 247",
    badge: "02 · CLOUD INFRASTRUCTURE",
  },
  {
    id: "digital-canvas",
    title: "Digital Canvas",
    tagline: "Interactive 3D Portfolio & Creative Engineering System",
    category: "Creative Engineering & 3D WebGL",
    domainUrl: "gokul.ink",
    liveUrl: "https://gokul.ink",
    githubUrl: "https://github.com/gokul-369/digital-canvas",
    isPrivate: false,
    repoAccessNote: "Open source on GitHub under MIT license.",
    previewImage: portfolioImg,
    description:
      "A bespoke, high-performance digital portfolio engineered at the intersection of creative interaction and systems engineering. Features custom Three.js WebGL viewports, an interactive 3D reading codex, procedural cosmic dust simulations, and zero-jank Lenis/GSAP scroll choreography.",
    architectureHighlights: [
      {
        title: "Procedural Three.js Shaders",
        description: "Custom vertex/fragment displacement shaders for tactile image transitions, realistic starfields, and physics-based 3D card tilt.",
      },
      {
        title: "Zero-Jank Motion Architecture",
        description: "Decoupled Lenis smooth scrolling synced with GSAP ScrollTrigger and React 19 concurrent features.",
      },
      {
        title: "Adaptive Ambient Environment",
        description: "Dynamically reactive light/dark cosmic particle engines running at 60fps with automatic hardware throttling.",
      },
    ],
    stack: ["React 19", "TypeScript", "Three.js", "TailwindCSS", "GSAP", "Lenis", "Vite"],
    metrics: [
      { label: "Rendering", value: "Three.js / WebGL" },
      { label: "Motion", value: "GSAP + Lenis" },
      { label: "Hosting", value: "Vercel Global Edge" },
      { label: "Codebase Access", value: "Public Open Source" },
    ],
    accentColor: "#22c55e", // Emerald
    accentRgb: "34, 197, 94",
    badge: "03 · OPEN SOURCE SYSTEM",
  },
];
