import { useEffect, useRef, useState, useCallback, type FC } from "react";
import * as THREE from "three";
import { booksList, type BookItem } from "../../data/books";
import { createPagesEdgeTexture } from "./bookTextureGenerator";

interface ThreeDBookShelfProps {
  selectedBook: BookItem | null;
  onSelectBook: (book: BookItem | null) => void;
  isFlipped: boolean;
  onToggleFlip?: () => void;
  className?: string;
}

export const ThreeDBookShelf: FC<ThreeDBookShelfProps> = ({
  selectedBook,
  onSelectBook,
  isFlipped,
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bookMeshesRef = useRef<THREE.Group[]>([]);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);

  // Interaction & Raycasting
  const raycaster = useRef(new THREE.Raycaster());
  const mousePos = useRef(new THREE.Vector2(-999, -999));
  const hoveredIndex = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDist = useRef<number>(0);
  const lastPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D rotation of active book in foreground
  const activeBookRot = useRef<{ x: number; y: number }>({ x: 0.02, y: -0.28 });
  const activeBookRotTarget = useRef<{ x: number; y: number }>({ x: 0.02, y: -0.28 });
  const flipTargetAngle = useRef<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize Flip state
  useEffect(() => {
    flipTargetAngle.current = isFlipped ? Math.PI : 0;
  }, [isFlipped]);

  // Book Dimensions: balanced, elegant, realistic size
  const BOOK_W = 1.35;
  const BOOK_H = 1.95;
  const BOOK_D = 0.26;
  const BOOK_SPACING = 2.05;

  // 2 Shelves Layout: 6 books on top (y = 1.15), 6 on bottom (y = -1.15)
  const getRestTransform = useCallback(
    (idx: number) => {
      const isTop = idx < 6;
      const col = isTop ? idx : idx - 6;
      const x = (col - 2.5) * BOOK_SPACING;
      const y = isTop ? 1.18 : -1.18;
      const z = 0.02;

      // Natural casual book lean on shelf
      const leanTiltX = -0.12 + (idx % 3) * 0.02;
      const leanYawY = -0.10 + (col - 2.5) * -0.025;
      const leanRollZ = idx % 2 === 0 ? 0.012 : -0.012;

      return { x, y, z, rx: leanTiltX, ry: leanYawY, rz: leanRollZ };
    },
    [BOOK_SPACING]
  );

  // Helper to generate a matching spine canvas texture
  const createSpineCanvas = useCallback((item: BookItem): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Spine cylinder gradient with shadow falloff
    const grad = ctx.createLinearGradient(0, 0, 160, 0);
    grad.addColorStop(0, "rgba(0,0,0,0.9)");
    grad.addColorStop(0.28, item.spineColor);
    grad.addColorStop(0.72, item.spineColor);
    grad.addColorStop(1, "rgba(0,0,0,0.9)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 160, 1200);

    // Raised decorative ribs
    const ribs = [80, 90, 310, 320, 600, 610, 890, 900, 1110, 1120];
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ribs.forEach((ry) => ctx.fillRect(8, ry, 144, 4));
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ribs.forEach((ry) => ctx.fillRect(8, ry - 3, 144, 2));

    // Vertical Typography
    ctx.save();
    ctx.translate(80, 600);
    ctx.rotate(Math.PI / 2);

    ctx.font = "bold 38px 'Space Grotesk', serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.fillText(item.name.toUpperCase(), 0, -8);

    ctx.font = "24px 'Space Grotesk', sans-serif";
    ctx.fillStyle = item.foilColor;
    ctx.fillText(item.author.toUpperCase(), 0, 30);
    ctx.restore();

    // Year at base
    ctx.font = "bold 24px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.textAlign = "center";
    ctx.fillText(item.year, 80, 1050);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Main Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: Balanced tactile perspective framing both shelves
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.05, 7.2);
    camera.lookAt(0, 0, 0);
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

    // 4. Space / Cosmic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);

    const auroraFill = new THREE.DirectionalLight(0x38bdf8, 0.9);
    auroraFill.position.set(-7, -3, 5);
    scene.add(auroraFill);

    const spotLight = new THREE.SpotLight(0xffffff, 2.8, 16, Math.PI / 4, 0.45);
    spotLight.position.set(2, 3, 7);
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    // 5. Build Two Floating Titanium / Smoked Obsidian Shelves
    const shelfGeo = new THREE.BoxGeometry(13.8, 0.12, 2.6);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x0f1420,
      roughness: 0.35,
      metalness: 0.4,
    });

    const rimGeo = new THREE.BoxGeometry(13.8, 0.02, 0.04);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x6366f1,
      emissiveIntensity: 0.4,
    });

    // Top shelf
    const topShelf = new THREE.Mesh(shelfGeo, shelfMat);
    topShelf.position.set(0, 1.18 - BOOK_H / 2 - 0.06, 0.15);
    scene.add(topShelf);

    const topRim = new THREE.Mesh(rimGeo, rimMat);
    topRim.position.set(0, 1.18 - BOOK_H / 2 + 0.005, 1.45);
    scene.add(topRim);

    // Bottom shelf
    const bottomShelf = new THREE.Mesh(shelfGeo, shelfMat);
    bottomShelf.position.set(0, -1.18 - BOOK_H / 2 - 0.06, 0.15);
    scene.add(bottomShelf);

    const bottomRim = new THREE.Mesh(rimGeo, rimMat);
    bottomRim.position.set(0, -1.18 - BOOK_H / 2 + 0.005, 1.45);
    scene.add(bottomRim);

    // 6. Build the 12 3D Books with Authentic Published Covers
    const texLoader = new THREE.TextureLoader();
    const pagesEdgeTex = createPagesEdgeTexture();
    const pageEdgeMat = new THREE.MeshStandardMaterial({
      map: pagesEdgeTex,
      roughness: 0.85,
      metalness: 0.02,
    });

    const bookGeo = new THREE.BoxGeometry(BOOK_W, BOOK_H, BOOK_D);
    const meshes: THREE.Group[] = [];

    booksList.forEach((item, idx) => {
      const bookAnchor = new THREE.Group();
      const rest = getRestTransform(idx);
      bookAnchor.position.set(rest.x, rest.y, rest.z);
      bookAnchor.rotation.set(rest.rx, rest.ry, rest.rz);

      // Load authentic real book cover
      const coverTex = texLoader.load(item.coverImage);
      coverTex.colorSpace = THREE.SRGBColorSpace;

      // Front Cover Material
      const frontMat = new THREE.MeshStandardMaterial({
        map: coverTex,
        roughness: 0.32,
        metalness: 0.1,
      });

      // Spine Material
      const spineTex = createSpineCanvas(item);
      const spineMat = new THREE.MeshStandardMaterial({
        map: spineTex,
        roughness: 0.48,
        metalness: 0.12,
      });

      // Back Cover Material
      const backMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.spineColor),
        roughness: 0.48,
        metalness: 0.1,
      });

      // [+x, -x, +y, -y, +z (front), -z (back)]
      const materials = [
        pageEdgeMat, // right: pages
        spineMat, // left: spine
        pageEdgeMat, // top: pages
        pageEdgeMat, // bottom: pages
        frontMat, // front: AUTHENTIC REAL COVER
        backMat, // back: matching hardcover
      ];

      const mesh = new THREE.Mesh(bookGeo, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { index: idx, book: item };

      // Soft contact shadow underneath
      const shadowGeo = new THREE.PlaneGeometry(BOOK_W * 1.15, BOOK_D * 2.2);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.5,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.set(0, -BOOK_H / 2 + 0.005, 0);
      bookAnchor.add(shadowMesh);

      bookAnchor.add(mesh);
      scene.add(bookAnchor);
      meshes.push(bookAnchor);
    });

    bookMeshesRef.current = meshes;
    setIsLoading(false);

    // 7. Render & Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const isMobile = window.innerWidth < 768;

      // Ashen Press foreground focus: positioned on right side [1.15, 0.05, 4.2]
      const fgPos = isMobile
        ? new THREE.Vector3(0.0, 0.35, 3.8)
        : new THREE.Vector3(1.15, 0.02, 4.2);

      meshes.forEach((anchor, idx) => {
        const item = booksList[idx];
        const isSelected = selectedBook && selectedBook.id === item.id;
        const isHovered = !selectedBook && idx === hoveredIndex.current;
        const rest = getRestTransform(idx);

        let targetX = rest.x;
        let targetY = rest.y;
        let targetZ = rest.z;
        let targetRx = rest.rx;
        let targetRy = rest.ry;
        let targetRz = rest.rz;

        if (isSelected) {
          // Selected book steps smoothly into the foreground
          targetX = fgPos.x;
          targetY = fgPos.y;
          targetZ = fgPos.z;
          targetRx = activeBookRot.current.x;
          targetRy = activeBookRot.current.y + flipTargetAngle.current;
          targetRz = 0;
        } else if (selectedBook) {
          // Other unselected books recede into background (Ashen Press depth effect)
          targetZ = rest.z - 1.2;
          targetRx = rest.rx - 0.1;
        } else if (isHovered) {
          // Hovered book peeks forward from shelf
          targetZ = rest.z + 0.35;
          targetY = rest.y + 0.08;
          targetRx = 0.0;
          targetRy = -0.05;
        }

        // Smooth critically-damped lerp
        const lerpSpeed = isSelected ? 0.09 : 0.12;
        anchor.position.x += (targetX - anchor.position.x) * lerpSpeed;
        anchor.position.y += (targetY - anchor.position.y) * lerpSpeed;
        anchor.position.z += (targetZ - anchor.position.z) * lerpSpeed;

        anchor.rotation.x += (targetRx - anchor.rotation.x) * lerpSpeed;
        anchor.rotation.y += (targetRy - anchor.rotation.y) * lerpSpeed;
        anchor.rotation.z += (targetRz - anchor.rotation.z) * lerpSpeed;
      });

      // Active book drag rotation damping
      if (selectedBook && isDragging.current) {
        activeBookRot.current.x += (activeBookRotTarget.current.x - activeBookRot.current.x) * 0.2;
        activeBookRot.current.y += (activeBookRotTarget.current.y - activeBookRot.current.y) * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
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
  }, [BOOK_D, BOOK_H, BOOK_W, createSpineCanvas, getRestTransform, selectedBook]);

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragDist.current = 0;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mousePos.current.set(nx, ny);

    // Raycast hover when no book is selected and not dragging
    if (!selectedBook && !isDragging.current) {
      raycaster.current.setFromCamera(mousePos.current, cameraRef.current);
      const targets = bookMeshesRef.current.map((g) => g.children[1]).filter(Boolean);
      const hits = raycaster.current.intersectObjects(targets);
      if (hits.length > 0) {
        const idx = hits[0].object.userData.index;
        hoveredIndex.current = typeof idx === "number" ? idx : null;
      } else {
        hoveredIndex.current = null;
      }
      return;
    }

    if (!isDragging.current) return;

    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    dragDist.current += Math.abs(dx) + Math.abs(dy);

    // If a book is in foreground focus, drag to rotate in 3D
    if (selectedBook) {
      activeBookRotTarget.current.y += dx * 0.009;
      activeBookRotTarget.current.x += dy * 0.007;
      activeBookRotTarget.current.x = Math.max(-0.65, Math.min(0.65, activeBookRotTarget.current.x));
    }

    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }

    // Tap/Click to select or reset
    if (dragDist.current < 8 && cameraRef.current && mountRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.current.setFromCamera(new THREE.Vector2(nx, ny), cameraRef.current);

      const targets = bookMeshesRef.current.map((g) => g.children[1]).filter(Boolean);
      const hits = raycaster.current.intersectObjects(targets);

      if (hits.length > 0) {
        const clickedBook = hits[0].object.userData.book as BookItem;
        if (clickedBook) {
          if (selectedBook?.id === clickedBook.id) {
            activeBookRotTarget.current = { x: 0.02, y: -0.28 };
            activeBookRot.current = { x: 0.02, y: -0.28 };
          } else {
            activeBookRotTarget.current = { x: 0.02, y: -0.28 };
            activeBookRot.current = { x: 0.02, y: -0.28 };
            onSelectBook(clickedBook);
          }
          return;
        }
      } else if (selectedBook) {
        onSelectBook(null);
      }
    }
  };

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full cursor-pointer touch-none"
        title={
          selectedBook
            ? "Drag to rotate book in 3D · Click background to return to shelf"
            : "Click any book on the shelf to inspect"
        }
      />

      {/* Loading Shimmer */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-md">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="font-mono text-xs text-indigo-400">Loading 3D Shelf...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDBookShelf;
