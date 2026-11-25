export interface ProjectTelemetry {
  status: "ONLINE" | "STANDBY" | "ACTIVE" | "DEPRECATED";
  latencyMs?: number;
  uptime?: string;
  protocol?: string;
  port?: number | string;
  nodeLocation?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: "Observability & Telemetry" | "Cloud Infrastructure" | "Full-Stack Application" | "Web System";
  description: string;
  highlights: string[];
  stack: string[];
  telemetry: ProjectTelemetry;
  liveUrl?: string;
  githubUrl?: string;
  accentColor: string;
  badge: string;
  hardwareSpec: {
    bladeId: string;
    freq: string;
    power: string;
    rackUnit: string;
  };
}

export const projectsList: ProjectItem[] = [
  {
    id: "vigilens",
    title: "VigiLens",
    tagline: "Autonomous Endpoint Observability & Telemetry Engine",
    category: "Observability & Telemetry",
    description:
      "A high-precision endpoint tracking tool engineered to observe, monitor, and diagnose distributed API endpoints in real-time. Features automated heartbeat pinging, payload tracing, latency distribution heatmaps, and failure alerts.",
    highlights: [
      "Sub-millisecond endpoint ping & round-trip latency tracking",
      "Dynamic response code classification (2xx, 4xx, 5xx) with anomaly detection",
      "Packet inspection and header diffing for zero-downtime migrations",
      "Live event-stream telemetry over persistent WebSockets",
    ],
    stack: ["TypeScript", "Node.js", "React", "WebSockets", "TailwindCSS", "Docker"],
    telemetry: {
      status: "ONLINE",
      latencyMs: 14,
      uptime: "99.98%",
      protocol: "HTTPS / WSS",
      port: 443,
      nodeLocation: "VPS Node 01",
    },
    liveUrl: "https://vigilens.app", // placeholder - to be updated with user URL
    githubUrl: "https://github.com/gokul-369",
    accentColor: "#38bdf8", // Sky Cyan
    badge: "FLAGSHIP TOOL",
    hardwareSpec: {
      bladeId: "OBS-01",
      freq: "3.2 GHz",
      power: "12W ACTIVE",
      rackUnit: "1U",
    },
  },
  {
    id: "vps-infra",
    title: "Custom VPS Cloud Engine",
    tagline: "Hardened Self-Hosted Infrastructure & Production Node",
    category: "Cloud Infrastructure",
    description:
      "A self-configured and hardened Virtual Private Server running production services, reverse proxy layers, automated SSL provisioning, isolated Docker network bridge, and continuous uptime monitoring.",
    highlights: [
      "Custom Linux OS kernel tuning and firewall (UFW/iptables) hardening",
      "Nginx reverse proxy with automated Let's Encrypt SSL certificate rotation",
      "Multi-container Docker Compose mesh with zero-port leakage",
      "Automated system health telemetry, log rotation, and swap optimization",
    ],
    stack: ["Ubuntu Linux", "Nginx", "Docker", "Bash", "Systemd", "Certbot"],
    telemetry: {
      status: "ACTIVE",
      latencyMs: 8,
      uptime: "99.99%",
      protocol: "SSH / TCP",
      port: 22,
      nodeLocation: "EU-Central",
    },
    liveUrl: "https://github.com/gokul-369",
    githubUrl: "https://github.com/gokul-369",
    accentColor: "#a855f7", // Violet / Nebula
    badge: "INFRASTRUCTURE",
    hardwareSpec: {
      bladeId: "SRV-NODE-02",
      freq: "Xeon 2.8GHz",
      power: "24W PEAK",
      rackUnit: "2U",
    },
  },
  {
    id: "staticpro",
    title: "StaticPro",
    tagline: "Production Engineering & Architecture Portal",
    category: "Full-Stack Application",
    description:
      "A production-grade web system crafted to showcase scalable frontend architectures, high-performance rendering pipelines, and modular code isolation under real-world traffic.",
    highlights: [
      "Optimized static asset bundling and sub-second cold starts",
      "Modular component hierarchy with strict TypeScript contracts",
      "Multi-device responsive layout with accessible keyboard navigation",
    ],
    stack: ["React", "JavaScript", "HTML5", "CSS3", "Vite"],
    telemetry: {
      status: "STANDBY",
      latencyMs: 22,
      uptime: "99.95%",
      protocol: "HTTPS",
      port: 443,
      nodeLocation: "Global Edge",
    },
    liveUrl: "https://github.com/gokul-369/Staticpro",
    githubUrl: "https://github.com/gokul-369/Staticpro",
    accentColor: "#fbbf24", // Solar Amber
    badge: "CORE BUILD",
    hardwareSpec: {
      bladeId: "APP-03",
      freq: "1.8 GHz",
      power: "8W ECO",
      rackUnit: "1U",
    },
  },
];
