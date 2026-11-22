import * as THREE from "three";

/**
 * Creates high-resolution paper pages edge texture for 3D Books
 */
export function createPagesEdgeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Creamy vintage off-white book paper
  ctx.fillStyle = "#f4efe6";
  ctx.fillRect(0, 0, 512, 512);

  // Fine striations of paper leaves
  for (let y = 0; y < 512; y += 3) {
    const alpha = y % 6 === 0 ? 0.35 : 0.12;
    ctx.strokeStyle = `rgba(140, 120, 95, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
