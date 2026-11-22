import sharp from "sharp";
import fs from "fs";
import path from "path";

const books = [
  {
    id: "trial",
    title: "THE TRIAL",
    subtitle: "DER PROCESS",
    author: "FRANZ KAFKA",
    year: "1925",
    color: "#6366f1",
    bgDark: "#080a12",
    bgMid: "#131828",
    accent: "#a5b4fc",
    theme: "monolith",
    symbol: "⚖",
    quote: "A LABYRINTH OF INVISIBLE GUILT"
  },
  {
    id: "white-nights",
    title: "WHITE NIGHTS",
    subtitle: "A SENTIMENTAL STORY",
    author: "FYODOR DOSTOEVSKY",
    year: "1848",
    color: "#38bdf8",
    bgDark: "#040c1a",
    bgMid: "#0c2340",
    accent: "#7dd3fc",
    theme: "aurora",
    symbol: "✦",
    quote: "A WHOLE MOMENT OF HAPPINESS"
  },
  {
    id: "metamorphosis",
    title: "THE METAMORPHOSIS",
    subtitle: "DIE VERWANDLUNG",
    author: "FRANZ KAFKA",
    year: "1915",
    color: "#d97706",
    bgDark: "#140c06",
    bgMid: "#2a1a0c",
    accent: "#fbbf24",
    theme: "scarab",
    symbol: "◈",
    quote: "UNEXPECTED TRANSFORMATION"
  },
  {
    id: "animal-farm",
    title: "ANIMAL FARM",
    subtitle: "A FAIRY STORY",
    author: "GEORGE ORWELL",
    year: "1945",
    color: "#ef4444",
    bgDark: "#1a0608",
    bgMid: "#350c12",
    accent: "#f87171",
    theme: "constructivist",
    symbol: "★",
    quote: "ALL ANIMALS ARE EQUAL"
  },
  {
    id: "oliver-twist",
    title: "OLIVER TWIST",
    subtitle: "THE PARISH BOY'S PROGRESS",
    author: "CHARLES DICKENS",
    year: "1838",
    color: "#eab308",
    bgDark: "#141108",
    bgMid: "#2b220e",
    accent: "#fde047",
    theme: "victorian",
    symbol: "🕯",
    quote: "UNBROKEN MORAL RESILIENCE"
  },
  {
    id: "siddhartha",
    title: "SIDDHARTHA",
    subtitle: "AN INDIAN TALE",
    author: "HERMANN HESSE",
    year: "1922",
    color: "#a855f7",
    bgDark: "#10091c",
    bgMid: "#24133d",
    accent: "#c084fc",
    theme: "lotus",
    symbol: "☸",
    quote: "THE RIVER OF CONSCIOUSNESS"
  },
  {
    id: "alchemist",
    title: "THE ALCHEMIST",
    subtitle: "FOLLOW YOUR PERSONAL LEGEND",
    author: "PAULO COELHO",
    year: "1988",
    color: "#f59e0b",
    bgDark: "#180f05",
    bgMid: "#331f08",
    accent: "#fbbf24",
    theme: "desert",
    symbol: "▲",
    quote: "CONSPIRED BY THE UNIVERSE"
  },
  {
    id: "psychology-of-money",
    title: "THE PSYCHOLOGY OF MONEY",
    subtitle: "TIMELESS LESSONS ON WEALTH",
    author: "MORGAN HOUSEL",
    year: "2020",
    color: "#10b981",
    bgDark: "#04140f",
    bgMid: "#0c2d22",
    accent: "#34d399",
    theme: "geometric",
    symbol: "◇",
    quote: "BEHAVIOR OVER NUMBERS"
  },
  {
    id: "subtle-art",
    title: "THE SUBTLE ART",
    subtitle: "OF NOT GIVING A F*CK",
    author: "MARK MANSON",
    year: "2016",
    color: "#f97316",
    bgDark: "#1c0d04",
    bgMid: "#3b1a06",
    accent: "#fb923c",
    theme: "brutalist",
    symbol: "✕",
    quote: "CHOOSE YOUR STRUGGLE"
  },
  {
    id: "three-mistakes",
    title: "3 MISTAKES OF MY LIFE",
    subtitle: "CRICKET · BUSINESS · DESTINY",
    author: "CHETAN BHAGAT",
    year: "2008",
    color: "#06b6d4",
    bgDark: "#061318",
    bgMid: "#0d2b36",
    accent: "#22d3ee",
    theme: "cosmic-city",
    symbol: "○",
    quote: "TAKING THE UNFORGIVING RISK"
  },
  {
    id: "call-center",
    title: "ONE NIGHT @ CALL CENTER",
    subtitle: "A SINGULAR PHONE CALL",
    author: "CHETAN BHAGAT",
    year: "2005",
    color: "#8b5cf6",
    bgDark: "#0d091a",
    bgMid: "#1e1438",
    accent: "#a78bfa",
    theme: "cyber-constellation",
    symbol: "✦",
    quote: "FIND YOUR INNER CALLING"
  },
  {
    id: "melanin-sun",
    title: "FROM THE NOTEBOOKS",
    subtitle: "OF MELANIN SUN",
    author: "JACQUELINE WOODSON",
    year: "1995",
    color: "#ec4899",
    bgDark: "#1c0713",
    bgMid: "#380f27",
    accent: "#f472b6",
    theme: "sunset-notes",
    symbol: "✐",
    quote: "TRUTH AND THE BONDS OF LOVE"
  }
];

function generateCoverSvg(b) {
  return `
<svg width="1200" height="1800" viewBox="0 0 1200 1800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${b.bgMid}" />
      <stop offset="50%" stop-color="${b.bgDark}" />
      <stop offset="100%" stop-color="#020306" />
    </linearGradient>

    <!-- Celestial Aura Glow -->
    <radialGradient id="auraGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="${b.color}" stop-opacity="0.45" />
      <stop offset="50%" stop-color="${b.color}" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Metallic Gold Foil Gradient -->
    <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff8e7" />
      <stop offset="35%" stop-color="${b.accent}" />
      <stop offset="70%" stop-color="${b.color}" />
      <stop offset="100%" stop-color="#ffd580" />
    </linearGradient>

    <!-- Vignette Shade -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="60%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.75" />
    </radialGradient>
  </defs>

  <!-- Deep Canvas Background -->
  <rect width="1200" height="1800" fill="url(#bgGrad)" />
  <rect width="1200" height="1800" fill="url(#auraGlow)" />

  <!-- Geometric / Abstract Artwork Centerpiece -->
  <g opacity="0.85">
    <!-- Outer Celestial Rings -->
    <circle cx="600" cy="850" r="380" fill="none" stroke="url(#foilGrad)" stroke-width="2" stroke-dasharray="12 16" opacity="0.35" />
    <circle cx="600" cy="850" r="320" fill="none" stroke="url(#foilGrad)" stroke-width="1.5" opacity="0.5" />
    <circle cx="600" cy="850" r="260" fill="none" stroke="${b.accent}" stroke-width="1" stroke-dasharray="6 8" opacity="0.4" />
    <circle cx="600" cy="850" r="190" fill="none" stroke="url(#foilGrad)" stroke-width="2.5" opacity="0.7" />

    <!-- Radiant Ray Burst -->
    <path d="M 600,450 L 600,1250 M 200,850 L 1000,850 M 317,567 L 883,1133 M 317,1133 L 883,567" 
          stroke="${b.accent}" stroke-width="1" opacity="0.25" />

    <!-- Center Monogram Emblem -->
    <polygon points="600,680 750,850 600,1020 450,850" fill="${b.color}" fill-opacity="0.15" stroke="url(#foilGrad)" stroke-width="3" />
    <polygon points="600,720 710,850 600,980 490,850" fill="none" stroke="${b.accent}" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6" />

    <!-- Central Mythic Icon -->
    <text x="600" y="885" font-family="serif" font-size="110" font-weight="bold" fill="url(#foilGrad)" text-anchor="middle" opacity="0.95">
      ${b.symbol}
    </text>
  </g>

  <!-- Ornate Triple Architectural Framing -->
  <rect x="70" y="70" width="1060" height="1660" fill="none" stroke="url(#foilGrad)" stroke-width="4" opacity="0.85" />
  <rect x="90" y="90" width="1020" height="1620" fill="none" stroke="${b.accent}" stroke-width="1.5" opacity="0.4" />
  <rect x="105" y="105" width="990" height="1590" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="10 14" />

  <!-- Corner Rosettes -->
  <circle cx="90" cy="90" r="10" fill="url(#foilGrad)" />
  <circle cx="1110" cy="90" r="10" fill="url(#foilGrad)" />
  <circle cx="90" cy="1710" r="10" fill="url(#foilGrad)" />
  <circle cx="1110" cy="1710" r="10" fill="url(#foilGrad)" />

  <!-- Left Spine Shadow Crease -->
  <rect x="0" y="0" width="65" height="1800" fill="black" opacity="0.45" />

  <!-- Top Metadata Header -->
  <text x="600" y="195" font-family="'Space Grotesk', monospace, sans-serif" font-size="28" font-weight="700" letter-spacing="12" fill="${b.accent}" text-anchor="middle">
    ASHEN PRESS · COLLECTOR'S EDITION
  </text>
  <line x1="450" y1="225" x2="750" y2="225" stroke="url(#foilGrad)" stroke-width="2" opacity="0.7" />
  <circle cx="600" cy="225" r="4" fill="${b.accent}" />

  <!-- Book Title -->
  <text x="600" y="380" font-family="'Space Grotesk', serif, sans-serif" font-size="76" font-weight="900" letter-spacing="4" fill="#ffffff" text-anchor="middle">
    ${b.title}
  </text>

  <!-- Subtitle -->
  <text x="600" y="450" font-family="serif" font-style="italic" font-size="34" letter-spacing="2" fill="${b.accent}" text-anchor="middle" opacity="0.9">
    "${b.subtitle}"
  </text>

  <!-- Quote Inscription -->
  <text x="600" y="1320" font-family="'Space Grotesk', monospace, sans-serif" font-size="22" letter-spacing="8" fill="rgba(255,255,255,0.7)" text-anchor="middle">
    ${b.quote}
  </text>
  <line x1="380" y1="1350" x2="820" y2="1350" stroke="${b.accent}" stroke-width="1.5" opacity="0.4" />

  <!-- Author Name -->
  <text x="600" y="1480" font-family="'Space Grotesk', serif, sans-serif" font-size="48" font-weight="800" letter-spacing="8" fill="url(#foilGrad)" text-anchor="middle">
    ${b.author}
  </text>

  <!-- Year & Archive Tag -->
  <text x="600" y="1550" font-family="monospace" font-size="24" letter-spacing="6" fill="rgba(255,255,255,0.55)" text-anchor="middle">
    PUBLISHED ${b.year} · ARCHIVAL VOLUME
  </text>

  <!-- Bottom Vignette Shade -->
  <rect width="1200" height="1800" fill="url(#vignette)" pointer-events="none" />
</svg>
`;
}

async function renderCovers() {
  const outDir = path.resolve("src/assets/books");
  fs.mkdirSync(outDir, { recursive: true });

  for (const b of books) {
    const svgStr = generateCoverSvg(b);
    const dest = path.join(outDir, `${b.id}.jpg`);
    await sharp(Buffer.from(svgStr))
      .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
      .toFile(dest);
    const stats = fs.statSync(dest);
    console.log(`Rendered ${b.id}.jpg (${stats.size} bytes)`);
  }
}

renderCovers().then(() => console.log("All 12 high-res collector covers generated successfully!"));
