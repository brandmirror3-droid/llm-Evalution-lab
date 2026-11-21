import React, { useRef, useEffect, useState, useCallback } from 'react';

interface IntelligencePulseCanvasProps {
  variant?: 'hero' | 'standalone' | 'compact' | 'background';
  showLabels?: boolean;
  interactive?: boolean;
  className?: string;
}

interface NodePoint {
  id: string;
  stage: 'input' | 'model' | 'eval' | 'insight';
  label: string;
  sublabel: string;
  baseX: number; // Normalized 0-1
  baseY: number; // Normalized 0-1
  x: number;
  y: number;
  radius: number;
  phase: number;
  pulseRadius: number;
  pulseAlpha: number;
  isPrimary: boolean;
}

interface BezierConnection {
  from: NodePoint;
  to: NodePoint;
  cp1X: number;
  cp1Y: number;
  cp2X: number;
  cp2Y: number;
  color: string;
  active: boolean;
}

interface Particle {
  connectionIdx: number;
  t: number; // 0 to 1 along curve
  speed: number;
  size: number;
  alpha: number;
}

interface AmbientDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export const IntelligencePulseCanvas: React.FC<IntelligencePulseCanvasProps> = ({
  variant = 'hero',
  showLabels = true,
  interactive = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Parallax offsets
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || isReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRef.current.targetX = x * 35; // Max 35px parallax offset
    mouseRef.current.targetY = y * 25;
  }, [interactive, isReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let isVisible = true;

    // Handle high DPI
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

    // Architectural Stages: INPUT -> MODEL -> EVALUATION -> INSIGHTS
    const primaryNodes: NodePoint[] = [
      {
        id: 'node-input',
        stage: 'input',
        label: 'INPUT',
        sublabel: 'Prompts & Datasets',
        baseX: 0.14,
        baseY: 0.5,
        x: 0,
        y: 0,
        radius: 7,
        phase: 0,
        pulseRadius: 0,
        pulseAlpha: 0,
        isPrimary: true,
      },
      {
        id: 'node-model',
        stage: 'model',
        label: 'MODEL',
        sublabel: 'Attention & Latents',
        baseX: 0.38,
        baseY: 0.44,
        x: 0,
        y: 0,
        radius: 9,
        phase: 1.5,
        pulseRadius: 0,
        pulseAlpha: 0,
        isPrimary: true,
      },
      {
        id: 'node-eval',
        stage: 'eval',
        label: 'EVALUATION',
        sublabel: 'Rubrics & Judges',
        baseX: 0.64,
        baseY: 0.54,
        x: 0,
        y: 0,
        radius: 9,
        phase: 3.1,
        pulseRadius: 0,
        pulseAlpha: 0,
        isPrimary: true,
      },
      {
        id: 'node-insight',
        stage: 'insight',
        label: 'INSIGHTS',
        sublabel: 'Reliability & Error Taxa',
        baseX: 0.88,
        baseY: 0.48,
        x: 0,
        y: 0,
        radius: 7,
        phase: 4.6,
        pulseRadius: 0,
        pulseAlpha: 0,
        isPrimary: true,
      },
    ];

    // Constellation satellite nodes
    const satelliteNodes: NodePoint[] = [
      {
        id: 'sat-1',
        stage: 'input',
        label: '',
        sublabel: '',
        baseX: 0.22,
        baseY: 0.28,
        x: 0,
        y: 0,
        radius: 3.5,
        phase: 0.8,
        pulseRadius: 0,
        pulseAlpha: 0,
        isPrimary: false,
      },
      {
        id: 'sat-2',
        stage: 'input',
        label: '',
        sublabel: '',
        baseX: 0.2,
        baseY: 0.72,
        x: 0,
        y: 0,
        radius: 3.5,
        phase: 2.2,
        pulseRadius: 0,
        pulseAlpha: 0,
        isPrimary: false,
      },
      {
        id: 'sat-3',
        stage: 'model',
        label: '',
        sublabel: '',
        baseX: 0.46,
        baseY: 0.22,
        x: 0,
        y: 0,
        radius: 4,
        phase: 1.1,
        pulseRadius: 0,
        pulseAlpha: 0,
        isPrimary: false,
      },
      {
        id: 'sat-4',
        stage: 'model',
        label: '',
        sublabel: '',
        baseX: 0.44,
        baseY: 0.76,
        x: 0,
        y: 0,
        radius: 3.5,
        phase: 3.4,
        pulseRadius: 0,
        pulseAlpha: 0,
        isPrimary: false,
      },
      {
        id: 'sat-5',
        stage: 'eval',
        label: '',
        sublabel: '',
        baseX: 0.74,
        baseY: 0.32,
        x: 0,
        y: 0,
        radius: 4,
        phase: 2.7,
        pulseRadius: 0,
        pulseAlpha: 0,
        isPrimary: false,
      },
      {
        id: 'sat-6',
        stage: 'eval',
        label: '',
        sublabel: '',
        baseX: 0.72,
        baseY: 0.78,
        x: 0,
        y: 0,
        radius: 3.5,
        phase: 4.1,
        pulseRadius: 0,
        pulseAlpha: 0,
        isPrimary: false,
      },
    ];

    const allNodes = [...primaryNodes, ...satelliteNodes];

    // Build connections
    const connections: BezierConnection[] = [
      // Primary backbone
      { from: primaryNodes[0], to: primaryNodes[1], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#a3e635', active: true },
      { from: primaryNodes[1], to: primaryNodes[2], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#a3e635', active: true },
      { from: primaryNodes[2], to: primaryNodes[3], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#a3e635', active: true },

      // Satellite branches
      { from: primaryNodes[0], to: satelliteNodes[0], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },
      { from: primaryNodes[0], to: satelliteNodes[1], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },
      { from: satelliteNodes[0], to: primaryNodes[1], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },
      { from: satelliteNodes[1], to: primaryNodes[1], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },

      { from: primaryNodes[1], to: satelliteNodes[2], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },
      { from: primaryNodes[1], to: satelliteNodes[3], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },
      { from: satelliteNodes[2], to: primaryNodes[2], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },
      { from: satelliteNodes[3], to: primaryNodes[2], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },

      { from: primaryNodes[2], to: satelliteNodes[4], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },
      { from: primaryNodes[2], to: satelliteNodes[5], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },
      { from: satelliteNodes[4], to: primaryNodes[3], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },
      { from: satelliteNodes[5], to: primaryNodes[3], cp1X: 0, cp1Y: 0, cp2X: 0, cp2Y: 0, color: '#64748b', active: false },
    ];

    // Data photon particles traveling across paths
    const particles: Particle[] = [
      { connectionIdx: 0, t: 0.1, speed: 0.0035, size: 2.2, alpha: 0.9 },
      { connectionIdx: 0, t: 0.6, speed: 0.0038, size: 1.8, alpha: 0.7 },
      { connectionIdx: 1, t: 0.3, speed: 0.0042, size: 2.4, alpha: 0.95 },
      { connectionIdx: 1, t: 0.8, speed: 0.0032, size: 1.6, alpha: 0.65 },
      { connectionIdx: 2, t: 0.2, speed: 0.004, size: 2.2, alpha: 0.9 },
      { connectionIdx: 2, t: 0.7, speed: 0.0035, size: 1.8, alpha: 0.75 },
      // Satellite loops
      { connectionIdx: 3, t: 0.4, speed: 0.003, size: 1.5, alpha: 0.6 },
      { connectionIdx: 5, t: 0.7, speed: 0.0032, size: 1.5, alpha: 0.6 },
      { connectionIdx: 7, t: 0.2, speed: 0.0035, size: 1.6, alpha: 0.6 },
      { connectionIdx: 9, t: 0.5, speed: 0.003, size: 1.4, alpha: 0.55 },
      { connectionIdx: 11, t: 0.3, speed: 0.0034, size: 1.5, alpha: 0.6 },
      { connectionIdx: 13, t: 0.6, speed: 0.003, size: 1.4, alpha: 0.55 },
    ];

    // Ambient latent space dust
    const dustParticles: AmbientDust[] = [];
    const dustCount = variant === 'compact' ? 18 : 36;
    for (let i = 0; i < dustCount; i++) {
      dustParticles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00018,
        vy: (Math.random() - 0.5) * 0.00018,
        size: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.35 + 0.1,
      });
    }

    let time = 0;
    let lastPulseTime = 0;
    let pulseNodeIdx = 0;

    // Cubic Bezier interpolation helper
    const getBezierPoint = (
      p0x: number,
      p0y: number,
      cp1x: number,
      cp1y: number,
      cp2x: number,
      cp2y: number,
      p3x: number,
      p3y: number,
      t: number
    ) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * p0x + 3 * uu * t * cp1x + 3 * u * tt * cp2x + ttt * p3x;
      const y = uuu * p0y + 3 * uu * t * cp1y + 3 * u * tt * cp2y + ttt * p3y;
      return { x, y };
    };

    // Render loop
    const render = () => {
      if (!ctx || !isVisible) {
        if (!isReducedMotion) {
          animationFrameId = requestAnimationFrame(render);
        }
        return;
      }

      // Smooth mouse parallax interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      const parallaxX = mouseRef.current.x;
      const parallaxY = mouseRef.current.y;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle coordinate research grid
      ctx.save();
      ctx.strokeStyle = '#1d222b';
      ctx.lineWidth = 1;
      const gridStep = 48;
      const offsetX = (parallaxX * 0.3) % gridStep;
      const offsetY = (parallaxY * 0.3) % gridStep;

      ctx.beginPath();
      for (let gx = offsetX; gx < width; gx += gridStep) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      for (let gy = offsetY; gy < height; gy += gridStep) {
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
      }
      ctx.globalAlpha = 0.22;
      ctx.stroke();
      ctx.restore();

      // 2. Draw ambient latent space dust
      ctx.save();
      for (const dust of dustParticles) {
        if (!isReducedMotion) {
          dust.x += dust.vx;
          dust.y += dust.vy;
          if (dust.x < 0) dust.x = 1;
          if (dust.x > 1) dust.x = 0;
          if (dust.y < 0) dust.y = 1;
          if (dust.y > 1) dust.y = 0;
        }

        const dx = dust.x * width + parallaxX * 0.5;
        const dy = dust.y * height + parallaxY * 0.5;

        ctx.fillStyle = '#9ca3af';
        ctx.globalAlpha = dust.alpha;
        ctx.beginPath();
        ctx.arc(dx, dy, dust.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Update node positions with harmonic drift
      for (const node of allNodes) {
        const driftX = isReducedMotion ? 0 : Math.sin(time * 0.7 + node.phase) * 5;
        const driftY = isReducedMotion ? 0 : Math.cos(time * 0.9 + node.phase) * 6;

        node.x = node.baseX * width + driftX + parallaxX;
        node.y = node.baseY * height + driftY + parallaxY;
      }

      // 4. Trigger occasional gentle pulse at stages
      if (!isReducedMotion && time - lastPulseTime > 2.2) {
        lastPulseTime = time;
        const targetNode = primaryNodes[pulseNodeIdx % primaryNodes.length];
        targetNode.pulseRadius = targetNode.radius;
        targetNode.pulseAlpha = 0.55;
        pulseNodeIdx++;
      }

      // 5. Draw Bezier connections
      for (const conn of connections) {
        const dx = conn.to.x - conn.from.x;
        const dy = conn.to.y - conn.from.y;

        // Calculate natural curved control points
        conn.cp1X = conn.from.x + dx * 0.45;
        conn.cp1Y = conn.from.y + dy * 0.05 + Math.sin(time + conn.from.phase) * 4;
        conn.cp2X = conn.from.x + dx * 0.55;
        conn.cp2Y = conn.to.y - dy * 0.05 + Math.cos(time + conn.to.phase) * 4;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.bezierCurveTo(
          conn.cp1X,
          conn.cp1Y,
          conn.cp2X,
          conn.cp2Y,
          conn.to.x,
          conn.to.y
        );

        if (conn.active) {
          // Primary backbone: subtle breathing lime glow
          const breath = isReducedMotion ? 0.35 : 0.28 + Math.sin(time * 1.5) * 0.12;
          ctx.strokeStyle = '#a3e635';
          ctx.globalAlpha = breath;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Soft ambient outer line
          ctx.lineWidth = 4;
          ctx.globalAlpha = breath * 0.25;
          ctx.stroke();
        } else {
          // Satellite fine web lines
          ctx.strokeStyle = '#475569';
          ctx.globalAlpha = 0.22;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 4]);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 6. Draw traveling data photon particles
      if (!isReducedMotion) {
        ctx.save();
        for (const p of particles) {
          p.t += p.speed;
          if (p.t > 1) p.t = 0;

          const conn = connections[p.connectionIdx];
          const pos = getBezierPoint(
            conn.from.x,
            conn.from.y,
            conn.cp1X,
            conn.cp1Y,
            conn.cp2X,
            conn.cp2Y,
            conn.to.x,
            conn.to.y,
            p.t
          );

          // Glowing particle core
          ctx.fillStyle = conn.active ? '#a3e635' : '#e2e8f0';
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Halo glow
          ctx.fillStyle = '#a3e635';
          ctx.globalAlpha = p.alpha * 0.3;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, p.size * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 7. Draw Nodes and Pulse Rings
      for (const node of allNodes) {
        ctx.save();

        // Active pulse shockwave
        if (node.pulseAlpha > 0.01) {
          ctx.strokeStyle = '#a3e635';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = node.pulseAlpha;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
          ctx.stroke();

          if (!isReducedMotion) {
            node.pulseRadius += 0.8;
            node.pulseAlpha *= 0.94;
          }
        }

        if (node.isPrimary) {
          // Outer target reticle / orbit ring
          ctx.strokeStyle = '#a3e635';
          ctx.globalAlpha = 0.35;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
          ctx.stroke();

          // Outer tick indicators
          const tickAngle = time * 0.4 + node.phase;
          ctx.strokeStyle = '#a3e635';
          ctx.globalAlpha = 0.65;
          ctx.beginPath();
          ctx.arc(
            node.x,
            node.y,
            node.radius * 2.2,
            tickAngle,
            tickAngle + Math.PI * 0.3
          );
          ctx.stroke();

          // Inner dark core
          ctx.fillStyle = '#0f1216';
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();

          // Border
          ctx.strokeStyle = '#a3e635';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.85;
          ctx.stroke();

          // Center nucleus
          ctx.fillStyle = '#a3e635';
          ctx.globalAlpha = 0.9;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();

          // Labels
          if (showLabels && variant !== 'compact') {
            ctx.fillStyle = '#f4f5f7';
            ctx.globalAlpha = 0.9;
            ctx.font = '600 11px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + node.radius * 2.2 + 16);

            ctx.fillStyle = '#646b79';
            ctx.globalAlpha = 0.8;
            ctx.font = '400 9.5px "Inter", sans-serif';
            ctx.fillText(node.sublabel, node.x, node.y + node.radius * 2.2 + 28);
          }
        } else {
          // Satellite node
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#94a3b8';
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      time += 0.018;

      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Visibility observer to stop loop when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Tab visibility handling
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    render();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, showLabels, isReducedMotion]);

  const heightClasses = {
    hero: 'h-64 sm:h-72 lg:h-80',
    standalone: 'h-96',
    compact: 'h-48',
    background: 'h-full w-full absolute inset-0 pointer-events-none',
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full overflow-hidden select-none ${heightClasses[variant]} ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
};
