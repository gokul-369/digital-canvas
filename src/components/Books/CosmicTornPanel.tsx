import React, { useEffect, useRef } from "react";

interface CosmicTornPanelProps {
  className?: string;
  glowColor?: string;
}

function hash1(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function vnoise1(t: number, seed: number): number {
  const i = Math.floor(t);
  const f = t - i;
  const u = f * f * (3 - 2 * f);
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
  return lerp(hash1(i + seed * 97.3), hash1(i + 1 + seed * 97.3), u);
}

function hash2(x: number, y: number): number {
  const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

function buildTearEdge(TW: number, h: number): Float32Array {
  const oct: [number, number][] = [
    [1 / 380, 36],
    [1 / 150, 18],
    [1 / 65, 8.5],
    [1 / 28, 4.2],
    [1 / 12, 2.0],
  ];
  const edge = new Float32Array(h);
  for (let y = 0; y < h; y++) {
    let e = TW * 0.45;
    for (let k = 0; k < oct.length; k++) {
      e += (vnoise1(y * oct[k][0], k + 1) - 0.5) * 2 * oct[k][1];
    }
    edge[y] = e;
  }

  const alpha = new Float32Array(TW * h);
  for (let y = 0; y < h; y++) {
    const e = edge[y];
    const fib = 4 + 14 * vnoise1(y / 9, 13);
    for (let x = 0; x < TW; x++) {
      const t = (x - e) / fib;
      let v: number;
      if (t <= 0) {
        v = 1;
      } else if (t >= 1.25) {
        v = 0;
      } else {
        const n =
          hash2(Math.floor(x * 1.2), Math.floor(y * 0.9)) * 0.6 +
          hash2(Math.floor(x * 2.8) + 29, Math.floor(y * 2.3) + 17) * 0.4;
        v = Math.min(1, Math.max(0, 1.15 - t - (n - 0.5) * 0.9));
        v = v * v * (3 - 2 * v);
      }
      alpha[y * TW + x] = v;
    }
  }
  return alpha;
}

export const CosmicTornPanel: React.FC<CosmicTornPanelProps> = ({
  className = "",
  glowColor = "#6366f1",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w < 10 || h < 10) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const TW = Math.min(200, Math.round(w * 0.35));
      const X0 = Math.max(0, w - TW - 24);

      const alpha = buildTearEdge(TW, h);

      // 1. Soft cosmic shadow falloff to the right
      const BL = 30;
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.filter = `blur(${Math.max(16, Math.round(h * 0.024))}px)`;
      ctx.fillStyle = "#000000";
      ctx.fillRect(-BL, 0, X0 + 20 + BL, h);
      ctx.restore();

      // 2. Cosmic Space Torn Body: Deep space midnight dark gradient
      const bodyGrad = ctx.createLinearGradient(0, 0, w, h);
      bodyGrad.addColorStop(0, "rgba(8, 12, 24, 0.96)");
      bodyGrad.addColorStop(0.65, "rgba(6, 10, 20, 0.97)");
      bodyGrad.addColorStop(1, "rgba(4, 7, 16, 0.98)");

      ctx.fillStyle = bodyGrad;
      ctx.fillRect(-BL, 0, X0 + 1 + BL, h);

      // Create the deckled torn edge buffer
      const edgeCanvas = document.createElement("canvas");
      edgeCanvas.width = TW;
      edgeCanvas.height = h;
      const edgeCtx = edgeCanvas.getContext("2d");
      if (edgeCtx) {
        const imgData = edgeCtx.createImageData(TW, h);
        const d = imgData.data;

        // Base dark space paper color
        const r = 7, g = 11, b = 22;

        for (let i = 0; i < TW * h; i++) {
          const v = alpha[i];
          d[i * 4] = r;
          d[i * 4 + 1] = g;
          d[i * 4 + 2] = b;
          d[i * 4 + 3] = v * 255;
        }
        edgeCtx.putImageData(imgData, 0, 0);
        ctx.drawImage(edgeCanvas, X0, 0);
      }

      // 3. Glowing Aurora / Starlight Deckle Edge
      // Creates an ethereal cosmic rim along the tear line
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      for (let y = 0; y < h; y += 3) {
        let e = X0 + TW * 0.45;
        e += (vnoise1(y / 150, 1) - 0.5) * 36;
        e += (vnoise1(y / 65, 2) - 0.5) * 16;
        if (y === 0) ctx.moveTo(e, y);
        else ctx.lineTo(e, y);
      }
      ctx.stroke();
      ctx.restore();

      // 4. Embedded Micro-stardust & Paper Fibers
      ctx.save();
      ctx.globalCompositeOperation = "source-atop";
      for (let i = 0; i < 600; i++) {
        const rx = Math.random() * (X0 + TW * 0.4);
        const ry = Math.random() * h;
        const size = Math.random() < 0.85 ? 1 : 1.8;
        const opacity = 0.05 + Math.random() * 0.22;
        ctx.fillStyle = `rgba(180, 205, 255, ${opacity})`;
        ctx.fillRect(rx, ry, size, size);
      }
      ctx.restore();
    };

    render();

    const ro = new ResizeObserver(() => render());
    if (canvas.parentElement) {
      ro.observe(canvas.parentElement);
    }
    return () => ro.disconnect();
  }, [glowColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
};

export default CosmicTornPanel;
