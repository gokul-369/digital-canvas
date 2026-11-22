import { useEffect, useRef, useState, useCallback, type FC } from "react";
import * as THREE from "three";
import { booksList, type BookItem } from "../../data/books";
import { createPagesEdgeTexture } from "./bookTextureGenerator";

interface ThreeDBookShelfProps {
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  className?: string;
}

export const ThreeDBookShelf: FC<ThreeDBookShelfProps> = ({
  selectedIndex,
  onSelectIndex,
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shelfGroupRef = useRef<THREE.Group | null>(null);
  const bookMeshesRef = useRef<THREE.Group[]>([]);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // Raycasting for click/hover detection
  const raycaster = useRef(new THREE.Raycaster());
  const mousePos = useRef(new THREE.Vector2(-999, -999));
  const hoveredIndex = useRef<number | null>(null);

  // Drag interaction state
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const dragStartY = useRef<number>(0);
  const dragDistance = useRef<number>(0);
  const lastPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera / Shelf carriage position lerp
  const currentCarriageX = useRef<number>(0);
  const targetCarriageX = useRef<number>(0);

  // Selected book free 3D drag rotation
  const bookRot = useRef<{ x: number; y: number }>({ x: 0.05, y: 0.1 });
  const bookRotTarget = useRef<{ x: number; y: number }>({ x: 0.05, y: 0.1 });
  const isRotatingActiveBook = useRef<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Book Dimensions
  const BOOK_W = 1.95;
  const BOOK_H = 2.85;
  const BOOK_D = 0.36;
  const BOOK_SPACING = 2.75;

  // Sync selectedIndex to targetCarriageX
  useEffect(() => {
    targetCarriageX.current = -selectedIndex * BOOK_SPACING;
    // Reset selected book rotation when changing volume
    bookRotTarget.current = { x: 0.04, y: 0.0 };
    bookRot.current = { x: 0.04, y: 0.0 };
  }, [selectedIndex, BOOK_SPACING]);

  // Helper to generate a crisp spine canvas texture
  const createSpineCanvas = useCallback((item: BookItem): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Spine gradient
    const grad = ctx.createLinearGradient(0, 0, 180, 0);
    grad.addColorStop(0, "rgba(0,0,0,0.85)");
    grad.addColorStop(0.3, item.spineColor);
    grad.addColorStop(0.7, item.spineColor);
    grad.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 180, 1200);

    // Raised decorative ribs
    const ribs = [90, 100, 320, 330, 600, 610, 880, 890, 1100, 1110];
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ribs.forEach((y) => ctx.fillRect(10, y, 160, 4));
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ribs.forEach((y) => ctx.fillRect(10, y - 3, 160, 2));

    // Vertical text: Title & Author
    ctx.save();
    ctx.translate(90, 600);
    ctx.rotate(Math.PI / 2);

    ctx.font = "bold 38px 'Space Grotesk', serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.fillText(item.name.toUpperCase(), 0, -8);

    ctx.font = "24px 'Space Grotesk', sans-serif";
    ctx.fillStyle = item.foilColor;
    ctx.fillText(item.author.toUpperCase(), 0, 32);
    ctx.restore();

    // Year at bottom
    ctx.font = "bold 22px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.textAlign = "center";
    ctx.fillText(item.year, 90, 1050);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Main Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: tactile perspective looking at the bookshelf
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 6.4);
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

    // 4. Lighting: Ashen Press warm studio illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.0);
    keyLight.position.set(4, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 0.85);
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 14);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 5. The Shelf Group
    const shelfGroup = new THREE.Group();
    shelfGroupRef.current = shelfGroup;
    scene.add(shelfGroup);

    // --- TACTILE OAK / SMOKED SHELF SLAB ---
    const shelfGeo = new THREE.BoxGeometry(booksList.length * BOOK_SPACING + 12, 0.16, 3.8);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x12151c,
      roughness: 0.35,
      metalness: 0.3,
    });
    const shelfMesh = new THREE.Mesh(shelfGeo, shelfMat);
    shelfMesh.position.set(0, -BOOK_H / 2 - 0.08, 0.2);
    shelfGroup.add(shelfMesh);

    // Subtle shelf rim highlight
    const rimGeo = new THREE.BoxGeometry(booksList.length * BOOK_SPACING + 12, 0.02, 0.04);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.25,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.set(0, -BOOK_H / 2 + 0.01, 2.08);
    shelfGroup.add(rimMesh);

    // 6. Build the 12 3D Books on the Shelf
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
      bookAnchor.position.set(idx * BOOK_SPACING, 0, 0);

      // Load actual book cover image
      const coverTex = texLoader.load(item.coverImage);
      coverTex.colorSpace = THREE.SRGBColorSpace;

      // Front Cover Material
      const frontMat = new THREE.MeshStandardMaterial({
        map: coverTex,
        roughness: 0.32,
        metalness: 0.12,
      });

      // Spine Material
      const spineTex = createSpineCanvas(item);
      const spineMat = new THREE.MeshStandardMaterial({
        map: spineTex,
        roughness: 0.5,
        metalness: 0.1,
      });

      // Back Cover Material
      const backMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.spineColor),
        roughness: 0.5,
        metalness: 0.1,
      });

      // Box materials order: [+x (right), -x (left/spine), +y (top), -y (bottom), +z (front), -z (back)]
      const materials = [
        pageEdgeMat, // right: paper pages
        spineMat, // left: book spine
        pageEdgeMat, // top: paper pages
        pageEdgeMat, // bottom: paper pages
        frontMat, // front: ACTUAL BOOK COVER IMAGE
        backMat, // back: matching hardcover
      ];

      const mesh = new THREE.Mesh(bookGeo, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Tag mesh with its index for raycasting
      mesh.userData = { index: idx };

      // Soft contact shadow underneath
      const shadowGeo = new THREE.PlaneGeometry(BOOK_W * 1.15, BOOK_D * 2.2);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.45,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.set(0, -BOOK_H / 2 + 0.005, 0);
      bookAnchor.add(shadowMesh);

      bookAnchor.add(mesh);
      shelfGroup.add(bookAnchor);
      meshes.push(bookAnchor);
    });

    bookMeshesRef.current = meshes;
    setIsLoading(false);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock.getDelta();

      // Smooth shelf carriage sliding (lerp to targetCarriageX)
      currentCarriageX.current += (targetCarriageX.current - currentCarriageX.current) * 0.085;
      if (shelfGroupRef.current) {
        shelfGroupRef.current.position.x = currentCarriageX.current;
      }

      // Smooth book elevation & angle transitions
      const currIdx = selectedIndex;
      meshes.forEach((anchor, idx) => {
        const bookMesh = anchor.children[1] as THREE.Mesh;
        if (!bookMesh) return;

        const isSelected = idx === currIdx;
        const isHovered = idx === hoveredIndex.current && !isSelected;

        // Target positions & rotations
        let targetZ = 0;
        let targetY = 0;
        let targetRotY = -0.22; // default neat angle showing both cover and spine
        let targetRotX = 0;

        if (isSelected) {
          // Selected book steps forward and lifts up
          targetZ = 0.95;
          targetY = 0.22;
          targetRotX = bookRot.current.x;
          targetRotY = bookRot.current.y;
        } else if (isHovered) {
          // Hovered book peeks forward from the shelf
          targetZ = 0.38;
          targetY = 0.08;
          targetRotY = -0.12;
        }

        // Lerp book mesh position & rotation
        bookMesh.position.z += (targetZ - bookMesh.position.z) * 0.1;
        bookMesh.position.y += (targetY - bookMesh.position.y) * 0.1;
        bookMesh.rotation.x += (targetRotX - bookMesh.rotation.x) * 0.1;
        bookMesh.rotation.y += (targetRotY - bookMesh.rotation.y) * 0.1;

        // Active book rotation damping
        if (isSelected && isRotatingActiveBook.current) {
          bookRot.current.x += (bookRotTarget.current.x - bookRot.current.x) * 0.18;
          bookRot.current.y += (bookRotTarget.current.y - bookRot.current.y) * 0.18;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Listener
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
  }, [BOOK_D, BOOK_H, BOOK_SPACING, BOOK_W, createSpineCanvas, selectedIndex]);

  // Pointer Handlers: Drag carriage or 3D inspect active book
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    dragDistance.current = 0;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    // Check if pointer hit the selected book
    if (cameraRef.current && mountRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

      const activeGroup = bookMeshesRef.current[selectedIndex];
      if (activeGroup) {
        const hits = raycaster.current.intersectObjects(activeGroup.children);
        if (hits.length > 0) {
          isRotatingActiveBook.current = true;
        }
      }
    }

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mousePos.current.set(nx, ny);

    // Update point light tracking
    if (pointLightRef.current) {
      pointLightRef.current.position.set(nx * 4, ny * 3 + 1, 5);
    }

    // Raycast hover check when not dragging
    if (!isDragging.current) {
      raycaster.current.setFromCamera(mousePos.current, cameraRef.current);
      const meshes = bookMeshesRef.current.map((g) => g.children[1]).filter(Boolean);
      const intersects = raycaster.current.intersectObjects(meshes);
      if (intersects.length > 0) {
        const idx = intersects[0].object.userData.index;
        hoveredIndex.current = typeof idx === "number" ? idx : null;
      } else {
        hoveredIndex.current = null;
      }
      return;
    }

    // Dragging logic
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    dragDistance.current += Math.abs(dx) + Math.abs(dy);

    if (isRotatingActiveBook.current) {
      // 3D free spin on active book
      bookRotTarget.current.y += dx * 0.009;
      bookRotTarget.current.x += dy * 0.007;
      // Clamp pitch so it doesn't flip upside down
      bookRotTarget.current.x = Math.max(-0.6, Math.min(0.6, bookRotTarget.current.x));
    } else {
      // Dragging carriage along shelf
      targetCarriageX.current += dx * 0.012;
      // Clamp carriage bounds
      const minX = -(booksList.length - 1) * BOOK_SPACING;
      const maxX = 0;
      targetCarriageX.current = Math.max(minX - 0.5, Math.min(maxX + 0.5, targetCarriageX.current));
    }

    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    isRotatingActiveBook.current = false;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }

    // If it was a quick tap/click (dragDistance < 10px), select clicked book
    if (dragDistance.current < 10 && cameraRef.current && mountRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.current.setFromCamera(new THREE.Vector2(nx, ny), cameraRef.current);

      const meshes = bookMeshesRef.current.map((g) => g.children[1]).filter(Boolean);
      const intersects = raycaster.current.intersectObjects(meshes);
      if (intersects.length > 0) {
        const clickedIdx = intersects[0].object.userData.index;
        if (typeof clickedIdx === "number" && clickedIdx !== selectedIndex) {
          onSelectIndex(clickedIdx);
          return;
        }
      }
    }

    // Snap to nearest book on carriage drag release
    const nearestIdx = Math.round(-targetCarriageX.current / BOOK_SPACING);
    const clampedIdx = Math.max(0, Math.min(booksList.length - 1, nearestIdx));
    if (clampedIdx !== selectedIndex) {
      onSelectIndex(clampedIdx);
    } else {
      targetCarriageX.current = -selectedIndex * BOOK_SPACING;
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
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        title="Swipe shelf to browse · Drag active book to inspect in 3D"
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-md rounded-3xl">
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
