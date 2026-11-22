import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import type { prcocessedimages } from "../../types";

interface ThreeDViewportProps {
  currentImage: prcocessedimages;
  prevImage: prcocessedimages | null;
  direction?: "next" | "prev";
  className?: string;
  onImageClick?: () => void;
}

const vertexShader = `
  varying vec2 vUv;
  uniform float uProgress;
  uniform float uDirection;
  uniform float uHover;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // ThreeUI-inspired 3D dimensional wave that peaks midway through transition
    // When uProgress is 0.0 or 1.0, displacement is EXACTLY 0.0 (100% flat mesh)
    float waveProgress = sin(uProgress * 3.14159265);
    float bend = sin(uv.x * 3.14159265) * waveProgress * -0.22 * uDirection;
    pos.z += bend;

    // Tactile 3D surface elevation under cursor that goes hand in hand with the liquid wave
    float distV = length(uv - uMouse);
    float hoverElevation = exp(-distV * 4.5) * uHover * 0.035;
    pos.z += hoverElevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTextureCurrent;
  uniform sampler2D uTextureNext;
  uniform float uProgress;
  uniform float uDirection;
  uniform vec2 uPlaneRes;
  uniform vec2 uImageResCurrent;
  uniform vec2 uImageResNext;
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uMouse;

  vec2 getCoverUv(vec2 uv, vec2 planeRes, vec2 imageRes) {
    vec2 s = planeRes;
    vec2 i = imageRes;
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 newUv = uv;
    if (rs > ri) {
      newUv.y = (uv.y - 0.5) * (ri / rs) + 0.5;
    } else {
      newUv.x = (uv.x - 0.5) * (rs / ri) + 0.5;
    }
    return clamp(newUv, 0.0, 1.0);
  }

  void main() {
    vec2 uv = vUv;
    float p = uProgress;

    // Each texture gets its OWN exact aspect ratio cover mapping - zero stretching
    vec2 uvCurrent = getCoverUv(uv, uPlaneRes, uImageResCurrent);
    vec2 uvNext = getCoverUv(uv, uPlaneRes, uImageResNext);

    // ThreeUI liquid ripple active ONLY during transition (exact parameters preserved)
    float waveFactor = sin(p * 3.14159265);
    float waveDistort = sin(uv.y * 10.0 + p * 6.28318) * waveFactor * 0.05 * uDirection;

    // Directional slide (exact parameters preserved)
    vec2 offsetCurrent = vec2(-uDirection * p * 0.35 + waveDistort, 0.0);
    vec2 offsetNext = vec2(uDirection * (1.0 - p) * 0.35 + waveDistort, 0.0);

    // Dynamic chromatic aberration along the liquid wave (exact parameters preserved)
    float rgbShift = waveFactor * 0.012;

    // Liquid lens shimmer & optical refraction following cursor on hover
    vec2 mouseDist = uv - uMouse;
    float dist = length(mouseDist);
    float hoverWave = sin(dist * 18.0 - uTime * 3.5) * exp(-dist * 5.0) * uHover * 0.016;
    vec2 hoverOffset = normalize(mouseDist + 0.0001) * hoverWave;
    float hoverShift = abs(hoverWave) * 0.3;

    float totalShift = rgbShift + hoverShift;
    vec2 finalCurrent = clamp(uvCurrent + offsetCurrent + hoverOffset, 0.0, 1.0);
    vec2 finalNext = clamp(uvNext + offsetNext + hoverOffset, 0.0, 1.0);

    vec4 colorCurrent = vec4(
      texture2D(uTextureCurrent, clamp(finalCurrent + vec2(totalShift, 0.0), 0.0, 1.0)).r,
      texture2D(uTextureCurrent, finalCurrent).g,
      texture2D(uTextureCurrent, clamp(finalCurrent - vec2(totalShift, 0.0), 0.0, 1.0)).b,
      1.0
    );

    vec4 colorNext = vec4(
      texture2D(uTextureNext, clamp(finalNext + vec2(totalShift, 0.0), 0.0, 1.0)).r,
      texture2D(uTextureNext, finalNext).g,
      texture2D(uTextureNext, clamp(finalNext - vec2(totalShift, 0.0), 0.0, 1.0)).b,
      1.0
    );

    float fade = smoothstep(0.0, 1.0, p);
    gl_FragColor = mix(colorCurrent, colorNext, fade);
  }
`;

export default function ThreeDViewport({
  currentImage,
  prevImage,
  direction = "next",
  className = "",
  onImageClick,
}: ThreeDViewportProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const texturesCache = useRef<Map<string, THREE.Texture>>(new Map());

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const mouseUvRef = useRef({ x: 0.5, y: 0.5 });
  const hoverTargetRef = useRef(0);
  const hoverCurrentRef = useRef(0);
  const isVisibleRef = useRef(true);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.z = 2.0;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const getTexture = (url: string, targetUniform?: "uImageResCurrent" | "uImageResNext") => {
      if (texturesCache.current.has(url)) {
        const cached = texturesCache.current.get(url)!;
        const img = cached.image as HTMLImageElement | undefined;
        if (img?.width && img?.height && materialRef.current && targetUniform) {
          materialRef.current.uniforms[targetUniform].value.set(img.width, img.height);
        }
        return cached;
      }
      const tex = loader.load(url, (loaded) => {
        const img = loaded.image as HTMLImageElement | undefined;
        if (img?.width && img?.height && materialRef.current && targetUniform) {
          materialRef.current.uniforms[targetUniform].value.set(img.width, img.height);
        }
      });
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      texturesCache.current.set(url, tex);
      return tex;
    };

    const initialTex = getTexture(currentImage.medium || currentImage.full, "uImageResCurrent");

    // Exact camera frustum matching without horizontal stretching
    const vFov = (camera.fov * Math.PI) / 180;
    const margin = 1.04; // 4% safety margin for 3D cursor tilt
    const planeHeight = 2.0 * Math.tan(vFov / 2) * camera.position.z * margin;
    const planeWidth = planeHeight * (width / height); // EXACT aspect ratio matching container

    // 32x32 segments for silky 3D dimensional wave without overhead
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTextureCurrent: { value: initialTex },
        uTextureNext: { value: initialTex },
        uProgress: { value: 0.0 },
        uDirection: { value: 1.0 },
        uPlaneRes: { value: new THREE.Vector2(width, height) },
        uImageResCurrent: { value: new THREE.Vector2(4, 3) },
        uImageResNext: { value: new THREE.Vector2(4, 3) },
        uTime: { value: 0.0 },
        uHover: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
    });
    materialRef.current = material;

    const initImg = initialTex.image as HTMLImageElement | undefined;
    if (initImg?.width && initImg?.height) {
      material.uniforms.uImageResCurrent.value.set(initImg.width, initImg.height);
      material.uniforms.uImageResNext.value.set(initImg.width, initImg.height);
    }

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Smooth cursor 3D parallax tilt & UV coordinates
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;

      mouseUvRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseUvRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
      hoverTargetRef.current = 1.0;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      hoverTargetRef.current = 0.0;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!container || !renderer || !camera || !mesh) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      const pH = 2.0 * Math.tan(((camera.fov * Math.PI) / 180) / 2) * camera.position.z * 1.04;
      const pW = pH * (w / h);
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(pW, pH, 32, 32);

      if (materialRef.current) {
        materialRef.current.uniforms.uPlaneRes.value.set(w, h);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const intObserver = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    intObserver.observe(container);

    const clock = new THREE.Clock();
    let rafId: number;

    const animate = () => {
      if (isVisibleRef.current && renderer && scene && mesh) {
        // Smooth mouse spring dampening
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

        // Smooth hover transition
        hoverCurrentRef.current += (hoverTargetRef.current - hoverCurrentRef.current) * 0.08;

        mesh.rotation.y = mouseRef.current.x * 0.10;
        mesh.rotation.x = -mouseRef.current.y * 0.08;

        if (materialRef.current) {
          materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
          materialRef.current.uniforms.uHover.value = hoverCurrentRef.current;
          materialRef.current.uniforms.uMouse.value.set(
            mouseUvRef.current.x,
            mouseUvRef.current.y
          );
        }

        renderer.render(scene, camera);
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      intObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Animate texture transition on image change with liquid 3D wave (spot-on parameters preserved)
  useEffect(() => {
    if (!materialRef.current || !prevImage) return;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const getTexture = (url: string, targetUniform: "uImageResCurrent" | "uImageResNext") => {
      if (texturesCache.current.has(url)) {
        const cached = texturesCache.current.get(url)!;
        const img = cached.image as HTMLImageElement | undefined;
        if (img?.width && img?.height && materialRef.current) {
          materialRef.current.uniforms[targetUniform].value.set(img.width, img.height);
        }
        return cached;
      }
      const tex = loader.load(url, (loaded) => {
        const img = loaded.image as HTMLImageElement | undefined;
        if (img?.width && img?.height && materialRef.current) {
          materialRef.current.uniforms[targetUniform].value.set(img.width, img.height);
        }
      });
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      texturesCache.current.set(url, tex);
      return tex;
    };

    const nextTex = getTexture(currentImage.medium || currentImage.full, "uImageResNext");
    const currTex = getTexture(prevImage.medium || prevImage.full, "uImageResCurrent");

    materialRef.current.uniforms.uTextureCurrent.value = currTex;
    materialRef.current.uniforms.uTextureNext.value = nextTex;
    materialRef.current.uniforms.uDirection.value = direction === "next" ? 1.0 : -1.0;
    materialRef.current.uniforms.uProgress.value = 0.0;

    isTransitioningRef.current = true;

    gsap.killTweensOf(materialRef.current.uniforms.uProgress);
    gsap.to(materialRef.current.uniforms.uProgress, {
      value: 1.0,
      duration: 0.75,
      ease: "power2.inOut",
      onComplete: () => {
        if (materialRef.current) {
          materialRef.current.uniforms.uTextureCurrent.value = nextTex;
          materialRef.current.uniforms.uProgress.value = 0.0;
          materialRef.current.uniforms.uImageResCurrent.value.copy(
            materialRef.current.uniforms.uImageResNext.value
          );
        }
        isTransitioningRef.current = false;
      },
    });
  }, [currentImage, prevImage, direction]);

  return (
    <div
      ref={containerRef}
      onClick={onImageClick}
      className={`relative w-full h-full min-h-[380px] md:min-h-[480px] flex items-center justify-center cursor-pointer select-none overflow-hidden ${className}`}
    />
  );
}
