import { useEffect, useRef, useState, useCallback, type FC } from "react";
import * as THREE from "three";
import type { Book } from "../../data/books";
import {
  createFrontCoverTexture,
  createSpineTexture,
  createBackCoverTexture,
  createInsideLeftPageTexture,
  createInsideRightPageTexture,
  createPagesEdgeTexture,
} from "./bookTextureGenerator";

interface ThreeDBookProps {
  book: Book;
  isOpen: boolean;
  onToggleOpen?: () => void;
  className?: string;
}

export const ThreeDBook: FC<ThreeDBookProps> = ({
  book,
  isOpen,
  onToggleOpen,
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to keep across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bookGroupRef = useRef<THREE.Group | null>(null);
  const coverPivotRef = useRef<THREE.Group | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // Material and Mesh references for seamless texture updates
  const frontCoverMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const insideLeftMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const insideRightMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const backCoverMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const spineMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const edgeMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Animation & Interaction state
  const targetCoverAngle = useRef<number>(isOpen ? -Math.PI * 0.9 : 0);
  const currentCoverAngle = useRef<number>(isOpen ? -Math.PI * 0.9 : 0);
  const targetGroupX = useRef<number>(isOpen ? 0.65 : 0);
  const currentGroupX = useRef<number>(isOpen ? 0.65 : 0);

  // Drag rotation state
  const isDragging = useRef<boolean>(false);
  const prevPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotVelocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRot = useRef<{ x: number; y: number }>({ x: 0.15, y: -0.35 });
  const currentRot = useRef<{ x: number; y: number }>({ x: 0.15, y: -0.35 });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync isOpen prop with target rotation
  useEffect(() => {
    targetCoverAngle.current = isOpen ? -Math.PI * 0.88 : 0;
    targetGroupX.current = isOpen ? 0.72 : 0;
    if (isOpen) {
      // Facing the reader squarely when open
      targetRot.current = { x: 0.05, y: 0.0 };
    } else {
      // Pleasant 3D isometric angle when closed
      targetRot.current = { x: 0.15, y: -0.35 };
    }
  }, [isOpen]);

  // Update textures when book changes
  const updateBookTextures = useCallback((currentBook: Book) => {
    const frontTex = createFrontCoverTexture(currentBook);
    const insideLeftTex = createInsideLeftPageTexture(currentBook);
    const insideRightTex = createInsideRightPageTexture(currentBook);
    const backTex = createBackCoverTexture(currentBook);
    const spineTex = createSpineTexture(currentBook);

    if (frontCoverMatRef.current) {
      frontCoverMatRef.current.map = frontTex;
      frontCoverMatRef.current.needsUpdate = true;
    }
    if (insideLeftMatRef.current) {
      insideLeftMatRef.current.map = insideLeftTex;
      insideLeftMatRef.current.needsUpdate = true;
    }
    if (insideRightMatRef.current) {
      insideRightMatRef.current.map = insideRightTex;
      insideRightMatRef.current.needsUpdate = true;
    }
    if (backCoverMatRef.current) {
      backCoverMatRef.current.map = backTex;
      backCoverMatRef.current.needsUpdate = true;
    }
    if (spineMatRef.current) {
      spineMatRef.current.map = spineTex;
      spineMatRef.current.needsUpdate = true;
    }
  }, []);

  useEffect(() => {
    updateBookTextures(book);
  }, [book, updateBookTextures]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 0.7);
    dirLight2.position.set(-6, -4, 4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.2, 12);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 5. Build 3D Book Hierarchy
    const bookGroup = new THREE.Group();
    bookGroupRef.current = bookGroup;
    scene.add(bookGroup);

    // Geometry Dimensions
    const bWidth = 2.5;
    const bHeight = 3.6;
    const bThickness = 0.44;
    const cThickness = 0.035; // cover thickness

    // Initial Textures
    const frontTex = createFrontCoverTexture(book);
    const insideLeftTex = createInsideLeftPageTexture(book);
    const insideRightTex = createInsideRightPageTexture(book);
    const backTex = createBackCoverTexture(book);
    const spineTex = createSpineTexture(book);
    const pagesEdgeTex = createPagesEdgeTexture();

    // Reusable Materials
    const coverEdgeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(book.palette.coverBg),
      roughness: 0.6,
      metalness: 0.1,
    });

    const frontCoverMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      roughness: 0.38,
      metalness: 0.15,
    });
    frontCoverMatRef.current = frontCoverMat;

    const insideLeftMat = new THREE.MeshStandardMaterial({
      map: insideLeftTex,
      roughness: 0.7,
      metalness: 0.05,
    });
    insideLeftMatRef.current = insideLeftMat;

    const insideRightMat = new THREE.MeshStandardMaterial({
      map: insideRightTex,
      roughness: 0.7,
      metalness: 0.05,
    });
    insideRightMatRef.current = insideRightMat;

    const backCoverMat = new THREE.MeshStandardMaterial({
      map: backTex,
      roughness: 0.45,
      metalness: 0.1,
    });
    backCoverMatRef.current = backCoverMat;

    const spineMat = new THREE.MeshStandardMaterial({
      map: spineTex,
      roughness: 0.5,
      metalness: 0.1,
    });
    spineMatRef.current = spineMat;

    const pageEdgeMat = new THREE.MeshStandardMaterial({
      map: pagesEdgeTex,
      roughness: 0.85,
      metalness: 0.02,
    });
    edgeMatRef.current = pageEdgeMat;

    // --- A. BACK COVER ---
    // [right, left, top, bottom, front(+z), back(-z)]
    const backCoverGeo = new THREE.BoxGeometry(bWidth, bHeight, cThickness);
    const backCoverMats = [
      coverEdgeMat, // right
      coverEdgeMat, // left
      coverEdgeMat, // top
      coverEdgeMat, // bottom
      insideRightMat, // interior facing pages (+z)
      backCoverMat, // exterior facing back (-z)
    ];
    const backCoverMesh = new THREE.Mesh(backCoverGeo, backCoverMats);
    backCoverMesh.position.set(0, 0, -bThickness / 2);
    bookGroup.add(backCoverMesh);

    // --- B. SPINE ---
    const spineGeo = new THREE.BoxGeometry(cThickness * 1.5, bHeight, bThickness + cThickness * 2);
    const spineMats = [
      coverEdgeMat,
      spineMat, // outer spine curve
      coverEdgeMat,
      coverEdgeMat,
      coverEdgeMat,
      coverEdgeMat,
    ];
    const spineMesh = new THREE.Mesh(spineGeo, spineMats);
    spineMesh.position.set(-bWidth / 2 - cThickness * 0.5, 0, 0);
    bookGroup.add(spineMesh);

    // --- C. INNER PAGES BLOCK ---
    const pageWidth = bWidth - 0.08;
    const pageHeight = bHeight - 0.12;
    const pageDepth = bThickness - 0.02;
    const pagesGeo = new THREE.BoxGeometry(pageWidth, pageHeight, pageDepth);
    const pagesMats = [
      pageEdgeMat, // right edges (+x)
      pageEdgeMat, // left (hidden against spine)
      pageEdgeMat, // top edges (+y)
      pageEdgeMat, // bottom edges (-y)
      insideRightMat, // top page face (+z, visible when open!)
      insideRightMat, // bottom page face (-z)
    ];
    const pagesMesh = new THREE.Mesh(pagesGeo, pagesMats);
    pagesMesh.position.set(0.04, 0, 0);
    bookGroup.add(pagesMesh);

    // --- D. FRONT COVER PIVOT HINGE ---
    // Pivot at left edge of spine: x = -bWidth / 2, z = bThickness / 2
    const coverPivot = new THREE.Group();
    coverPivot.position.set(-bWidth / 2, 0, bThickness / 2);
    coverPivotRef.current = coverPivot;
    bookGroup.add(coverPivot);

    const frontCoverGeo = new THREE.BoxGeometry(bWidth, bHeight, cThickness);
    const frontCoverMats = [
      coverEdgeMat, // right
      coverEdgeMat, // left
      coverEdgeMat, // top
      coverEdgeMat, // bottom
      frontCoverMat, // exterior face (+z)
      insideLeftMat, // interior face (-z, visible when open!)
    ];
    const frontCoverMesh = new THREE.Mesh(frontCoverGeo, frontCoverMats);
    // Offset so cover swings naturally around its left hinge
    frontCoverMesh.position.set(bWidth / 2, 0, 0);
    coverPivot.add(frontCoverMesh);

    // Set initial rotation
    coverPivot.rotation.y = targetCoverAngle.current;
    bookGroup.position.x = targetGroupX.current;

    setIsLoading(false);

    // --- RENDER & ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock.getDelta();

      // 1. Smoothly interpolate cover open/close
      currentCoverAngle.current += (targetCoverAngle.current - currentCoverAngle.current) * 0.085;
      if (coverPivotRef.current) {
        coverPivotRef.current.rotation.y = currentCoverAngle.current;
      }

      // 2. Smoothly center book when open vs closed
      currentGroupX.current += (targetGroupX.current - currentGroupX.current) * 0.085;
      if (bookGroupRef.current) {
        bookGroupRef.current.position.x = currentGroupX.current;
      }

      // 3. Smooth rotation damping & inertia
      if (!isDragging.current) {
        // Apply velocity decay
        targetRot.current.x += rotVelocity.current.x;
        targetRot.current.y += rotVelocity.current.y;
        rotVelocity.current.x *= 0.92;
        rotVelocity.current.y *= 0.92;

        // Subtle ambient floating sway when idle
        const time = clock.getElapsedTime();
        const idleSwayX = Math.sin(time * 1.2) * 0.025;
        const idleSwayY = Math.cos(time * 0.9) * 0.035;

        currentRot.current.x += (targetRot.current.x + idleSwayX - currentRot.current.x) * 0.07;
        currentRot.current.y += (targetRot.current.y + idleSwayY - currentRot.current.y) * 0.07;
      } else {
        currentRot.current.x += (targetRot.current.x - currentRot.current.x) * 0.15;
        currentRot.current.y += (targetRot.current.y - currentRot.current.y) * 0.15;
      }

      // Clamp pitch to prevent flipping upside down
      currentRot.current.x = Math.max(-0.65, Math.min(0.65, currentRot.current.x));

      if (bookGroupRef.current) {
        bookGroupRef.current.rotation.x = currentRot.current.x;
        bookGroupRef.current.rotation.y = currentRot.current.y;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE LISTENER ---
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []); // Run once on mount

  // Pointer / Drag Rotation Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
    rotVelocity.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Dynamic point light tracking
    if (pointLightRef.current && mountRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointLightRef.current.position.set(nx * 4, ny * 4, 4.5);
    }

    if (!isDragging.current) return;

    const dx = e.clientX - prevPointer.current.x;
    const dy = e.clientY - prevPointer.current.y;

    const sens = 0.007;
    targetRot.current.y += dx * sens;
    targetRot.current.x += dy * sens;

    rotVelocity.current = {
      x: dy * sens * 0.4,
      y: dx * sens * 0.4,
    };

    prevPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={onToggleOpen}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        title="Drag to rotate in 3D · Double-click to open/close"
      />

      {/* Loading Shimmer */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-md rounded-3xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="font-mono text-xs text-indigo-400">Binding 3D Book...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDBook;
