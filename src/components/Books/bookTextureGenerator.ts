import * as THREE from "three";
import type { Book } from "../../data/books";

/**
 * Creates high-resolution canvas textures for the 3D Book:
 * - Front Cover
 * - Spine
 * - Back Cover
 * - Inside Left Page
 * - Inside Right Page
 * - Pages Edges
 */

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1500;

export function createFrontCoverTexture(book: Book): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const { coverBg, accent, foilColor, textColor } = book.palette;

  // Background with subtle cloth/leather texture
  const bgGrad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  bgGrad.addColorStop(0, coverBg);
  bgGrad.addColorStop(0.5, coverBg);
  bgGrad.addColorStop(1, "#05070a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Subtle paper grain overlay
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * CANVAS_WIDTH;
    const y = Math.random() * CANVAS_HEIGHT;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Left spine hinge shadow
  const hingeGrad = ctx.createLinearGradient(0, 0, 70, 0);
  hingeGrad.addColorStop(0, "rgba(0,0,0,0.7)");
  hingeGrad.addColorStop(0.5, "rgba(0,0,0,0.3)");
  hingeGrad.addColorStop(1, "transparent");
  ctx.fillStyle = hingeGrad;
  ctx.fillRect(0, 0, 70, CANVAS_HEIGHT);

  // Outer Gold Foil Border
  ctx.strokeStyle = foilColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, CANVAS_WIDTH - 120, CANVAS_HEIGHT - 120);

  // Inner Ornate Border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 2;
  ctx.strokeRect(76, 76, CANVAS_WIDTH - 152, CANVAS_HEIGHT - 152);

  // Corner Ornaments
  const corners = [
    [76, 76],
    [CANVAS_WIDTH - 76, 76],
    [76, CANVAS_HEIGHT - 76],
    [CANVAS_WIDTH - 76, CANVAS_HEIGHT - 76],
  ];
  ctx.fillStyle = foilColor;
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Top Category Tag
  ctx.font = "bold 24px 'Space Grotesk', monospace, sans-serif";
  ctx.fillStyle = accent;
  ctx.textAlign = "center";
  ctx.letterSpacing = "6px";
  ctx.fillText(book.category.toUpperCase(), CANVAS_WIDTH / 2, 160);

  // Decorative Rule
  ctx.strokeStyle = foilColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2 - 120, 195);
  ctx.lineTo(CANVAS_WIDTH / 2 + 120, 195);
  ctx.stroke();

  // Emblem / Diamond
  ctx.fillStyle = foilColor;
  ctx.beginPath();
  ctx.arc(CANVAS_WIDTH / 2, 195, 5, 0, Math.PI * 2);
  ctx.fill();

  // Book Title
  ctx.fillStyle = textColor;
  ctx.font = "bold 78px 'Space Grotesk', serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "2px";

  // Multi-line title wrap if long
  const words = book.title.split(" ");
  if (words.length > 2 && book.title.length > 15) {
    const half = Math.ceil(words.length / 2);
    const line1 = words.slice(0, half).join(" ");
    const line2 = words.slice(half).join(" ");
    ctx.fillText(line1, CANVAS_WIDTH / 2, 430);
    ctx.fillText(line2, CANVAS_WIDTH / 2, 520);
  } else {
    ctx.fillText(book.title, CANVAS_WIDTH / 2, 470);
  }

  // Subtitle
  if (book.subtitle) {
    ctx.font = "italic 28px 'Caveat', serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillText(book.subtitle, CANVAS_WIDTH / 2, 590);
  }

  // Center Emblem Silhouette
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(CANVAS_WIDTH / 2, 820, 140, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = foilColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(CANVAS_WIDTH / 2, 820, 125, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Roman Icon / Star
  ctx.font = "bold 64px serif";
  ctx.fillStyle = foilColor;
  ctx.fillText("✦", CANVAS_WIDTH / 2, 840);

  // Author Name
  ctx.font = "bold 44px 'Space Grotesk', serif";
  ctx.fillStyle = foilColor;
  ctx.letterSpacing = "4px";
  ctx.fillText(book.author.toUpperCase(), CANVAS_WIDTH / 2, 1150);

  // Publication Year & Edition
  ctx.font = "300 24px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.letterSpacing = "3px";
  ctx.fillText(`CLASSIC EDITION · ${book.year}`, CANVAS_WIDTH / 2, 1220);

  // Status Badge at bottom
  if (book.status === "Currently Reading") {
    ctx.fillStyle = "rgba(99, 102, 241, 0.35)";
    ctx.beginPath();
    ctx.roundRect(CANVAS_WIDTH / 2 - 180, 1310, 360, 56, 28);
    ctx.fill();
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "bold 22px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.letterSpacing = "2px";
    ctx.fillText("● CURRENTLY READING", CANVAS_WIDTH / 2, 1346);
  } else if (book.status === "Core Canon") {
    ctx.font = "bold 20px monospace";
    ctx.fillStyle = accent;
    ctx.letterSpacing = "3px";
    ctx.fillText("★ CORE CANON FAVORITE", CANVAS_WIDTH / 2, 1346);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createSpineTexture(book: Book): THREE.CanvasTexture {
  const width = 256;
  const height = 1500;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const { spineColor, foilColor, textColor } = book.palette;

  // Spine gradient with 3D cylindrical lighting
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, "rgba(0,0,0,0.85)");
  grad.addColorStop(0.35, spineColor);
  grad.addColorStop(0.65, spineColor);
  grad.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Raised Ribs (Headband & ridges)
  const ribs = [100, 115, 380, 395, 750, 765, 1120, 1135, 1400, 1415];
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ribs.forEach((y) => ctx.fillRect(10, y, width - 20, 4));
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ribs.forEach((y) => ctx.fillRect(10, y - 4, width - 20, 2));

  // Top Emblem
  ctx.font = "32px serif";
  ctx.fillStyle = foilColor;
  ctx.textAlign = "center";
  ctx.fillText("✦", width / 2, 220);

  // Vertical Title & Author (Rotated 90 degrees)
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(Math.PI / 2);

  ctx.font = "bold 42px 'Space Grotesk', serif";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.letterSpacing = "3px";
  ctx.fillText(book.title.toUpperCase(), 0, -8);

  ctx.font = "300 26px 'Space Grotesk', sans-serif";
  ctx.fillStyle = foilColor;
  ctx.fillText(book.author.toUpperCase(), 0, 38);
  ctx.restore();

  // Bottom Year
  ctx.font = "bold 24px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.textAlign = "center";
  ctx.fillText(book.year, width / 2, 1340);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createBackCoverTexture(book: Book): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const { coverBg, accent, foilColor, textColor } = book.palette;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  bgGrad.addColorStop(0, coverBg);
  bgGrad.addColorStop(1, "#070a0f");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Border
  ctx.strokeStyle = foilColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, CANVAS_WIDTH - 120, CANVAS_HEIGHT - 120);

  // Top Header
  ctx.font = "bold 26px 'Space Grotesk', monospace";
  ctx.fillStyle = accent;
  ctx.textAlign = "center";
  ctx.letterSpacing = "4px";
  ctx.fillText("// LITERARY CODEX ARCHIVE", CANVAS_WIDTH / 2, 160);

  // Synopsis Header
  ctx.font = "bold 44px 'Space Grotesk', serif";
  ctx.fillStyle = textColor;
  ctx.fillText(book.title, CANVAS_WIDTH / 2, 300);

  // Synopsis Body
  ctx.font = "28px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  ctx.textAlign = "center";
  wrapText(ctx, book.synopsis, CANVAS_WIDTH / 2, 400, 780, 48);

  // Quote Box
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.beginPath();
  ctx.roundRect(140, 700, CANVAS_WIDTH - 280, 320, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Quote Icon
  ctx.font = "bold 72px serif";
  ctx.fillStyle = foilColor;
  ctx.fillText("“", CANVAS_WIDTH / 2, 770);

  // Quote Text
  ctx.font = "italic 32px 'Caveat', serif";
  ctx.fillStyle = "#ffffff";
  wrapText(ctx, `"${book.quote}"`, CANVAS_WIDTH / 2, 840, 680, 46);

  // Barcode / Archive Seal
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(CANVAS_WIDTH / 2 - 140, 1180, 280, 80);
  ctx.fillStyle = "#000000";
  // Fake Barcode lines
  for (let x = CANVAS_WIDTH / 2 - 130; x < CANVAS_WIDTH / 2 + 130; x += 8) {
    const w = (x % 5 === 0) ? 5 : 2;
    ctx.fillRect(x, 1188, w, 64);
  }

  ctx.font = "bold 18px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillText(`ISBN 978-0-${book.year}-GK369`, CANVAS_WIDTH / 2, 1310);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createInsideLeftPageTexture(book: Book): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Aged Parchment / Premium Paper Texture
  const bgGrad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
  bgGrad.addColorStop(0, "#ece5d8");
  bgGrad.addColorStop(0.9, "#f5efe6");
  bgGrad.addColorStop(1, "#dfd6c6");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Right Gutter Shadow
  const gutter = ctx.createLinearGradient(CANVAS_WIDTH - 90, 0, CANVAS_WIDTH, 0);
  gutter.addColorStop(0, "transparent");
  gutter.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = gutter;
  ctx.fillRect(CANVAS_WIDTH - 90, 0, 90, CANVAS_HEIGHT);

  // Thin vintage frame
  ctx.strokeStyle = "#8a7e6b";
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 80, CANVAS_WIDTH - 160, CANVAS_HEIGHT - 160);

  // Header
  ctx.font = "bold 24px monospace";
  ctx.fillStyle = "#635948";
  ctx.textAlign = "center";
  ctx.letterSpacing = "5px";
  ctx.fillText("GOKUL'S READING CODEX", CANVAS_WIDTH / 2, 180);

  // Frontispiece Book Title
  ctx.font = "bold 60px serif";
  ctx.fillStyle = "#1c1813";
  ctx.letterSpacing = "1px";
  wrapText(ctx, book.title, CANVAS_WIDTH / 2, 380, 720, 70);

  if (book.subtitle) {
    ctx.font = "italic 28px serif";
    ctx.fillStyle = "#5c503f";
    ctx.fillText(book.subtitle, CANVAS_WIDTH / 2, 490);
  }

  // Divider
  ctx.strokeStyle = "#9c8e77";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2 - 100, 560);
  ctx.lineTo(CANVAS_WIDTH / 2 + 100, 560);
  ctx.stroke();

  // Author & Metadata
  ctx.font = "bold 36px serif";
  ctx.fillStyle = "#2c2419";
  ctx.fillText(book.author, CANVAS_WIDTH / 2, 640);

  ctx.font = "24px monospace";
  ctx.fillStyle = "#736450";
  ctx.fillText(`First Published: ${book.year}`, CANVAS_WIDTH / 2, 700);
  ctx.fillText(`Category: ${book.category}`, CANVAS_WIDTH / 2, 750);

  // Status Plaque
  ctx.fillStyle = "#dfd5c4";
  ctx.beginPath();
  ctx.roundRect(CANVAS_WIDTH / 2 - 180, 840, 360, 60, 30);
  ctx.fill();
  ctx.strokeStyle = "#9c8d76";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = "bold 22px monospace";
  ctx.fillStyle = book.status === "Currently Reading" ? "#4338ca" : "#1c1813";
  ctx.fillText(`STATUS: ${book.status.toUpperCase()}`, CANVAS_WIDTH / 2, 878);

  // Star Rating
  ctx.font = "38px serif";
  ctx.fillStyle = "#d97706";
  const stars = "★".repeat(book.rating) + "☆".repeat(5 - book.rating);
  ctx.fillText(stars, CANVAS_WIDTH / 2, 970);

  // Footer Note
  ctx.font = "italic 22px serif";
  ctx.fillStyle = "#7a6c57";
  ctx.fillText("From the personal collection of Gokul", CANVAS_WIDTH / 2, 1340);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createInsideRightPageTexture(book: Book): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Aged Parchment
  const bgGrad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
  bgGrad.addColorStop(0, "#dfd6c6");
  bgGrad.addColorStop(0.1, "#f5efe6");
  bgGrad.addColorStop(1, "#ece5d8");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Left Gutter Shadow
  const gutter = ctx.createLinearGradient(0, 0, 90, 0);
  gutter.addColorStop(0, "rgba(0,0,0,0.22)");
  gutter.addColorStop(1, "transparent");
  ctx.fillStyle = gutter;
  ctx.fillRect(0, 0, 90, CANVAS_HEIGHT);

  // Section Header
  ctx.font = "bold 26px 'Space Grotesk', monospace";
  ctx.fillStyle = "#4f46e5";
  ctx.textAlign = "left";
  ctx.letterSpacing = "4px";
  ctx.fillText("// PERSONAL NOTES & REFLECTION", 120, 160);

  // Title of reflection
  ctx.font = "bold 44px 'Space Grotesk', serif";
  ctx.fillStyle = "#1e1b18";
  ctx.fillText("Core Takeaway", 120, 240);

  // Personal Takeaway Body Text
  ctx.font = "28px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#2d2822";
  wrapText(ctx, book.takeaway, 120, 310, 780, 48, "left");

  // Divider
  ctx.strokeStyle = "#c5b8a5";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(120, 680);
  ctx.lineTo(CANVAS_WIDTH - 120, 680);
  ctx.stroke();

  // Memorable Passage Header
  ctx.font = "bold 32px 'Space Grotesk', serif";
  ctx.fillStyle = "#1e1b18";
  ctx.fillText("Memorable Passage", 120, 750);

  // Memorable Passage Quote
  ctx.font = "italic 30px 'Caveat', serif";
  ctx.fillStyle = "#3f3931";
  wrapText(ctx, `"${book.quote}"`, 120, 820, 780, 46, "left");

  // Attribution
  ctx.font = "bold 22px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#635948";
  ctx.fillText(`— ${book.author}, ${book.title}`, 120, 1140);

  // Page Number at Bottom Right
  ctx.font = "bold 22px monospace";
  ctx.fillStyle = "#7a6c57";
  ctx.textAlign = "right";
  ctx.fillText("PAGE 42", CANVAS_WIDTH - 120, 1340);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createPagesEdgeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#f3eee5";
  ctx.fillRect(0, 0, 512, 512);

  // Fine striations of paper leaves
  for (let y = 0; y < 512; y += 3) {
    const alpha = (y % 6 === 0) ? 0.35 : 0.12;
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

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: "center" | "left" = "center"
) {
  ctx.textAlign = align;
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
