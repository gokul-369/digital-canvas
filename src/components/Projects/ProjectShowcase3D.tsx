import { useEffect, useRef, type FC } from "react";
import * as THREE from "three";
import type { ProjectItem } from "../../data/projects";

interface ProjectShowcase3DProps {
  project: ProjectItem;
  theme?: string;
  className?: string;
  onOpenLive?: () => void;
}

export const ProjectShowcase3D: FC<ProjectShowcase3DProps> = ({
  project,
  theme = "dark",
  className = "",
  onOpenLive,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const deviceGroupRef = useRef<THREE.Group | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameRef = useRef<number>(0);

  const isDark = theme === "dark";

  // Mouse tilt physics state
  const mouse = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Texture loader
  const textureLoader = useRef<THREE.TextureLoader>(new THREE.TextureLoader());
  const currentTextureRef = useRef<THREE.Texture | null>(null);

  // Update screen texture when project changes
  useEffect(() => {
    if (!screenMeshRef.current || !project.previewImage) return;

    textureLoader.current.load(project.previewImage, (texture) => {
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      const mat = screenMeshRef.current?.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.map = texture;
        mat.needsUpdate = true;
      }
      currentTextureRef.current = texture;
    });
  }, [project.previewImage]);

  // Setup Three.js 3D viewport
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.5);
    cameraRef.current = camera;

    // 2. High-performance WebGL Renderer with capped pixelRatio to prevent frame drops
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Clean Studio Lighting (No harsh point lights on screen)
    const ambientLight = new THREE.AmbientLight(isDark ? 0xffffff : 0xf8fafc, isDark ? 1.4 : 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 0.8 : 1.0);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    // 4. Construct Sleek, Larger 3D Device Canvas Frame (16:10 Ratio)
    const deviceGroup = new THREE.Group();
    deviceGroupRef.current = deviceGroup;
    scene.add(deviceGroup);

    // Exact 16:10 screen aspect ratio (1.6000) matching 1024x640 screenshots edge-to-edge
    const screenW = 4.32;
    const screenH = 2.70; // 4.32 / 2.70 = 1.6000 exactly
    const frameW = screenW + 0.08; // Ultra-slim 1mm bezel
    const frameH = screenH + 0.08;
    const frameGeo = new THREE.BoxGeometry(frameW, frameH, 0.04);
    const frameMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0b1120 : 0xe2e8f0,
      metalness: isDark ? 0.85 : 0.3,
      roughness: isDark ? 0.3 : 0.4,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    deviceGroup.add(frameMesh);

    // Screen Display Plane (100% Edge-to-Edge Cover, zero wasted space)
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH);

    // Initial texture load
    const initialTexture = project.previewImage
      ? textureLoader.current.load(project.previewImage, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.needsUpdate = true;
        })
      : null;

    // Pristine, glare-free screen material (zero harsh spotlights or green circles)
    const screenMat = new THREE.MeshBasicMaterial({
      map: initialTexture,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0, 0.025);
    deviceGroup.add(screenMesh);
    screenMeshRef.current = screenMesh;

    // Subtle edge rim line
    const edgeGeo = new THREE.EdgesGeometry(frameGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x94a3b8,
      transparent: true,
      opacity: isDark ? 0.3 : 0.45,
    });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    deviceGroup.add(edgeLine);

    // 5. Visibility & Scroll Throttling to eliminate frame drop
    let isVisible = true;
    let isScrolling = false;
    let scrollTimeout = 0;

    const handleScroll = () => {
      isScrolling = true;
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    // 6. Mouse Parallax & Tilt Listeners
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

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    // 7. Responsive Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);

      // Camera distance tuning across breakpoints
      if (newW < 640) {
        camera.position.z = 4.8;
      } else if (newW < 1024) {
        camera.position.z = 4.0;
      } else {
        camera.position.z = 3.5;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // 8. Render Loop with smooth inertia and idle throttling
    let lastRenderTime = performance.now();
    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Skip render when off-screen or during fast scroll to keep 60fps locked
      if (!isVisible || isScrolling) return;

      const delta = time - lastRenderTime;
      if (delta < 14) return; // Cap at 60-70fps max
      lastRenderTime = time;

      // Smooth inertia tilt
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

      if (deviceGroupRef.current) {
        deviceGroupRef.current.rotation.y = mouse.current.x * 0.22;
        deviceGroupRef.current.rotation.x = -mouse.current.y * 0.18;
        // Subtle floating breath
        deviceGroupRef.current.position.y = Math.sin(time * 0.0012) * 0.04;
      }

      renderer.render(scene, camera);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animFrameRef.current);

      renderer.dispose();
      frameGeo.dispose();
      frameMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark, project.previewImage]);

  return (
    <div className={`relative w-full flex flex-col rounded-3xl border border-slate-200/80 dark:border-white/10 bg-slate-100/90 dark:bg-slate-900/90 shadow-2xl overflow-hidden ${className}`}>
      {/* Native Browser Window Header (Completely outside the canvas, zero image obstruction) */}
      <div className="w-full px-5 py-3 border-b border-slate-200/80 dark:border-white/10 bg-slate-200/50 dark:bg-white/[0.03] flex items-center justify-between z-10">
        {/* macOS window control dots */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/50 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50 inline-block" />
        </div>

        {/* Centered clean address bar */}
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 rounded-xl border border-slate-300/70 dark:border-white/10 bg-white/80 dark:bg-black/40 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold flex items-center gap-2 hover:border-sky-400 hover:text-sky-500 transition-colors shadow-sm cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>https://{project.domainUrl}</span>
          <span className="text-[11px] text-sky-500">↗</span>
        </a>

        {/* Direct quick action */}
        <button
          onClick={onOpenLive}
          className="font-mono text-[11px] font-semibold text-sky-500 hover:text-sky-400 flex items-center gap-1 cursor-pointer"
        >
          <span>VISIT</span>
          <span>↗</span>
        </button>
      </div>

      {/* 3D WebGL Device Viewport (100% Unobstructed, Edge-to-Edge Project Image) */}
      <div
        ref={mountRef}
        onClick={onOpenLive}
        className="relative w-full h-[400px] sm:h-[500px] md:h-[580px] lg:h-[640px] cursor-pointer overflow-hidden flex items-center justify-center bg-transparent"
      />
    </div>
  );
};
