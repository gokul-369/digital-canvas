import React, { useRef, useEffect, useCallback, type FC } from "react";
import * as THREE from "three";
import { booksList, type BookItem } from "../../data/books";

interface ThreeDBookShelfProps {
  selectedBook: BookItem | null;
  onSelectBook: (book: BookItem | null) => void;
  isFlipped: boolean;
  onToggleFlip: () => void;
  className?: string;
}

export const ThreeDBookShelf: FC<ThreeDBookShelfProps> = ({
  selectedBook,
  onSelectBook,
  isFlipped,
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const bookMeshesRef = useRef<THREE.Group[]>([]);
  const hoveredIndexRef = useRef<number | null>(null);
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());

  // Drag interaction state
  const isDragging = useRef<boolean>(false);
  const dragDist = useRef<number>(0);
  const lastPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D rotation of active book in foreground
  const activeBookRot = useRef<{ x: number; y: number }>({ x: 0.05, y: -0.26 });
  const activeBookRotTarget = useRef<{ x: number; y: number }>({ x: 0.05, y: -0.26 });
  const flipTargetAngle = useRef<number>(0);

  // Keep references to selectedBook and onSelectBook without triggering scene rebuilds
  const selectedBookRef = useRef<BookItem | null>(selectedBook);
  useEffect(() => {
    selectedBookRef.current = selectedBook;
  }, [selectedBook]);

  const onSelectBookRef = useRef(onSelectBook);
  useEffect(() => {
    onSelectBookRef.current = onSelectBook;
  }, [onSelectBook]);

  // Synchronize Flip state
  useEffect(() => {
    flipTargetAngle.current = isFlipped ? Math.PI : 0;
  }, [isFlipped]);

  // Refined Book Dimensions: comfortable architectural proportions (~50% viewport height in focus)
  const BOOK_W = 0.82;
  const BOOK_H = 1.22;
  const BOOK_D = 0.16;
  const BOOK_SPACING = 0.98;

  // 2 Shelves: 6 books on top (y = 0.42), 6 on bottom (y = -0.78)
  const getRestTransform = useCallback(
    (idx: number) => {
      const isTop = idx < 6;
      const col = isTop ? idx : idx - 6;
      // Center 6 books horizontally around x = 0
      const x = (col - 2.5) * BOOK_SPACING;
      const y = isTop ? 0.42 : -0.78;
      const z = -1.15;

      // Natural, tactile lean on shelf
      const leanTiltX = -0.15 + ((idx * 3) % 5) * 0.012;
      const leanYawY = -0.06 + (col - 2.5) * -0.015;
      const leanRollZ = idx % 2 === 0 ? 0.01 : -0.01;

      return { x, y, z, rx: leanTiltX, ry: leanYawY, rz: leanRollZ };
    },
    [BOOK_SPACING]
  );

  // Helper to generate an authentic spine canvas texture
  const createSpineCanvas = useCallback((item: BookItem): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 140;
    canvas.height = 1100;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Spine cylinder gradient with realistic edge shadow falloff
    const grad = ctx.createLinearGradient(0, 0, 140, 0);
    grad.addColorStop(0, "rgba(0,0,0,0.85)");
    grad.addColorStop(0.24, item.spineColor);
    grad.addColorStop(0.76, item.spineColor);
    grad.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 140, 1100);

    // Raised decorative embossed binding ribs
    const ribs = [70, 80, 270, 280, 540, 550, 810, 820, 1010, 1020];
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ribs.forEach((ry) => ctx.fillRect(6, ry, 128, 4));
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ribs.forEach((ry) => ctx.fillRect(6, ry - 3, 128, 2));

    // Vertical Book Title Typography
    ctx.save();
    ctx.translate(70, 550);
    ctx.rotate(Math.PI / 2);

    ctx.font = "600 32px 'Space Grotesk', serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.fillText(item.name.toUpperCase(), 0, -6);

    ctx.font = "20px 'Space Grotesk', sans-serif";
    ctx.fillStyle = item.foilColor;
    ctx.fillText(item.author.toUpperCase(), 0, 26);
    ctx.restore();

    // Publication Year at spine tail
    ctx.font = "bold 20px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.70)";
    ctx.textAlign = "center";
    ctx.fillText(item.year, 70, 960);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Helper to generate authentic paper page edges texture
  const createPagesEdgeTexture = useCallback((): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = "#e8e3d8";
    ctx.fillRect(0, 0, 256, 256);

    // Fine paper grain and page edge banding
    for (let y = 0; y < 256; y += 2) {
      const alpha = 0.08 + Math.random() * 0.12;
      ctx.fillStyle = `rgba(100, 85, 70, ${alpha})`;
      ctx.fillRect(0, y, 256, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 10);
    return tex;
  }, []);

  // Helper to generate authentic back cover texture
  const createBackCoverTexture = useCallback((item: BookItem): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 900;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = item.spineColor;
    ctx.fillRect(0, 0, 600, 900);

    // Subtle paper texture grain
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for (let i = 0; i < 2000; i++) {
      ctx.fillRect(Math.random() * 600, Math.random() * 900, 1, 1);
    }

    // Border embossing
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 520, 820);

    // Synopsis block on back
    ctx.font = "italic 22px 'Space Grotesk', serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.textAlign = "center";
    ctx.fillText(`"${item.subtext}"`, 300, 380);

    ctx.font = "16px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(`FIRST PUBLISHED · ${item.year}`, 300, 430);
    ctx.fillText(`LITERARY ARCHIVE · GOKUL`, 300, 460);

    // Simulated Barcode
    const bx = 220;
    const by = 720;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bx - 10, by - 10, 180, 70);
    ctx.fillStyle = "#000000";
    for (let x = 0; x < 160; x += 4) {
      if (Math.random() > 0.3) {
        ctx.fillRect(bx + x, by, 2 + (Math.random() > 0.5 ? 2 : 0), 45);
      }
    }

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

    // 2. Camera: fov = 24 with telephoto perspective for architectural, distortion-free depth
    const camera = new THREE.PerspectiveCamera(24, width / height, 0.2, 100);
    camera.position.set(0, -0.18, 7.6);
    camera.lookAt(0, -0.18, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Lighting: Space Ambient + Studio Key + Aurora Rim
    const ambientLight = new THREE.AmbientLight(0x94a3b8, 1.25);
    scene.add(ambientLight);

    const keySpot = new THREE.DirectionalLight(0xffffff, 2.2);
    keySpot.position.set(3.5, 5.0, 5.5);
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 2048;
    keySpot.shadow.mapSize.height = 2048;
    keySpot.shadow.bias = -0.0005;
    scene.add(keySpot);

    const auroraFill = new THREE.DirectionalLight(0x818cf8, 1.0);
    auroraFill.position.set(-4.0, 2.5, 3.0);
    scene.add(auroraFill);

    const shelfUplight = new THREE.PointLight(0x38bdf8, 1.2, 8);
    shelfUplight.position.set(0, -1.8, 1.5);
    scene.add(shelfUplight);

    // 5. Cosmic Glass Shelves: Sleek dark acrylic with glowing blue neon edge
    const shelfGeo = new THREE.BoxGeometry(6.4, 0.04, 0.9);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x090d18,
      roughness: 0.3,
      metalness: 0.85,
    });

    const rimGeo = new THREE.BoxGeometry(6.42, 0.02, 0.04);
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });

    // Top shelf: base under y = 0.42
    const topShelf = new THREE.Mesh(shelfGeo, shelfMat);
    topShelf.position.set(0, 0.42 - BOOK_H / 2 - 0.025, -1.1);
    scene.add(topShelf);

    const topRim = new THREE.Mesh(rimGeo, rimMat);
    topRim.position.set(0, 0.42 - BOOK_H / 2 - 0.015, -0.65);
    scene.add(topRim);

    // Bottom shelf: base under y = -0.78
    const bottomShelf = new THREE.Mesh(shelfGeo, shelfMat);
    bottomShelf.position.set(0, -0.78 - BOOK_H / 2 - 0.025, -1.1);
    scene.add(bottomShelf);

    const bottomRim = new THREE.Mesh(rimGeo, rimMat);
    bottomRim.position.set(0, -0.78 - BOOK_H / 2 - 0.015, -0.65);
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

      // Load authentic published cover image
      const coverTex = texLoader.load(item.coverImage);
      coverTex.colorSpace = THREE.SRGBColorSpace;

      // Front Cover Material
      const frontMat = new THREE.MeshStandardMaterial({
        map: coverTex,
        roughness: 0.28,
        metalness: 0.05,
      });

      // Spine Material
      const spineTex = createSpineCanvas(item);
      const spineMat = new THREE.MeshStandardMaterial({
        map: spineTex,
        roughness: 0.40,
        metalness: 0.08,
      });

      // Back Cover Material
      const backTex = createBackCoverTexture(item);
      const backMat = new THREE.MeshStandardMaterial({
        map: backTex,
        roughness: 0.45,
        metalness: 0.08,
      });

      // Three.js Box Materials: [right, left, top, bottom, front, back]
      const materials = [
        pageEdgeMat, // right: pages
        spineMat,    // left: spine
        pageEdgeMat, // top: pages
        pageEdgeMat, // bottom: pages
        frontMat,    // front: authentic cover art
        backMat,     // back: back cover
      ];

      const mesh = new THREE.Mesh(bookGeo, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { index: idx, book: item };
      bookAnchor.userData = { index: idx, book: item };

      // Soft contact shadow underneath
      const shadowPlaneGeo = new THREE.PlaneGeometry(BOOK_W * 1.05, BOOK_D * 1.6);
      const shadowPlaneMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.4,
      });
      const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -BOOK_H / 2 + 0.005;
      bookAnchor.add(shadowPlane);

      bookAnchor.add(mesh);
      scene.add(bookAnchor);
      meshes.push(bookAnchor);
    });

    bookMeshesRef.current = meshes;

    // 7. Animation Loop with Smooth Slerp Damping
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Damping on interactive rotation
      activeBookRot.current.x += (activeBookRotTarget.current.x - activeBookRot.current.x) * 0.1;
      activeBookRot.current.y += (activeBookRotTarget.current.y - activeBookRot.current.y) * 0.1;

      const activeItem = selectedBookRef.current;

      meshes.forEach((anchor, idx) => {
        const item = booksList[idx];
        const isSelected = activeItem?.id === item.id;
        const isHovered = hoveredIndexRef.current === idx && !activeItem;

        if (isSelected) {
          // Foreground focus: positioned comfortably at x: 0.70, y: -0.18, z: 2.15 (~50% viewport height)
          const targetPos = new THREE.Vector3(0.70, -0.18, 2.15);
          anchor.position.lerp(targetPos, 0.08);

          // Combined rotation: default tilt + drag rotation + flip angle
          const targetRotX = activeBookRot.current.x;
          const targetRotY = activeBookRot.current.y + flipTargetAngle.current;
          const targetRotZ = 0;

          anchor.rotation.x += (targetRotX - anchor.rotation.x) * 0.1;
          anchor.rotation.y += (targetRotY - anchor.rotation.y) * 0.1;
          anchor.rotation.z += (targetRotZ - anchor.rotation.z) * 0.1;
        } else {
          // Normal rest position on the shelf
          const rest = getRestTransform(idx);
          let targetX = rest.x;
          let targetY = rest.y;
          let targetZ = rest.z;
          let targetRotX = rest.rx;
          let targetRotY = rest.ry;
          let targetRotZ = rest.rz;

          if (activeItem) {
            // When another book is selected, other books smoothly recede into background
            targetZ = rest.z - 2.0;
          } else if (isHovered) {
            // Gentle tactile lift on hover
            targetY = rest.y + 0.06;
            targetZ = rest.z + 0.15;
            targetRotX = rest.rx - 0.04;
          }

          anchor.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.08);
          anchor.rotation.x += (targetRotX - anchor.rotation.x) * 0.08;
          anchor.rotation.y += (targetRotY - anchor.rotation.y) * 0.08;
          anchor.rotation.z += (targetRotZ - anchor.rotation.z) * 0.08;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [BOOK_D, BOOK_H, BOOK_SPACING, BOOK_W, createBackCoverTexture, createPagesEdgeTexture, createSpineCanvas, getRestTransform]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragDist.current = 0;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Hover raycasting when not dragging and no book is selected
    if (!isDragging.current && !selectedBookRef.current && cameraRef.current && mountRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.current.setFromCamera(new THREE.Vector2(nx, ny), cameraRef.current);

      const hits = raycaster.current.intersectObjects(bookMeshesRef.current, true);
      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && !obj.userData?.book && obj.parent) {
          obj = obj.parent;
        }
        hoveredIndexRef.current = obj?.userData?.index ?? null;
        if (mountRef.current) mountRef.current.style.cursor = "pointer";
      } else {
        hoveredIndexRef.current = null;
        if (mountRef.current) mountRef.current.style.cursor = "default";
      }
    }

    if (!isDragging.current) return;

    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    dragDist.current += Math.abs(dx) + Math.abs(dy);

    // If a book is in foreground focus, drag to rotate in 3D
    if (selectedBookRef.current) {
      activeBookRotTarget.current.y += dx * 0.008;
      activeBookRotTarget.current.x += dy * 0.006;
      activeBookRotTarget.current.x = Math.max(-0.6, Math.min(0.6, activeBookRotTarget.current.x));
    }

    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handleSelectAtCoords = (clientX: number, clientY: number) => {
    if (!cameraRef.current || !mountRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
    raycaster.current.setFromCamera(new THREE.Vector2(nx, ny), cameraRef.current);

    const hits = raycaster.current.intersectObjects(bookMeshesRef.current, true);
    if (hits.length > 0) {
      let obj: THREE.Object3D | null = hits[0].object;
      while (obj && !obj.userData?.book && obj.parent) {
        obj = obj.parent;
      }
      const clickedBook = obj?.userData?.book as BookItem;
      if (clickedBook) {
        activeBookRotTarget.current = { x: 0.05, y: -0.26 };
        activeBookRot.current = { x: 0.05, y: -0.26 };
        onSelectBookRef.current(clickedBook);
        return;
      }
    } else if (selectedBookRef.current) {
      onSelectBookRef.current(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }

    // Tap/Click to select or reset
    if (dragDist.current < 12) {
      handleSelectAtCoords(e.clientX, e.clientY);
    }
  };

  return (
    <div
      ref={mountRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        isDragging.current = false;
      }}
      className={`relative w-full h-full select-none cursor-default ${className}`}
    />
  );
};

export default ThreeDBookShelf;
