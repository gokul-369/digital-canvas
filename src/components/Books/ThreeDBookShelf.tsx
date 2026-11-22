import React, { useRef, useEffect, useCallback, type FC } from "react";
import * as THREE from "three";
import { booksList, type BookItem } from "../../data/books";

interface ThreeDBookShelfProps {
  selectedBook: BookItem | null;
  onSelectBook: (book: BookItem | null) => void;
  isFlipped: boolean;
  onToggleFlip: () => void;
  scrollIndex: number;
  onScrollIndexChange: (index: number) => void;
  className?: string;
}

export const ThreeDBookShelf: FC<ThreeDBookShelfProps> = ({
  selectedBook,
  onSelectBook,
  isFlipped,
  scrollIndex,
  onScrollIndexChange,
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const bookMeshesRef = useRef<THREE.Group[]>([]);
  const shelfMeshRef = useRef<THREE.Group | null>(null);
  const hoveredIndexRef = useRef<number | null>(null);
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());

  // Horizontal Scroll / Carousel State
  const scrollPosRef = useRef<number>(scrollIndex);
  const scrollTargetRef = useRef<number>(scrollIndex);

  useEffect(() => {
    scrollTargetRef.current = scrollIndex;
  }, [scrollIndex]);

  // Drag interaction state
  const isDragging = useRef<boolean>(false);
  const dragDist = useRef<number>(0);
  const lastPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragMode = useRef<"orbit" | "scroll">("scroll");

  // 3D rotation of active book in foreground
  const activeBookRot = useRef<{ x: number; y: number }>({ x: 0.05, y: -0.28 });
  const activeBookRotTarget = useRef<{ x: number; y: number }>({ x: 0.05, y: -0.28 });
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

  // Dimensions
  const BOOK_W = 0.58;
  const BOOK_H = 0.88;
  const BOOK_D = 0.12;
  const BOOK_SPACING = 1.08;
  const SHELF_Y = -0.36;

  // Authentic Spine Canvas Texture
  const createSpineCanvas = useCallback((item: BookItem): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 900;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const grad = ctx.createLinearGradient(0, 0, 120, 0);
    grad.addColorStop(0, "rgba(0,0,0,0.85)");
    grad.addColorStop(0.24, item.spineColor);
    grad.addColorStop(0.76, item.spineColor);
    grad.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 120, 900);

    const ribs = [60, 70, 220, 230, 440, 450, 660, 670, 820, 830];
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ribs.forEach((ry) => ctx.fillRect(4, ry, 112, 3));
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ribs.forEach((ry) => ctx.fillRect(4, ry - 2, 112, 1.5));

    ctx.save();
    ctx.translate(60, 450);
    ctx.rotate(Math.PI / 2);

    ctx.font = "600 26px 'Space Grotesk', serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.fillText(item.name.toUpperCase(), 0, -5);

    ctx.font = "18px 'Space Grotesk', sans-serif";
    ctx.fillStyle = item.foilColor;
    ctx.fillText(item.author.toUpperCase(), 0, 22);
    ctx.restore();

    ctx.font = "bold 18px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.70)";
    ctx.textAlign = "center";
    ctx.fillText(item.year, 60, 780);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Authentic Paper Page Edges Texture
  const createPagesEdgeTexture = useCallback((): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = "#e8e3d8";
    ctx.fillRect(0, 0, 256, 256);

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

  // Authentic Back Cover Texture
  const createBackCoverTexture = useCallback((item: BookItem): THREE.CanvasTexture => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 900;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = item.spineColor;
    ctx.fillRect(0, 0, 600, 900);

    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for (let i = 0; i < 2000; i++) {
      ctx.fillRect(Math.random() * 600, Math.random() * 900, 1, 1);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, 528, 828);

    ctx.font = "italic 22px 'Space Grotesk', serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.textAlign = "center";
    ctx.fillText(`"${item.subtext}"`, 300, 380);

    ctx.font = "16px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(`FIRST PUBLISHED · ${item.year}`, 300, 430);
    ctx.fillText(`LITERARY ARCHIVE · GOKUL`, 300, 460);

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

    // 2. Camera: fov = 26, positioned for clear architectural view of the shelf
    const camera = new THREE.PerspectiveCamera(26, width / height, 0.2, 100);
    camera.position.set(0, 0, 7.2);
    camera.lookAt(0, -0.05, 0);
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
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Lighting: Space Ambient + Studio Key + Rim Glow
    const ambientLight = new THREE.AmbientLight(0xa0aec0, 1.4);
    scene.add(ambientLight);

    const keySpot = new THREE.DirectionalLight(0xffffff, 2.5);
    keySpot.position.set(4.0, 5.0, 5.5);
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 2048;
    keySpot.shadow.mapSize.height = 2048;
    keySpot.shadow.bias = -0.0005;
    scene.add(keySpot);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.2);
    fillLight.position.set(-4.5, 2.5, 3.5);
    scene.add(fillLight);

    const shelfDownlight = new THREE.PointLight(0x38bdf8, 1.5, 9);
    shelfDownlight.position.set(0, -1.8, 1.5);
    scene.add(shelfDownlight);

    // 5. Grand Architectural Cosmic Shelf Object
    // Deep physical floating platform with obsidian finish, beveled ion edge, and contact shadow
    const shelfAnchor = new THREE.Group();
    const baseY = SHELF_Y - BOOK_H / 2 - 0.04;

    const shelfGeo = new THREE.BoxGeometry(16.0, 0.08, 0.95);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x080c16,
      roughness: 0.25,
      metalness: 0.88,
    });
    const shelfMesh = new THREE.Mesh(shelfGeo, shelfMat);
    shelfMesh.position.set(0, baseY, -0.85);
    shelfMesh.receiveShadow = true;
    shelfAnchor.add(shelfMesh);

    // Glowing cyan/ice-blue ion bevel rail
    const bevelGeo = new THREE.BoxGeometry(16.02, 0.018, 0.03);
    const bevelMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
    });
    const bevelMesh = new THREE.Mesh(bevelGeo, bevelMat);
    bevelMesh.position.set(0, baseY + 0.035, -0.38);
    shelfAnchor.add(bevelMesh);

    // Support node struts underneath
    const strutGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.14, 16);
    const strutMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.3 });
    [-4.5, -1.5, 1.5, 4.5].forEach((sx) => {
      const strut = new THREE.Mesh(strutGeo, strutMat);
      strut.position.set(sx, baseY - 0.10, -0.85);
      shelfAnchor.add(strut);
    });

    scene.add(shelfAnchor);
    shelfMeshRef.current = shelfAnchor;

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

      // Initial position along the horizontal shelf
      const x = (idx - 1.5) * BOOK_SPACING;
      bookAnchor.position.set(x, SHELF_Y, -0.85);

      const leanTiltX = -0.14 + ((idx * 2) % 4) * 0.012;
      const leanYawY = -0.05 + ((idx % 3) - 1) * -0.02;
      const leanRollZ = idx % 2 === 0 ? 0.01 : -0.01;
      bookAnchor.rotation.set(leanTiltX, leanYawY, leanRollZ);

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
      bookAnchor.userData = { index: idx, book: item, defaultRot: { rx: leanTiltX, ry: leanYawY, rz: leanRollZ } };

      // Soft contact shadow underneath
      const shadowPlaneGeo = new THREE.PlaneGeometry(BOOK_W * 1.05, BOOK_D * 1.5);
      const shadowPlaneMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.45,
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

      // Smooth horizontal scroll position damping
      scrollPosRef.current += (scrollTargetRef.current - scrollPosRef.current) * 0.12;

      const activeItem = selectedBookRef.current;

      // Shelf position moves slightly with scroll for natural parallax
      if (shelfMeshRef.current) {
        const shelfTargetX = -scrollPosRef.current * 0.35;
        const shelfTargetZ = activeItem ? -3.5 : 0;
        shelfMeshRef.current.position.x += (shelfTargetX - shelfMeshRef.current.position.x) * 0.1;
        shelfMeshRef.current.position.z += (shelfTargetZ - shelfMeshRef.current.position.z) * 0.08;
      }

      meshes.forEach((anchor, idx) => {
        const item = booksList[idx];
        const isSelected = activeItem?.id === item.id;
        const isHovered = hoveredIndexRef.current === idx && !activeItem;

        if (isSelected) {
          // Large foreground focus on left-center: x: -0.85, y: -0.05, z: 2.4 (~65% viewport height)
          const targetPos = new THREE.Vector3(-0.85, -0.05, 2.4);
          anchor.position.lerp(targetPos, 0.08);

          const targetScale = 1.65;
          anchor.scale.set(
            anchor.scale.x + (targetScale - anchor.scale.x) * 0.08,
            anchor.scale.y + (targetScale - anchor.scale.y) * 0.08,
            anchor.scale.z + (targetScale - anchor.scale.z) * 0.08
          );

          const targetRotX = activeBookRot.current.x;
          const targetRotY = activeBookRot.current.y + flipTargetAngle.current;
          const targetRotZ = 0;

          anchor.rotation.x += (targetRotX - anchor.rotation.x) * 0.1;
          anchor.rotation.y += (targetRotY - anchor.rotation.y) * 0.1;
          anchor.rotation.z += (targetRotZ - anchor.rotation.z) * 0.1;
        } else {
          // Horizontal shelf position shifted by scrollPosRef
          const defaultX = (idx - 1.5) * BOOK_SPACING;
          let targetX = defaultX - scrollPosRef.current * BOOK_SPACING;
          let targetY = SHELF_Y;
          let targetZ = -0.85;

          const defaultRot = anchor.userData.defaultRot;
          let targetRotX = defaultRot.rx;
          let targetRotY = defaultRot.ry;
          let targetRotZ = defaultRot.rz;

          const targetScale = 1.0;
          anchor.scale.set(
            anchor.scale.x + (targetScale - anchor.scale.x) * 0.08,
            anchor.scale.y + (targetScale - anchor.scale.y) * 0.08,
            anchor.scale.z + (targetScale - anchor.scale.z) * 0.08
          );

          if (activeItem) {
            targetZ = -3.5;
          } else if (isHovered) {
            targetY = SHELF_Y + 0.06;
            targetZ = -0.68;
            targetRotX = defaultRot.rx - 0.03;
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
  }, [BOOK_D, BOOK_H, BOOK_SPACING, BOOK_W, createBackCoverTexture, createPagesEdgeTexture, createSpineCanvas]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragDist.current = 0;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    dragMode.current = selectedBookRef.current ? "orbit" : "scroll";

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

    if (dragMode.current === "orbit" && selectedBookRef.current) {
      // Rotate active book
      activeBookRotTarget.current.y += dx * 0.008;
      activeBookRotTarget.current.x += dy * 0.006;
      activeBookRotTarget.current.x = Math.max(-0.6, Math.min(0.6, activeBookRotTarget.current.x));
    } else if (dragMode.current === "scroll" && !selectedBookRef.current) {
      // Drag horizontally to scroll shelf
      const scrollDelta = -dx / 180;
      const maxScroll = booksList.length - 3;
      scrollTargetRef.current = Math.max(0, Math.min(maxScroll, scrollTargetRef.current + scrollDelta));
      onScrollIndexChange(scrollTargetRef.current);
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
        activeBookRotTarget.current = { x: 0.05, y: -0.28 };
        activeBookRot.current = { x: 0.05, y: -0.28 };
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

  // Wheel to scroll shelf horizontally when unselected
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (selectedBookRef.current) return;
    const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.003;
    const maxScroll = booksList.length - 3;
    scrollTargetRef.current = Math.max(0, Math.min(maxScroll, scrollTargetRef.current + delta));
    onScrollIndexChange(scrollTargetRef.current);
  };

  return (
    <div
      ref={mountRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onPointerCancel={() => {
        isDragging.current = false;
      }}
      className={`relative w-full h-full select-none cursor-default ${className}`}
    />
  );
};

export default ThreeDBookShelf;
