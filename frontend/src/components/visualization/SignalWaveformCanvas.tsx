import React, { useRef, useEffect, useState } from 'react';

interface SignalWaveformCanvasProps {
  variant?: 'banner' | 'card' | 'compact';
  interactive?: boolean;
  className?: string;
}

export const SignalWaveformCanvas: React.FC<SignalWaveformCanvasProps> = ({
  variant = 'banner',
  interactive = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || isReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRef.current.targetX = x * 20;
    mouseRef.current.targetY = y * 15;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let isVisible = true;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const render = () => {
      if (!ctx || !isVisible) {
        if (!isReducedMotion) animId = requestAnimationFrame(render);
        return;
      }

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw scientific coordinate grid
      ctx.save();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const step = 40;
      const offsetX = mouseRef.current.x * 0.2;
      const offsetY = mouseRef.current.y * 0.2;

      ctx.beginPath();
      for (let x = (offsetX % step); x < width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = (offsetY % step); y < height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.globalAlpha = 0.55;
      ctx.stroke();

      // Draw subtle intersection crosshairs
      ctx.fillStyle = '#94a3b8';
      ctx.globalAlpha = 0.6;
      for (let x = (offsetX % step); x < width; x += step * 2) {
        for (let y = (offsetY % step); y < height; y += step * 2) {
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }
      ctx.restore();

      // 2. Draw Scientific Signal Waveforms (Attention variance, token distribution, logprob confidence)
      const centerY = height * 0.52;

      const waves = [
        // Primary Signal: Precision Cobalt (#0284c7)
        {
          freq: 0.012,
          amp: height * 0.18,
          phase: time * 0.8,
          color: '#0284c7',
          alpha: 0.85,
          width: 1.8,
        },
        // Secondary harmonic: Slate Blue (#475569)
        {
          freq: 0.02,
          amp: height * 0.11,
          phase: time * 1.1 + 1.2,
          color: '#475569',
          alpha: 0.45,
          width: 1.2,
        },
        // High-frequency statistical jitter: Emerald (#059669)
        {
          freq: 0.035,
          amp: height * 0.07,
          phase: time * 1.4 + 2.5,
          color: '#059669',
          alpha: 0.55,
          width: 1.4,
        },
      ];

      for (const wave of waves) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.width;
        ctx.globalAlpha = wave.alpha;

        for (let x = 0; x < width; x += 3) {
          const envelope = Math.sin((x / width) * Math.PI); // Window tapering at edges
          const y =
            centerY +
            Math.sin(x * wave.freq + wave.phase) * wave.amp * envelope +
            Math.cos(x * wave.freq * 0.5 + wave.phase * 0.6) * (wave.amp * 0.3) * envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Sample data points along wave
        if (!isReducedMotion) {
          for (let sp = 80; sp < width; sp += 160) {
            const envelope = Math.sin((sp / width) * Math.PI);
            const py =
              centerY +
              Math.sin(sp * wave.freq + wave.phase) * wave.amp * envelope +
              Math.cos(sp * wave.freq * 0.5 + wave.phase * 0.6) * (wave.amp * 0.3) * envelope;

            ctx.fillStyle = wave.color;
            ctx.beginPath();
            ctx.arc(sp, py, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Subtle ring
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(sp, py, 5, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // 3. Technical coordinate telemetry watermark
      ctx.save();
      ctx.font = '500 9.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.globalAlpha = 0.7;
      ctx.fillText('SIGNAL f(x) = ∑ Aᵢ · sin(ωᵢt + φᵢ)', 14, 18);
      ctx.fillText(`Δt: ${(time * 0.1).toFixed(2)}s | SAMPLE RATE: 1000Hz`, 14, 32);
      ctx.restore();

      time += isReducedMotion ? 0 : 0.015;

      if (!isReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    render();

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, [isReducedMotion]);

  const heightClasses = {
    banner: 'h-48 sm:h-56',
    card: 'h-64 sm:h-72',
    compact: 'h-36',
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full overflow-hidden bg-white select-none ${heightClasses[variant]} ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
