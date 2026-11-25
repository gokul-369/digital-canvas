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

      const mat = screenMeshRef.current?.material as THREE.MeshStandardMaterial;
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

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);
    cameraRef.current = camera;

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Dynamic Studio Lighting
    const ambientLight = new THREE.AmbientLight(isDark ? 0x1e293b : 0xf8fafc, isDark ? 1.0 : 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.4 : 1.6);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    const accentPointLight = new THREE.PointLight(project.accentColor, isDark ? 2.5 : 1.2, 7);
    accentPointLight.position.set(0, -1.5, 2);
    scene.add(accentPointLight);

    // 4. Construct Sleek 3D Device Canvas Frame
    const deviceGroup = new THREE.Group();
    deviceGroupRef.current = deviceGroup;
    scene.add(deviceGroup);

    // Outer Bezel Frame (Floating 16:10 Minimal Glass Laptop / Device Slab)
    const frameW = 3.3;
    const frameH = 2.1;
    const frameGeo = new THREE.BoxGeometry(frameW, frameH, 0.08);
    const frameMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0f172a : 0xf1f5f9,
      metalness: isDark ? 0.9 : 0.4,
      roughness: isDark ? 0.25 : 0.35,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    deviceGroup.add(frameMesh);

    // Screen Display Plane (Holds actual project UI screenshot)
    const screenW = frameW * 0.96;
    const screenH = frameH * 0.94;
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH);

    // Initial placeholder texture or loaded preview
    const initialTexture = project.previewImage
      ? textureLoader.current.load(project.previewImage, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.needsUpdate = true;
        })
      : null;

    const screenMat = new THREE.MeshStandardMaterial({
      map: initialTexture,
      roughness: 0.18,
      metalness: 0.05,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0, 0.045);
    deviceGroup.add(screenMesh);
    screenMeshRef.current = screenMesh;

    // Subtle edge rim glow line
    const edgeGeo = new THREE.EdgesGeometry(frameGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x94a3b8,
      transparent: true,
      opacity: isDark ? 0.4 : 0.6,
    });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    deviceGroup.add(edgeLine);

    // 5. Mouse Parallax & Tilt Listeners
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

    // 6. Responsive Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);

      // Camera distance tuning across breakpoints
      if (newW < 640) {
        camera.position.z = 5.2;
      } else if (newW < 1024) {
        camera.position.z = 4.6;
      } else {
        camera.position.z = 4.2;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // 7. Render Loop with smooth inertia
    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

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
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
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
  }, [isDark, project.accentColor]);

  return (
    <div className={`relative w-full flex flex-col items-center ${className}`}>
      {/* 3D WebGL Device Viewport */}
      <div
        ref={mountRef}
        onClick={onOpenLive}
        className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] cursor-pointer overflow-hidden rounded-3xl group"
      >
        {/* Top Floating Browser Address Bar Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-md flex items-center gap-2 pointer-events-none group-hover:scale-105 transition-transform duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            https://{project.domainUrl}
          </span>
          <span className="text-xs text-sky-500">↗</span>
        </div>

        {/* Bottom subtle hint */}
        <div className="absolute bottom-3 right-6 font-mono text-[10px] text-slate-400 dark:text-slate-500 pointer-events-none">
          INTERACTIVE 3D STAGE · TILT TO EXPLORE
        </div>
      </div>
    </div>
  );
};
