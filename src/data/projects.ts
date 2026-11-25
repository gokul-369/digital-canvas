import vigilensImg from "../assets/projects/vigilens.png";
import ociImg from "../assets/projects/oci.png";

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: string;
  domainUrl: string;
  liveUrl: string;
  githubUrl?: string;
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
    githubUrl: "https://github.com/gokul-369",
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
      { label: "Network Security", value: "Ingress Restricted" },
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
    githubUrl: "https://github.com/gokul-369",
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
      { label: "Maintenance", value: "Self-Sustaining Cron" },
    ],
    accentColor: "#a855f7", // Violet Nebula
    accentRgb: "168, 85, 247",
    badge: "02 · CLOUD INFRASTRUCTURE",
  },
];
