import { useEffect, useRef, useState, useCallback, type FC } from "react";
import * as THREE from "three";
import type { ProjectItem } from "../../data/projects";

interface OrbitalConsoleProps {
  project: ProjectItem;
  theme?: string;
  onSimulatePing?: () => void;
  className?: string;
}

export const OrbitalConsole: FC<OrbitalConsoleProps> = ({
  project,
  theme = "dark",
  onSimulatePing,
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [lastPingTime, setLastPingTime] = useState<number | null>(null);
  const [pingLatency, setPingLatency] = useState<number>(project.telemetry.latencyMs || 14);
  const [isPinging, setIsPinging] = useState<boolean>(false);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const consoleGroupRef = useRef<THREE.Group | null>(null);
  const accentLightRef = useRef<THREE.PointLight | null>(null);

  // Dynamic Screen Texture State
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const animFrameRef = useRef<number>(0);

  // Mouse Parallax & Interaction
  const mouse = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Oscilloscope & Telemetry Wave Simulation Data
  const wavePointsRef = useRef<number[]>(new Array(64).fill(0));
  const pingPulseRef = useRef<number>(0); // 0 -> 1 when ping is fired

  const isDark = theme === "dark";

  // Trigger simulated ping
  const triggerPing = useCallback(() => {
    setIsPinging(true);
    pingPulseRef.current = 1.0;
    const randomJitter = Math.floor(Math.random() * 8) - 4;
    const newLatency = Math.max(6, (project.telemetry.latencyMs || 14) + randomJitter);
    setPingLatency(newLatency);
    setLastPingTime(Date.now());

    if (onSimulatePing) {
      onSimulatePing();
    }

    setTimeout(() => {
      setIsPinging(false);
    }, 600);
  }, [project.telemetry.latencyMs, onSimulatePing]);

  // Sync project changes with 3D lights and trigger an initial packet pulse
  useEffect(() => {
    if (accentLightRef.current) {
      accentLightRef.current.color.set(project.accentColor);
    }
    pingPulseRef.current = 0.85;
    setPingLatency(project.telemetry.latencyMs || 14);
  }, [project]);

  // Initialize Three.js scene and Screen Texture Canvas
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    cameraRef.current = camera;

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(isDark ? 0x1e293b : 0xf1f5f9, isDark ? 0.9 : 1.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.4 : 1.8);
    dirLight.position.set(4, 5, 6);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, isDark ? 1.2 : 0.6);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(project.accentColor, isDark ? 2.8 : 1.8, 8);
    accentLight.position.set(0, 0, 1.8);
    scene.add(accentLight);
    accentLightRef.current = accentLight;

    // 4. Create Offscreen Canvas for CRT/OLED Telemetry Screen
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1024;
    screenCanvas.height = 576;
    screenCanvasRef.current = screenCanvas;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = false;
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    screenTextureRef.current = screenTexture;

    // 5. Construct 3D Space-Grade Console Hardware
    const consoleGroup = new THREE.Group();
    consoleGroupRef.current = consoleGroup;
    scene.add(consoleGroup);

    // Chassis Base (Anodized Aerospace Titanium / Matte Silver)
    const chassisGeo = new THREE.BoxGeometry(3.6, 2.15, 0.42);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0f172a : 0xe2e8f0,
      metalness: isDark ? 0.88 : 0.55,
      roughness: isDark ? 0.28 : 0.35,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    consoleGroup.add(chassisMesh);

    // Faceplate Bevel Frame (Precision Machined Face)
    const frameGeo = new THREE.BoxGeometry(3.42, 1.98, 0.46);
    const frameMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x020617 : 0xf8fafc,
      metalness: isDark ? 0.95 : 0.4,
      roughness: isDark ? 0.22 : 0.3,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    consoleGroup.add(frameMesh);

    // Recessed Screen Mesh (OLED Monitor Display)
    const screenGeo = new THREE.PlaneGeometry(2.4, 1.35);
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      roughness: 0.15,
      metalness: 0.1,
      emissive: 0xffffff,
      emissiveMap: screenTexture,
      emissiveIntensity: isDark ? 0.85 : 0.6,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(-0.35, 0.05, 0.235);
    consoleGroup.add(screenMesh);

    // Knurled Hardware Knobs / Dials (Right Side Control Column)
    const knobGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.18, 24);
    const knobMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x334155 : 0x94a3b8,
      metalness: 0.95,
      roughness: 0.25,
    });

    const knobTop = new THREE.Mesh(knobGeo, knobMat);
    knobTop.rotation.x = Math.PI / 2;
    knobTop.position.set(1.28, 0.5, 0.26);
    consoleGroup.add(knobTop);

    const knobBottom = new THREE.Mesh(knobGeo, knobMat);
    knobBottom.rotation.x = Math.PI / 2;
    knobBottom.position.set(1.28, -0.15, 0.26);
    consoleGroup.add(knobBottom);

    // Status LED Array (SYS, LINK, ACT, DATA)
    const ledGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const ledColors = [0x22c55e, 0x38bdf8, 0xf59e0b, 0xa855f7];
    const ledMeshes: THREE.Mesh[] = [];

    ledColors.forEach((col, idx) => {
      const ledMat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 1.8,
        roughness: 0.1,
      });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(1.28, -0.6 + idx * 0.12, 0.24);
      consoleGroup.add(led);
      ledMeshes.push(led);
    });

    // Hex Machine Screws / Bolts on 4 Corners
    const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 6);
    const boltMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x475569 : 0x64748b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const boltPositions = [
      [-1.65, 0.9, 0.24],
      [1.65, 0.9, 0.24],
      [-1.65, -0.9, 0.24],
      [1.65, -0.9, 0.24],
    ];
    boltPositions.forEach(([x, y, z]) => {
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(x, y, z);
      consoleGroup.add(bolt);
    });

    // 6. Dynamic Canvas Telemetry Render Function
    let frameCount = 0;
    const renderScreenTexture = (time: number) => {
      if (!screenCanvasRef.current || !screenTextureRef.current) return;
      const ctx = screenCanvasRef.current.getContext("2d");
      if (!ctx) return;

      const cw = 1024;
      const ch = 576;

      // Dark CRT screen background with soft scanline tone
      ctx.fillStyle = isDark ? "#020617" : "#0f172a";
      ctx.fillRect(0, 0, cw, ch);

      // Subtle CRT phosphor scanlines
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      for (let y = 0; y < ch; y += 4) {
        ctx.fillRect(0, y, cw, 1.5);
      }

      // Top Status Header
      ctx.font = "bold 22px 'Space Grotesk', monospace";
      ctx.fillStyle = project.accentColor;
      ctx.fillText(`// ORBITAL TELEMETRY NODE : [ ${project.hardwareSpec.bladeId} ]`, 36, 50);

      ctx.font = "16px 'Space Grotesk', monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      ctx.fillText(`FREQ: ${project.hardwareSpec.freq}  |  POWER: ${project.hardwareSpec.power}`, 36, 80);

      // Status Beacon on top right
      const isOnline = project.telemetry.status === "ONLINE" || project.telemetry.status === "ACTIVE";
      ctx.fillStyle = isOnline ? "#22c55e" : "#eab308";
      ctx.beginPath();
      ctx.arc(cw - 220, 42, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px monospace";
      ctx.fillText(`${project.telemetry.status} (${pingLatency}ms)`, cw - 198, 48);

      // Outer boundary line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, 100, cw - 60, ch - 130);

      // Telemetry Wave / Signal Oscilloscope Section
      const gridLeft = 50;
      const gridTop = 120;
      const gridWidth = cw - 100;
      const gridHeight = 260;

      // Oscilloscope background grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let gx = gridLeft; gx <= gridLeft + gridWidth; gx += 45) {
        ctx.beginPath();
        ctx.moveTo(gx, gridTop);
        ctx.lineTo(gx, gridTop + gridHeight);
        ctx.stroke();
      }
      for (let gy = gridTop; gy <= gridTop + gridHeight; gy += 35) {
        ctx.beginPath();
        ctx.moveTo(gridLeft, gy);
        ctx.lineTo(gridLeft + gridWidth, gy);
        ctx.stroke();
      }

      // Oscilloscope live signal trace
      ctx.beginPath();
      ctx.strokeStyle = project.accentColor;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = project.accentColor;
      ctx.shadowBlur = 12;

      const points = wavePointsRef.current;
      const step = gridWidth / (points.length - 1);
      const centerY = gridTop + gridHeight / 2;

      // Update wave points dynamically
      const pulse = pingPulseRef.current;
      for (let i = 0; i < points.length; i++) {
        const freq = project.id === "vigilens" ? 0.06 : project.id === "vps-infra" ? 0.04 : 0.03;
        const baseWave = Math.sin(time * freq + i * 0.28) * 28;
        const packetPulse = Math.sin(i * 0.45 - time * 0.12) * pulse * 75;
        points[i] = baseWave + packetPulse;
      }

      // Draw the waveform
      for (let i = 0; i < points.length; i++) {
        const px = gridLeft + i * step;
        const py = centerY + points[i];
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      // Bottom Telemetry Log / Route stream
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fillRect(50, 400, gridWidth, 80);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 16px monospace";
      ctx.fillText(`PROTOCOL: ${project.telemetry.protocol}  |  PORT: ${project.telemetry.port}  |  LOCATION: ${project.telemetry.nodeLocation}`, 65, 430);

      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "14px monospace";
      if (project.id === "vigilens") {
        ctx.fillText(`STREAM > GET /v1/telemetry 200 OK [${pingLatency}ms]  •  HEALTHCHECK: PASSED`, 65, 458);
      } else if (project.id === "vps-infra") {
        ctx.fillText(`STREAM > SYSTEMD: [active]  •  DOCKER-BRIDGE: UP  •  UPTIME: ${project.telemetry.uptime}`, 65, 458);
      } else {
        ctx.fillText(`STREAM > ROUTE /index.html 200 OK  •  ASSETS: CACHED (0.1ms)`, 65, 458);
      }

      // Decay ping pulse gradually
      if (pingPulseRef.current > 0.01) {
        pingPulseRef.current *= 0.94;
      }

      screenTextureRef.current.needsUpdate = true;
    };

    // 7. Responsive Viewport Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);

      // Adjust camera distance for mobile screens
      if (newW < 640) {
        camera.position.z = 6.4;
      } else if (newW < 1024) {
        camera.position.z = 5.6;
      } else {
        camera.position.z = 5.0;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // 8. Mouse Parallax Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.current.targetX = Math.max(-1, Math.min(1, nx));
      mouse.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    const handleMouseLeave = () => {
      mouse.current.targetX = 0;
      mouse.current.targetY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // 9. Main Render Loop
    let lastTime = 0;
    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Smooth inertia parallax on 3D Console
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

      if (consoleGroupRef.current) {
        consoleGroupRef.current.rotation.y = mouse.current.x * 0.28;
        consoleGroupRef.current.rotation.x = -mouse.current.y * 0.22;
        // Subtle floating breathing motion
        consoleGroupRef.current.position.y = Math.sin(time * 0.0015) * 0.05;
      }

      // Blink status LEDs with subtle realistic phase shifts
      ledMeshes.forEach((led, idx) => {
        const mat = led.material as THREE.MeshStandardMaterial;
        const blink = Math.sin(time * 0.005 * (idx + 1) + idx * 1.5);
        mat.emissiveIntensity = blink > 0.1 ? 2.2 : 0.4;
      });

      // Throttle screen texture re-draw to ~35fps for supreme rendering performance
      if (time - lastTime > 28) {
        lastTime = time;
        frameCount++;
        renderScreenTexture(frameCount);
      }

      renderer.render(scene, camera);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animFrameRef.current);

      renderer.dispose();
      chassisGeo.dispose();
      chassisMat.dispose();
      frameGeo.dispose();
      frameMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      knobGeo.dispose();
      knobMat.dispose();
      ledGeo.dispose();
      boltGeo.dispose();
      boltMat.dispose();
      screenTexture.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark, project.id, project.accentColor]);

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
      >
        {/* Subtle holographic corner indicators */}
        <div className="absolute top-4 left-6 font-mono text-[11px] tracking-wider text-slate-500 dark:text-slate-400 pointer-events-none flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AVIONICS RACK // {project.hardwareSpec.bladeId}</span>
        </div>
        <div className="absolute top-4 right-6 font-mono text-[11px] tracking-wider text-slate-500 dark:text-slate-400 pointer-events-none">
          CHASSIS: {project.hardwareSpec.rackUnit}
        </div>
      </div>

      {/* Tactile Hardware Interactive Action Bar */}
      <div className="w-full max-w-2xl px-4 flex flex-wrap items-center justify-between gap-3 -mt-4 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={triggerPing}
            disabled={isPinging}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold tracking-wide border transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm ${
              isPinging
                ? "bg-sky-500/20 border-sky-400 text-sky-400 scale-95"
                : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-sky-400 hover:text-sky-500 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isPinging ? "bg-sky-400 animate-ping" : "bg-sky-500"}`} />
            <span>{isPinging ? "PACKET TRANSMITTING..." : "TRANSMIT TELEMETRY PING"}</span>
          </button>

          {lastPingTime && (
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              RTT: <span className="text-emerald-500 font-bold">{pingLatency}ms</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl font-mono text-xs font-semibold tracking-wide bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-400 hover:to-indigo-500 shadow-md hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <span>LAUNCH PAYLOAD</span>
              <span>↗</span>
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl font-mono text-xs font-semibold tracking-wide border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            >
              SOURCE
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
