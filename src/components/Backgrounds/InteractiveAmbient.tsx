import { useEffect, useRef, memo } from "react";
import useTheme from "../../hooks/useTheme";

export type CosmicVariant = "home" | "experience" | "gallery" | "skills" | "books";

interface InteractiveAmbientProps {
  variant?: CosmicVariant;
  className?: string;
}

interface CosmicStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
  hasSpikes: boolean;
  hasGlowHalo: boolean;
  spikeLength: number;
}

interface ShootingEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  headRadius: number;
  alpha: number;
  maxAlpha: number;
  progress: number;
  duration: number;
  active: boolean;
  isMeteor: boolean; // true = fast meteor streak, false = major comet with dust sheath
}

interface SunlightMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  rgb: string;
  swaySpeed: number;
  swayPhase: number;
  swayAmplitude: number;
}

function InteractiveAmbient({
  variant = "home",
  className = "",
}: InteractiveAmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let isVisible = true;
    let isScrolling = false;
    let scrollTimeout: number;

    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    // Density of stars
    const starCount = isMobile ? 80 : isTablet ? 130 : 190;
    const moteCount = isMobile ? 65 : isTablet ? 95 : 135;

    // Authentic astronomical stellar spectrum
    const darkStarColors = [
      "#ffffff", // Class A: pure diamond white
      "#ffffff",
      "#f8fafc",
      "#e0f2fe", // Class B: brilliant blue-white
      "#bae6fd",
      "#fef3c7", // Class F/G: warm solar white
      "#fde68a", // Class K: soft stellar gold
      "#e9d5ff", // Soft nebula lilac tint
    ];

    // High brilliance starfield with optical diffraction spikes on first-magnitude stars
    const stars: CosmicStar[] = isDark
      ? Array.from({ length: starCount }, (_, idx) => {
          const isPrime = idx < Math.floor(starCount * 0.08); // 8% primary diamond stars with diffraction spikes
          const isMajor = !isPrime && idx < Math.floor(starCount * 0.28); // 20% second-magnitude stars with soft halo

          const radius = isPrime
            ? Math.random() * 0.7 + 1.8 // 1.8px - 2.5px
            : isMajor
              ? Math.random() * 0.5 + 1.1 // 1.1px - 1.6px
              : Math.random() * 0.45 + 0.55; // 0.55px - 1.0px sharp field stars

          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.02,
            vy: (Math.random() - 0.5) * 0.02,
            radius,
            baseAlpha: isPrime
              ? 0.98
              : isMajor
                ? Math.random() * 0.3 + 0.65
                : Math.random() * 0.35 + 0.45,
            color: darkStarColors[Math.floor(Math.random() * darkStarColors.length)],
            twinkleSpeed: Math.random() * 0.9 + 0.4,
            twinklePhase: Math.random() * Math.PI * 2,
            hasSpikes: isPrime,
            hasGlowHalo: isPrime || isMajor,
            spikeLength: Math.random() * 6 + 10, // 10px - 16px cross spikes
          };
        })
      : [];

    // Shooting Entities: Major Comets + Swift Micro-Meteors
    let activeShooter: ShootingEntity | null = null;
    let shooterCooldown = Math.floor(Math.random() * 120 + 80);

    const spawnShooter = (): ShootingEntity => {
      const isMeteor = Math.random() > 0.4; // 60% meteors, 40% major comets
      const angle = Math.PI * 0.22 + (Math.random() - 0.5) * 0.2;
      const startX = Math.random() * (width * 0.8) + 20;
      const startY = Math.random() * (height * 0.3) - 30;

      if (isMeteor) {
        const speed = Math.random() * 7 + 14; // Swift high-speed streak
        return {
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: Math.random() * 70 + 80,
          headRadius: 1.2,
          alpha: 0,
          maxAlpha: Math.random() * 0.25 + 0.75,
          progress: 0,
          duration: 35 + Math.random() * 20, // Quick flash
          active: true,
          isMeteor: true,
        };
      } else {
        const speed = Math.random() * 4 + 7.5;
        return {
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: Math.random() * 90 + 150,
          headRadius: Math.random() * 0.8 + 2.0,
          alpha: 0,
          maxAlpha: Math.random() * 0.3 + 0.7,
          progress: 0,
          duration: 130 + Math.random() * 40,
          active: true,
          isMeteor: false,
        };
      }
    };

    // LIGHT MODE: Ethereal floating luminous sunlight motes
    const lightMoteRGBs = [
      "251, 191, 36", // Solar Gold
      "245, 158, 11", // Warm Sunlit Amber
      "56, 189, 248", // Morning Sky Cyan
      "99, 102, 241", // Soft Periwinkle
      "168, 85, 247", // Lilac Mist
      "244, 114, 182", // Soft Rose Bloom
      "255, 255, 255", // Luminous Opal
    ];

    const motes: SunlightMote[] = !isDark
      ? Array.from({ length: moteCount }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.08,
          vy: -(Math.random() * 0.28 + 0.14),
          radius: Math.random() * 4.5 + 2.5,
          baseAlpha: Math.random() * 0.4 + 0.4,
          rgb: lightMoteRGBs[Math.floor(Math.random() * lightMoteRGBs.length)],
          swaySpeed: Math.random() * 0.7 + 0.5,
          swayPhase: Math.random() * Math.PI * 2,
          swayAmplitude: Math.random() * 0.4 + 0.2,
        }))
      : [];

    const handleResize = () => {
      updateCanvasSize();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      targetMouseX = -1000;
      targetMouseY = -1000;
    };

    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    let lastTime = performance.now();

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible || isScrolling) return;

      const delta = time - lastTime;
      if (delta < 16) return;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse tracking
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      if (isDark) {
        // ==========================================
        // RENDER COSMIC OBJECT PER MODULE (BACKGROUND)
        // ==========================================
        const cosTime = time * 0.001;

        if (variant === "home") {
          // GARGANTUA BLACK HOLE (Upper Right Quadrant)
          const bhX = isMobile ? width * 0.78 : width * 0.75;
          const bhY = isMobile ? height * 0.22 : height * 0.26;
          const bhRadius = isMobile ? 32 : 54;

          // Gravitational Lensing Outer Glow Ring
          const bhGlow = ctx.createRadialGradient(bhX, bhY, bhRadius * 0.8, bhX, bhY, bhRadius * 2.8);
          bhGlow.addColorStop(0, "rgba(251, 191, 36, 0.22)");
          bhGlow.addColorStop(0.35, "rgba(245, 158, 11, 0.12)");
          bhGlow.addColorStop(0.7, "rgba(99, 102, 241, 0.05)");
          bhGlow.addColorStop(1, "transparent");
          ctx.fillStyle = bhGlow;
          ctx.beginPath();
          ctx.arc(bhX, bhY, bhRadius * 2.8, 0, Math.PI * 2);
          ctx.fill();

          // Upper Warped Light Arc (Lensed accretion disk from behind singularity)
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(bhX, bhY - bhRadius * 0.1, bhRadius * 1.7, bhRadius * 0.95, -0.15, Math.PI * 0.95, Math.PI * 2.05);
          const arcGrad = ctx.createLinearGradient(bhX - bhRadius * 1.5, bhY, bhX + bhRadius * 1.5, bhY);
          arcGrad.addColorStop(0, "rgba(251, 191, 36, 0.55)");
          arcGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.85)");
          arcGrad.addColorStop(0.8, "rgba(245, 158, 11, 0.45)");
          arcGrad.addColorStop(1, "transparent");
          ctx.strokeStyle = arcGrad;
          ctx.lineWidth = isMobile ? 2.5 : 4.0;
          ctx.stroke();
          ctx.restore();

          // Accretion Disk (Tilted torus with Doppler asymmetry - left side rotating toward us is brighter)
          ctx.save();
          ctx.translate(bhX, bhY);
          ctx.rotate(-0.16);
          const diskGrad = ctx.createLinearGradient(-bhRadius * 2.3, 0, bhRadius * 2.3, 0);
          diskGrad.addColorStop(0, "transparent");
          diskGrad.addColorStop(0.2, "rgba(255, 255, 255, 0.95)"); // Doppler beamed intense left
          diskGrad.addColorStop(0.4, "rgba(251, 191, 36, 0.85)");
          diskGrad.addColorStop(0.65, "rgba(245, 158, 11, 0.45)");
          diskGrad.addColorStop(1, "transparent");
          ctx.strokeStyle = diskGrad;
          ctx.lineWidth = isMobile ? 3.5 : 5.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, bhRadius * 2.3, bhRadius * 0.38, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Pure Event Horizon Singularity (Total black silhouette)
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(bhX, bhY, bhRadius, 0, Math.PI * 2);
          ctx.fill();

          // Razor-thin Photon Sphere Rim
          ctx.strokeStyle = "rgba(254, 243, 199, 0.85)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(bhX, bhY, bhRadius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (variant === "experience") {
          // PULSAR / MAGNETAR (Relativistic spinning lighthouse beams)
          const pX = isMobile ? width * 0.82 : width * 0.84;
          const pY = isMobile ? height * 0.20 : height * 0.24;
          const pAngle = cosTime * 1.4; // Sweeping beacon

          ctx.save();
          ctx.translate(pX, pY);

          // Sweeping Dual Relativistic Beams
          const beamLen = isMobile ? 180 : 320;
          for (const sign of [1, -1]) {
            const curAngle = pAngle + (sign === 1 ? 0 : Math.PI);
            const bx = Math.cos(curAngle) * beamLen;
            const by = Math.sin(curAngle) * beamLen;
            const bGrad = ctx.createLinearGradient(0, 0, bx, by);
            bGrad.addColorStop(0, "rgba(56, 189, 248, 0.75)");
            bGrad.addColorStop(0.3, "rgba(99, 102, 241, 0.35)");
            bGrad.addColorStop(0.7, "rgba(168, 85, 247, 0.15)");
            bGrad.addColorStop(1, "transparent");

            ctx.strokeStyle = bGrad;
            ctx.lineWidth = isMobile ? 3.5 : 5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }

          // Pulsing Magnetic Wave Rings
          const waveRadius = ((cosTime * 25) % 45) + 6;
          const waveAlpha = Math.max(0, 1 - waveRadius / 45) * 0.45;
          ctx.strokeStyle = `rgba(56, 189, 248, ${waveAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Intense Magnetar Core
          const pGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 22);
          pGlow.addColorStop(0, "#ffffff");
          pGlow.addColorStop(0.3, "rgba(56, 189, 248, 0.9)");
          pGlow.addColorStop(0.7, "rgba(99, 102, 241, 0.3)");
          pGlow.addColorStop(1, "transparent");
          ctx.fillStyle = pGlow;
          ctx.beginPath();
          ctx.arc(0, 0, 22, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        } else if (variant === "skills") {
          // QUASAR (Hyper-energetic active core with vertical plasma jets)
          const qX = isMobile ? width * 0.82 : width * 0.82;
          const qY = isMobile ? height * 0.22 : height * 0.28;

          ctx.save();
          ctx.translate(qX, qY);

          // Vertical Relativistic Plasma Jets (High computational power symbolism)
          const jetLen = isMobile ? 160 : 260;
          for (const dir of [-1, 1]) {
            const jGrad = ctx.createLinearGradient(0, 0, 0, dir * jetLen);
            jGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
            jGrad.addColorStop(0.2, "rgba(168, 85, 247, 0.65)");
            jGrad.addColorStop(0.6, "rgba(99, 102, 241, 0.25)");
            jGrad.addColorStop(1, "transparent");

            ctx.strokeStyle = jGrad;
            ctx.lineWidth = isMobile ? 3 : 4.5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, dir * jetLen);
            ctx.stroke();
          }

          // Energetic Accretion Core Ring
          ctx.rotate(0.35);
          const qAccretion = ctx.createLinearGradient(-35, 0, 35, 0);
          qAccretion.addColorStop(0, "rgba(168, 85, 247, 0.2)");
          qAccretion.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
          qAccretion.addColorStop(1, "rgba(56, 189, 248, 0.3)");
          ctx.strokeStyle = qAccretion;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, 35, 9, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Stellar Core
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        } else if (variant === "gallery") {
          // STELLAR NEBULA (Ethereal Pillars & Protostar Nursery)
          const nebX = width * 0.8;
          const nebY = height * 0.24;
          const nebGrad = ctx.createRadialGradient(nebX, nebY, 10, nebX, nebY, 140);
          nebGrad.addColorStop(0, "rgba(244, 114, 182, 0.16)");
          nebGrad.addColorStop(0.4, "rgba(168, 85, 247, 0.12)");
          nebGrad.addColorStop(0.75, "rgba(56, 189, 248, 0.08)");
          nebGrad.addColorStop(1, "transparent");
          ctx.fillStyle = nebGrad;
          ctx.beginPath();
          ctx.arc(nebX, nebY, 140, 0, Math.PI * 2);
          ctx.fill();
        } else if (variant === "books") {
          // RINGED EXOPLANET / COSMIC ECLIPSE
          const plX = isMobile ? width * 0.8 : width * 0.82;
          const plY = isMobile ? height * 0.22 : height * 0.24;
          const plR = isMobile ? 24 : 36;

          ctx.save();
          ctx.translate(plX, plY);
          ctx.rotate(-0.32);

          // Planetary Rings (Behind Planet)
          ctx.strokeStyle = "rgba(199, 210, 254, 0.45)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(0, 0, plR * 2.2, plR * 0.45, 0, Math.PI, Math.PI * 2);
          ctx.stroke();

          // Planet Sphere Body in Shadow
          const pBody = ctx.createRadialGradient(-plR * 0.35, -plR * 0.35, plR * 0.1, 0, 0, plR);
          pBody.addColorStop(0, "rgba(99, 102, 241, 0.65)");
          pBody.addColorStop(0.5, "rgba(15, 23, 42, 0.95)");
          pBody.addColorStop(1, "#030407");
          ctx.fillStyle = pBody;
          ctx.beginPath();
          ctx.arc(0, 0, plR, 0, Math.PI * 2);
          ctx.fill();

          // Atmospheric Sunlit Crescent Limb
          ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, plR, -Math.PI * 0.8, -Math.PI * 0.1);
          ctx.stroke();

          // Planetary Rings (In Front of Planet)
          ctx.strokeStyle = "rgba(224, 231, 255, 0.55)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(0, 0, plR * 2.2, plR * 0.45, 0, 0, Math.PI);
          ctx.stroke();

          ctx.restore();
        }

        // ==========================================
        // RENDER COSMIC STARS WITH HIGH BRILLIANCE
        // ==========================================
        for (let i = 0; i < starCount; i++) {
          const s = stars[i];

          // Natural slow cosmic drift
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = width;
          else if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          else if (s.y > height) s.y = 0;

          // Natural organic twinkling
          const twinkle = Math.sin(time * 0.0018 * s.twinkleSpeed + s.twinklePhase);
          const currentAlpha = Math.max(0.25, Math.min(1.0, s.baseAlpha + twinkle * 0.28));

          // Proximity to cursor
          const dx = mouseX - s.x;
          const dy = mouseY - s.y;
          const dist = Math.hypot(dx, dy);
          const proximity = Math.max(0, 1 - dist / 140);

          if (proximity > 0) {
            // PROXIMITY BLOOM: Star blooms into a brilliant starlight flare
            const shineAlpha = Math.min(1.0, currentAlpha + proximity * 0.7);
            const haloRadius = s.radius * (4.0 + proximity * 6.0);

            const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloRadius);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${shineAlpha})`);
            gradient.addColorStop(0.25, `rgba(224, 242, 254, ${shineAlpha * 0.8})`);
            gradient.addColorStop(0.65, `rgba(99, 102, 241, ${shineAlpha * 0.3})`);
            gradient.addColorStop(1, "transparent");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(s.x, s.y, haloRadius, 0, Math.PI * 2);
            ctx.fill();

            // High-intensity white core
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = shineAlpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * (1 + proximity * 0.6), 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          } else if (s.hasSpikes) {
            // FIRST MAGNITUDE STAR: Point-spread halo + 4-Point Optical Cross Spikes (Hubble/JWST starburst)
            const haloRadius = s.radius * 4.0;
            const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloRadius);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha})`);
            gradient.addColorStop(0.3, `rgba(224, 242, 254, ${currentAlpha * 0.5})`);
            gradient.addColorStop(0.7, `rgba(99, 102, 241, ${currentAlpha * 0.15})`);
            gradient.addColorStop(1, "transparent");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(s.x, s.y, haloRadius, 0, Math.PI * 2);
            ctx.fill();

            // 4-Point Optical Diffraction Spikes
            const spLen = s.spikeLength * (0.8 + twinkle * 0.2);
            const spikeGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, spLen);
            spikeGrad.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha * 0.95})`);
            spikeGrad.addColorStop(0.4, `rgba(224, 242, 254, ${currentAlpha * 0.5})`);
            spikeGrad.addColorStop(1, "transparent");

            ctx.strokeStyle = spikeGrad;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            // Horizontal spike
            ctx.moveTo(s.x - spLen, s.y);
            ctx.lineTo(s.x + spLen, s.y);
            // Vertical spike
            ctx.moveTo(s.x, s.y - spLen);
            ctx.lineTo(s.x, s.y + spLen);
            ctx.stroke();

            // Brilliant Core
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          } else if (s.hasGlowHalo) {
            // SECOND MAGNITUDE STAR: Luminous corona halo
            const haloRadius = s.radius * 2.8;
            const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloRadius);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha * 0.9})`);
            gradient.addColorStop(0.4, `rgba(224, 242, 254, ${currentAlpha * 0.35})`);
            gradient.addColorStop(1, "transparent");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(s.x, s.y, haloRadius, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = s.color;
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          } else {
            // FIELD STARS: Crisp pinpricks of twinkling starlight (ALL STARS DRAWN!)
            ctx.fillStyle = s.color;
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        }
      } else {
        // RENDER LIGHT MODE: Luminous Sunlight Motes with Shimmer & Proximity Bloom
        for (let i = 0; i < moteCount; i++) {
          const m = motes[i];

          m.y += m.vy;
          m.x += Math.sin(time * 0.001 * m.swaySpeed + m.swayPhase) * m.swayAmplitude + m.vx;

          if (m.y < -m.radius * 2) {
            m.y = height + m.radius * 2;
            m.x = Math.random() * width;
          } else if (m.y > height + m.radius * 2) {
            m.y = -m.radius * 2;
            m.x = Math.random() * width;
          }
          if (m.x < -m.radius * 2) m.x = width + m.radius * 2;
          else if (m.x > width + m.radius * 2) m.x = -m.radius * 2;

          const dx = mouseX - m.x;
          const dy = mouseY - m.y;
          const dist = Math.hypot(dx, dy);
          const proximity = Math.max(0, 1 - dist / 150);

          const shimmer = Math.sin(time * 0.0018 * m.swaySpeed + m.swayPhase) * 0.15;
          const alpha = Math.max(0.25, Math.min(0.95, m.baseAlpha + shimmer + proximity * 0.45));
          const currentRadius = m.radius * (1 + proximity * 0.35);

          const gradient = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, currentRadius);
          gradient.addColorStop(0, `rgba(${m.rgb}, ${alpha})`);
          gradient.addColorStop(0.5, `rgba(${m.rgb}, ${alpha * 0.6})`);
          gradient.addColorStop(1, `rgba(${m.rgb}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(m.x, m.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ==========================================
      // SHOOTING ENTITIES (METEORS & SHINING COMETS)
      // ==========================================
      shooterCooldown--;
      if (shooterCooldown <= 0 && activeShooter === null) {
        activeShooter = spawnShooter();
        shooterCooldown = Math.floor(Math.random() * 220 + 140);
      }

      if (activeShooter && activeShooter.active) {
        const sh = activeShooter;
        sh.progress++;
        sh.x += sh.vx;
        sh.y += sh.vy;

        const p = sh.progress / sh.duration;
        if (p < 0.2) {
          sh.alpha = (p / 0.2) * sh.maxAlpha;
        } else if (p > 0.6) {
          sh.alpha = ((1 - p) / 0.4) * sh.maxAlpha;
        } else {
          sh.alpha = sh.maxAlpha;
        }

        if (p >= 1 || sh.x > width + 250 || sh.y > height + 250) {
          sh.active = false;
          activeShooter = null;
        } else {
          const speedMag = Math.hypot(sh.vx, sh.vy);
          const nx = sh.vx / speedMag;
          const ny = sh.vy / speedMag;
          const tailX = sh.x - nx * sh.length;
          const tailY = sh.y - ny * sh.length;

          const tailGrad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
          if (isDark) {
            tailGrad.addColorStop(0, `rgba(255, 255, 255, ${sh.alpha * 0.95})`);
            tailGrad.addColorStop(0.15, `rgba(224, 242, 254, ${sh.alpha * 0.75})`);
            tailGrad.addColorStop(0.4, `rgba(56, 189, 248, ${sh.alpha * 0.4})`);
            tailGrad.addColorStop(0.75, `rgba(99, 102, 241, ${sh.alpha * 0.15})`);
            tailGrad.addColorStop(1, "transparent");
          } else {
            tailGrad.addColorStop(0, `rgba(79, 70, 229, ${sh.alpha * 0.9})`);
            tailGrad.addColorStop(0.2, `rgba(99, 102, 241, ${sh.alpha * 0.75})`);
            tailGrad.addColorStop(0.5, `rgba(56, 189, 248, ${sh.alpha * 0.45})`);
            tailGrad.addColorStop(1, "transparent");
          }

          ctx.strokeStyle = tailGrad;
          ctx.lineWidth = sh.isMeteor ? 1.75 : sh.headRadius * 1.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(sh.x, sh.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Coma flare for major comets
          if (!sh.isMeteor) {
            const flareGrad = ctx.createRadialGradient(sh.x, sh.y, 0, sh.x, sh.y, sh.headRadius * 5);
            flareGrad.addColorStop(0, `rgba(255, 255, 255, ${sh.alpha * 0.9})`);
            flareGrad.addColorStop(0.3, `rgba(186, 230, 253, ${sh.alpha * 0.6})`);
            flareGrad.addColorStop(1, "transparent");

            ctx.fillStyle = flareGrad;
            ctx.beginPath();
            ctx.arc(sh.x, sh.y, sh.headRadius * 5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Core
          ctx.fillStyle = isDark ? "#ffffff" : "#4f46e5";
          ctx.globalAlpha = sh.alpha;
          ctx.beginPath();
          ctx.arc(sh.x, sh.y, sh.headRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      ctx.globalAlpha = 1.0;
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, isDark]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
    >
      {/* Volumetric Atmospheric Glow Curtains tailored for each celestial variant */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 -z-10"
        style={{
          background: isDark
            ? variant === "gallery"
              ? "radial-gradient(ellipse 75% 45% at 50% -10%, rgba(244, 114, 182, 0.16) 0%, transparent 65%), radial-gradient(ellipse 65% 55% at 85% 35%, rgba(99, 102, 241, 0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)"
              : variant === "skills"
                ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168, 85, 247, 0.18) 0%, transparent 65%), radial-gradient(ellipse 70% 55% at 85% 35%, rgba(56, 189, 248, 0.16) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)"
                : variant === "books"
                  ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.16) 0%, transparent 65%), radial-gradient(ellipse 70% 55% at 85% 35%, rgba(147, 51, 234, 0.14) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(56, 189, 248, 0.12) 0%, transparent 60%)"
                  : variant === "experience"
                    ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56, 189, 248, 0.18) 0%, transparent 65%), radial-gradient(ellipse 65% 55% at 85% 40%, rgba(99, 102, 241, 0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(16, 185, 129, 0.14) 0%, transparent 60%)"
                    : "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245, 158, 11, 0.14) 0%, transparent 65%), radial-gradient(ellipse 70% 55% at 85% 35%, rgba(99, 102, 241, 0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(56, 189, 248, 0.14) 0%, transparent 60%)"
            : variant === "gallery"
              ? "radial-gradient(ellipse 75% 45% at 50% -10%, rgba(56, 189, 248, 0.32) 0%, transparent 70%), radial-gradient(ellipse 65% 55% at 85% 35%, rgba(129, 140, 248, 0.28) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(244, 114, 182, 0.22) 0%, transparent 65%)"
              : variant === "skills"
                ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168, 85, 247, 0.32) 0%, transparent 70%), radial-gradient(ellipse 65% 55% at 85% 40%, rgba(56, 189, 248, 0.28) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(129, 140, 248, 0.24) 0%, transparent 65%)"
                : variant === "books"
                  ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.32) 0%, transparent 70%), radial-gradient(ellipse 70% 55% at 85% 35%, rgba(168, 85, 247, 0.26) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(56, 189, 248, 0.22) 0%, transparent 65%)"
                  : variant === "experience"
                    ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.34) 0%, transparent 70%), radial-gradient(ellipse 65% 55% at 85% 40%, rgba(56, 189, 248, 0.30) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(168, 85, 247, 0.24) 0%, transparent 65%)"
                    : "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(45, 212, 191, 0.30) 0%, transparent 70%), radial-gradient(ellipse 70% 55% at 85% 35%, rgba(129, 140, 248, 0.32) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 15% 65%, rgba(245, 158, 11, 0.22) 0%, transparent 65%)",
        }}
      />

      {/* Atmospheric Vignette Depth (Behind canvas so stars & celestial bodies are not muted) */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 50%, transparent 40%, rgba(3, 4, 7, 0.65) 100%)"
            : "radial-gradient(circle at 50% 50%, transparent 60%, rgba(226, 232, 240, 0.25) 100%)",
        }}
      />

      {/* Luminous Authentic Particle & Celestial Body Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-100"
      />
    </div>
  );
}

export default memo(InteractiveAmbient);
