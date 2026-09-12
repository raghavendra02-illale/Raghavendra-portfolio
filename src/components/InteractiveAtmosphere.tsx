import React, { useEffect, useRef } from 'react';
import { playPopSound } from '../utils/audioFx';

export type AtmosphereMode = 'circuits' | 'radar' | 'sky' | 'aurora';

interface InteractiveAtmosphereProps {
  mode: AtmosphereMode;
  onModeChange?: (mode: AtmosphereMode) => void;
  isLight?: boolean;
}

interface CircuitNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  pulsePhase: number;
  pulseSpeed: number;
  isTemporary?: boolean;
  life?: number;
  maxLife?: number;
}

interface CircuitDataPacket {
  nodeAIndex: number;
  nodeBIndex: number;
  progress: number;
  speed: number;
  color: string;
}

interface RadarPing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  rings: number;
}

interface StarNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  twinklePhase: number;
  twinkleSpeed: number;
  clusterId: number;
}

interface MeteorTrail {
  startX: number;
  startY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

interface AuroraWave {
  baseY: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  color: string;
  lineWidth: number;
}

const PALETTE_DARK = {
  cyan: 'rgba(6, 182, 212, ',
  emerald: 'rgba(16, 185, 129, ',
  sky: 'rgba(56, 189, 248, ',
  blue: 'rgba(59, 130, 246, ',
  violet: 'rgba(139, 92, 246, ',
  amber: 'rgba(245, 158, 11, ',
  white: 'rgba(255, 255, 255, ',
};

const PALETTE_LIGHT = {
  cyan: 'rgba(2, 132, 199, ',
  emerald: 'rgba(5, 150, 105, ',
  sky: 'rgba(14, 165, 233, ',
  blue: 'rgba(37, 99, 235, ',
  violet: 'rgba(124, 58, 237, ',
  amber: 'rgba(217, 119, 6, ',
  white: 'rgba(15, 23, 42, ',
};

export const InteractiveAtmosphere: React.FC<InteractiveAtmosphereProps> = ({
  mode,
  isLight: propIsLight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<CircuitNode[]>([]);
  const packetsRef = useRef<CircuitDataPacket[]>([]);
  const pingsRef = useRef<RadarPing[]>([]);
  const starsRef = useRef<StarNode[]>([]);
  const meteorsRef = useRef<MeteorTrail[]>([]);
  const auroraWavesRef = useRef<AuroraWave[]>([]);
  const radarAngleRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const pointerRef = useRef<{
    x: number;
    y: number;
    active: boolean;
    lastMove: number;
  }>({
    x: -2000,
    y: -2000,
    active: false,
    lastMove: 0,
  });

  // Spawn visual shockwave or starburst or aurora ripple on tap/click (Zero words!)
  const spawnInteractionFX = (x: number, y: number) => {
    const isLight =
      propIsLight ??
      (typeof document !== 'undefined' &&
        document.documentElement.classList.contains('light'));
    const palette = isLight ? PALETTE_LIGHT : PALETTE_DARK;

    if (mode === 'circuits') {
      pingsRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: 65 + Math.random() * 25,
        alpha: 0.85,
        color: palette.cyan,
        rings: 2,
      });

      // Spawn dynamic high-energy temporary nodes
      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.2;
        nodesRef.current.push({
          x: x + (Math.random() - 0.5) * 14,
          y: y + (Math.random() - 0.5) * 14,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2.2,
          baseRadius: 2.2,
          color: palette.cyan,
          glowColor: palette.cyan,
          pulsePhase: 0,
          pulseSpeed: 0.05,
          isTemporary: true,
          life: 0,
          maxLife: 180,
        });
      }
    } else if (mode === 'radar') {
      pingsRef.current.push({
        x,
        y,
        radius: 6,
        maxRadius: 110 + Math.random() * 40,
        alpha: 0.95,
        color: palette.emerald,
        rings: 3,
      });
    } else if (mode === 'sky') {
      // Shooting star meteor streak radiating from tap
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.8;
      const speed = 7 + Math.random() * 6;
      meteorsRef.current.push({
        startX: x,
        startY: y,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 40 + Math.random() * 50,
        alpha: 1,
        life: 0,
        maxLife: 45,
        color: isLight ? 'rgba(37, 99, 235, ' : 'rgba(186, 230, 253, ',
      });

      // Star sparkle ripple
      pingsRef.current.push({
        x,
        y,
        radius: 3,
        maxRadius: 55,
        alpha: 0.8,
        color: palette.sky,
        rings: 1,
      });
    } else if (mode === 'aurora') {
      // Fluid quantum wave ripple
      pingsRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: 90 + Math.random() * 30,
        alpha: 0.85,
        color: palette.violet,
        rings: 2,
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const isLight =
      propIsLight ??
      (typeof document !== 'undefined' &&
        document.documentElement.classList.contains('light'));
    const palette = isLight ? PALETTE_LIGHT : PALETTE_DARK;

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = width < 768;

      // 1. Initialise Circuits Mode nodes
      const nodeCount = isMobile ? 24 : 44;
      nodesRef.current = [];
      const nodeColors: (keyof typeof PALETTE_DARK)[] = ['cyan', 'emerald', 'sky'];
      for (let i = 0; i < nodeCount; i++) {
        const col = nodeColors[Math.floor(Math.random() * nodeColors.length)];
        nodesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: 1.8 + Math.random() * 1.6,
          baseRadius: 1.8 + Math.random() * 1.6,
          color: palette[col],
          glowColor: palette[col],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }

      // 2. Initialise Sky Mode stars and constellations
      const starCount = isMobile ? 48 : 88;
      starsRef.current = [];
      const starColors = isLight
        ? ['rgba(37, 99, 235, ', 'rgba(2, 132, 199, ', 'rgba(124, 58, 237, ']
        : ['rgba(255, 255, 255, ', 'rgba(186, 230, 253, ', 'rgba(253, 230, 138, ', 'rgba(167, 139, 250, '];

      for (let i = 0; i < starCount; i++) {
        const col = starColors[Math.floor(Math.random() * starColors.length)];
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          radius: 1.2 + Math.random() * 1.6,
          baseRadius: 1.2 + Math.random() * 1.6,
          color: col,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.02 + Math.random() * 0.04,
          clusterId: Math.floor(Math.random() * 5),
        });
      }

      // 3. Initialise Aurora Wave harmonics (Pure visual wave ribbons, zero words)
      auroraWavesRef.current = [
        {
          baseY: height * 0.25,
          amplitude: isMobile ? 35 : 55,
          frequency: 0.002,
          speed: 0.015,
          phase: 0,
          color: isLight ? 'rgba(2, 132, 199, ' : 'rgba(6, 182, 212, ',
          lineWidth: isMobile ? 1.5 : 2,
        },
        {
          baseY: height * 0.45,
          amplitude: isMobile ? 45 : 75,
          frequency: 0.0016,
          speed: 0.012,
          phase: 1.8,
          color: isLight ? 'rgba(124, 58, 237, ' : 'rgba(139, 92, 246, ',
          lineWidth: isMobile ? 1.8 : 2.4,
        },
        {
          baseY: height * 0.65,
          amplitude: isMobile ? 40 : 65,
          frequency: 0.0022,
          speed: 0.018,
          phase: 3.4,
          color: isLight ? 'rgba(5, 150, 105, ' : 'rgba(16, 185, 129, ',
          lineWidth: isMobile ? 1.5 : 2,
        },
        {
          baseY: height * 0.82,
          amplitude: isMobile ? 30 : 50,
          frequency: 0.0018,
          speed: 0.01,
          phase: 5.1,
          color: isLight ? 'rgba(37, 99, 235, ' : 'rgba(56, 189, 248, ',
          lineWidth: isMobile ? 1.2 : 1.8,
        },
      ];
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Cross-device pointer events (Mouse, Pen, Touch)
    const onPointerDown = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
      pointerRef.current.lastMove = performance.now();
      spawnInteractionFX(e.clientX, e.clientY);
      playPopSound();
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
      pointerRef.current.lastMove = performance.now();
    };

    const onPointerUp = () => {
      pointerRef.current.active = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        pointerRef.current.x = t.clientX;
        pointerRef.current.y = t.clientY;
        pointerRef.current.active = true;
        pointerRef.current.lastMove = performance.now();
        spawnInteractionFX(t.clientX, t.clientY);
        playPopSound();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        pointerRef.current.x = t.clientX;
        pointerRef.current.y = t.clientY;
        pointerRef.current.active = true;
        pointerRef.current.lastMove = performance.now();
      }
    };

    const onTouchEnd = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    let lastAmbientTime = performance.now();

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      timeRef.current += 0.02;

      const pointer = pointerRef.current;
      const now = performance.now();
      if (now - pointer.lastMove > 2500) {
        pointer.active = false;
      }

      const activeIsLight =
        propIsLight ??
        (typeof document !== 'undefined' &&
          document.documentElement.classList.contains('light'));
      const activePalette = activeIsLight ? PALETTE_LIGHT : PALETTE_DARK;

      // ==========================================
      // MODE 1: CYBERNETIC CIRCUITS & NEURAL MESH
      // ==========================================
      if (mode === 'circuits') {
        const nodes = nodesRef.current;
        const connectDist = width < 768 ? 95 : 125;
        const connectDistSq = connectDist * connectDist;

        // 1. Update node physics
        for (let i = nodes.length - 1; i >= 0; i--) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 10) {
            n.x = 10;
            n.vx = Math.abs(n.vx);
          } else if (n.x > width - 10) {
            n.x = width - 10;
            n.vx = -Math.abs(n.vx);
          }
          if (n.y < 10) {
            n.y = 10;
            n.vy = Math.abs(n.vy);
          } else if (n.y > height - 10) {
            n.y = height - 10;
            n.vy = -Math.abs(n.vy);
          }

          if (pointer.active) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 130 && dist > 1) {
              const pull = (1 - dist / 130) * 0.45;
              n.vx += (dx / dist) * pull;
              n.vy += (dy / dist) * pull;
            }
          }

          n.vx *= 0.985;
          n.vy *= 0.985;

          n.pulsePhase += n.pulseSpeed;
          const pulse = Math.sin(n.pulsePhase) * 0.4;
          n.radius = Math.max(1, n.baseRadius + pulse);

          if (n.isTemporary && n.life !== undefined && n.maxLife !== undefined) {
            n.life++;
            if (n.life >= n.maxLife) {
              nodes.splice(i, 1);
              continue;
            }
          }
        }

        // 2. Draw circuit traces
        ctx.lineWidth = activeIsLight ? 1 : 0.8;
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connectDistSq) {
              const dist = Math.sqrt(distSq);
              const alpha = (1 - dist / connectDist) * (activeIsLight ? 0.35 : 0.28);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `${a.color}${alpha})`;
              ctx.stroke();

              // Spawn data packets
              if (
                packetsRef.current.length < 8 &&
                Math.random() < 0.0006
              ) {
                packetsRef.current.push({
                  nodeAIndex: i,
                  nodeBIndex: j,
                  progress: 0,
                  speed: 0.02 + Math.random() * 0.03,
                  color: a.color,
                });
              }
            }
          }
        }

        // 3. Update & draw data packets
        for (let p = packetsRef.current.length - 1; p >= 0; p--) {
          const pkt = packetsRef.current[p];
          pkt.progress += pkt.speed;

          if (pkt.progress >= 1 || !nodes[pkt.nodeAIndex] || !nodes[pkt.nodeBIndex]) {
            packetsRef.current.splice(p, 1);
            continue;
          }

          const nA = nodes[pkt.nodeAIndex];
          const nB = nodes[pkt.nodeBIndex];
          const px = nA.x + (nB.x - nA.x) * pkt.progress;
          const py = nA.y + (nB.y - nA.y) * pkt.progress;

          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = `${pkt.color}0.95)`;
          ctx.fill();
        }

        // 4. Draw circuit nodes
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${n.color}0.85)`;
          ctx.fill();
        }
      }

      // ==========================================
      // MODE 2: TACTICAL RADAR SWEEP (ZERO WORDS!)
      // ==========================================
      else if (mode === 'radar') {
        const radarCenterX = width * 0.5;
        const radarCenterY = height * 0.5;
        const maxRadarR = Math.hypot(width, height) * 0.55;

        radarAngleRef.current = (radarAngleRef.current + 0.016) % (Math.PI * 2);
        const sweepAngle = radarAngleRef.current;

        // Concentric distance rings
        ctx.lineWidth = 1;
        for (let r = 80; r < maxRadarR; r += 120) {
          ctx.beginPath();
          ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
          ctx.strokeStyle = activeIsLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(6, 182, 212, 0.09)';
          ctx.stroke();
        }

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(radarCenterX, 0);
        ctx.lineTo(radarCenterX, height);
        ctx.moveTo(0, radarCenterY);
        ctx.lineTo(width, radarCenterY);
        ctx.strokeStyle = activeIsLight ? 'rgba(2, 132, 199, 0.14)' : 'rgba(6, 182, 212, 0.10)';
        ctx.stroke();

        // Sweeping beam wedge
        const gradient = ctx.createRadialGradient(
          radarCenterX,
          radarCenterY,
          10,
          radarCenterX,
          radarCenterY,
          maxRadarR
        );
        gradient.addColorStop(0, activeIsLight ? 'rgba(5, 150, 105, 0.15)' : 'rgba(16, 185, 129, 0.22)');
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(radarCenterX, radarCenterY);
        ctx.arc(radarCenterX, radarCenterY, maxRadarR, sweepAngle - 0.45, sweepAngle);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Sweeping radar front line
        ctx.beginPath();
        ctx.moveTo(radarCenterX, radarCenterY);
        ctx.lineTo(
          radarCenterX + Math.cos(sweepAngle) * maxRadarR,
          radarCenterY + Math.sin(sweepAngle) * maxRadarR
        );
        ctx.strokeStyle = activeIsLight ? 'rgba(5, 150, 105, 0.45)' : 'rgba(16, 185, 129, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Target blips on sweep (Clean geometric blips with rings - NO text/words)
        const nodes = nodesRef.current;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const angleToNode = Math.atan2(n.y - radarCenterY, n.x - radarCenterX);
          let diff = sweepAngle - angleToNode;
          while (diff < 0) diff += Math.PI * 2;
          while (diff >= Math.PI * 2) diff -= Math.PI * 2;

          const blipAlpha = diff < 0.6 ? Math.max(0.2, 1 - diff / 0.6) : 0.18;

          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.8, 0, Math.PI * 2);
          ctx.fillStyle = activeIsLight
            ? `rgba(5, 150, 105, ${blipAlpha * 0.9})`
            : `rgba(16, 185, 129, ${blipAlpha})`;
          ctx.fill();

          if (diff < 0.28) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
            ctx.strokeStyle = activeIsLight
              ? `rgba(2, 132, 199, ${blipAlpha * 0.85})`
              : `rgba(6, 182, 212, ${blipAlpha * 0.85})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // ==========================================
      // MODE 3: DEEP SKY & CONSTELLATION PARTICLES
      // ==========================================
      else if (mode === 'sky') {
        const stars = starsRef.current;
        const maxDist = width < 768 ? 85 : 110;
        const maxDistSq = maxDist * maxDist;

        // Occasional natural shooting star
        if (now - lastAmbientTime > 3800) {
          lastAmbientTime = now;
          if (Math.random() < 0.65) {
            const startX = Math.random() * width * 0.8;
            const startY = Math.random() * height * 0.35;
            const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
            const speed = 8 + Math.random() * 6;
            meteorsRef.current.push({
              startX,
              startY,
              x: startX,
              y: startY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              len: 50 + Math.random() * 60,
              alpha: 0.95,
              life: 0,
              maxLife: 40,
              color: activeIsLight ? 'rgba(37, 99, 235, ' : 'rgba(186, 230, 253, ',
            });
          }
        }

        // 1. Constellation links between close cluster stars
        ctx.lineWidth = activeIsLight ? 0.9 : 0.75;
        for (let i = 0; i < stars.length; i++) {
          const a = stars[i];
          for (let j = i + 1; j < stars.length; j++) {
            const b = stars[j];
            if (a.clusterId === b.clusterId) {
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const distSq = dx * dx + dy * dy;

              if (distSq < maxDistSq) {
                const dist = Math.sqrt(distSq);
                const lineAlpha = (1 - dist / maxDist) * (activeIsLight ? 0.28 : 0.22);
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = activeIsLight
                  ? `rgba(37, 99, 235, ${lineAlpha})`
                  : `rgba(147, 197, 253, ${lineAlpha})`;
                ctx.stroke();
              }
            }
          }
        }

        // 2. Render stars with delicate twinkling
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.x += s.vx;
          s.y += s.vy;

          if (s.x < 0) s.x = width;
          else if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          else if (s.y > height) s.y = 0;

          s.twinklePhase += s.twinkleSpeed;
          const twinkle = 0.5 + Math.sin(s.twinklePhase) * 0.45;
          const currentR = s.baseRadius * (0.8 + twinkle * 0.4);

          ctx.beginPath();
          ctx.arc(s.x, s.y, currentR, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color}${twinkle * (activeIsLight ? 0.85 : 0.95)})`;
          ctx.fill();

          // Star cross spikes
          if (s.baseRadius > 2.0 && twinkle > 0.75) {
            const spikeLen = currentR * 2.2;
            ctx.beginPath();
            ctx.moveTo(s.x - spikeLen, s.y);
            ctx.lineTo(s.x + spikeLen, s.y);
            ctx.moveTo(s.x, s.y - spikeLen);
            ctx.lineTo(s.x, s.y + spikeLen);
            ctx.strokeStyle = `${s.color}${twinkle * 0.4})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // 3. Render meteor trails
        for (let m = meteorsRef.current.length - 1; m >= 0; m--) {
          const met = meteorsRef.current[m];
          met.x += met.vx;
          met.y += met.vy;
          met.life++;

          const progress = met.life / met.maxLife;
          met.alpha = (1 - progress) * 0.95;

          if (met.life >= met.maxLife) {
            meteorsRef.current.splice(m, 1);
            continue;
          }

          const tailX = met.x - (met.vx / Math.hypot(met.vx, met.vy)) * met.len;
          const tailY = met.y - (met.vy / Math.hypot(met.vx, met.vy)) * met.len;

          const meteorGrad = ctx.createLinearGradient(tailX, tailY, met.x, met.y);
          meteorGrad.addColorStop(0, `${met.color}0)`);
          meteorGrad.addColorStop(1, `${met.color}${met.alpha})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(met.x, met.y);
          ctx.strokeStyle = meteorGrad;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Bright meteor head spark
          ctx.beginPath();
          ctx.arc(met.x, met.y, 2.4, 0, Math.PI * 2);
          ctx.fillStyle = activeIsLight ? '#1d4ed8' : '#ffffff';
          ctx.fill();
        }
      }

      // ==========================================
      // MODE 4: AURORA HARMONIC WAVES (100% NON-TEXT)
      // ==========================================
      else if (mode === 'aurora') {
        const waves = auroraWavesRef.current;
        const t = timeRef.current;

        for (let w = 0; w < waves.length; w++) {
          const wave = waves[w];
          wave.phase += wave.speed;

          ctx.beginPath();
          ctx.lineWidth = wave.lineWidth;

          const step = width < 768 ? 16 : 10;
          for (let x = 0; x <= width + step; x += step) {
            // Harmonic sine calculation with secondary ripple
            const baseSin = Math.sin(x * wave.frequency + wave.phase + w);
            const harmonic = Math.sin(x * wave.frequency * 2.1 - wave.phase * 0.7) * 0.35;
            
            // Pointer gravity deflection on the waves
            let pointerDeflect = 0;
            if (pointer.active) {
              const dx = x - pointer.x;
              const pDist = Math.abs(dx);
              if (pDist < 200) {
                const pFactor = Math.cos((pDist / 200) * (Math.PI / 2));
                pointerDeflect = (pointer.y - wave.baseY) * 0.4 * pFactor;
              }
            }

            const y = wave.baseY + (baseSin + harmonic) * wave.amplitude + pointerDeflect;

            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          // Subtle gradient opacity along the wave
          const waveAlpha = activeIsLight ? 0.28 : 0.38;
          ctx.strokeStyle = `${wave.color}${waveAlpha})`;
          ctx.stroke();

          // Glow halo under the primary wave
          if (w === 1 || w === 2) {
            ctx.save();
            ctx.lineWidth = wave.lineWidth * 2.8;
            ctx.strokeStyle = `${wave.color}${waveAlpha * 0.25})`;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Drifting quantum spark particles along the ribbons
        const nodes = nodesRef.current;
        for (let i = 0; i < Math.min(nodes.length, 18); i++) {
          const n = nodes[i];
          n.x = (n.x + 0.35) % width;
          const waveIdx = i % waves.length;
          const assignedWave = waves[waveIdx];
          const calculatedY =
            assignedWave.baseY +
            Math.sin(n.x * assignedWave.frequency + assignedWave.phase + waveIdx) *
              assignedWave.amplitude;

          ctx.beginPath();
          ctx.arc(n.x, calculatedY, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = activeIsLight
            ? `${assignedWave.color}0.75)`
            : `${assignedWave.color}0.95)`;
          ctx.fill();
        }
      }

      // ==========================================
      // SHARED TACTICAL PINGS & SHOCKWAVES
      // ==========================================
      for (let pIdx = pingsRef.current.length - 1; pIdx >= 0; pIdx--) {
        const ping = pingsRef.current[pIdx];
        ping.radius += 2.2;
        const ratio = ping.radius / ping.maxRadius;
        ping.alpha = Math.max(0, (1 - ratio) * 0.85);

        if (ping.radius >= ping.maxRadius) {
          pingsRef.current.splice(pIdx, 1);
          continue;
        }

        // Concentric shockwave ring
        ctx.beginPath();
        ctx.arc(ping.x, ping.y, ping.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${ping.color}${ping.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Crosshairs ticks
        const tickLen = 5;
        ctx.beginPath();
        ctx.moveTo(ping.x - ping.radius - tickLen, ping.y);
        ctx.lineTo(ping.x - ping.radius + tickLen, ping.y);
        ctx.moveTo(ping.x + ping.radius - tickLen, ping.y);
        ctx.lineTo(ping.x + ping.radius + tickLen, ping.y);
        ctx.moveTo(ping.x, ping.y - ping.radius - tickLen);
        ctx.lineTo(ping.x, ping.y - ping.radius + tickLen);
        ctx.moveTo(ping.x, ping.y + ping.radius - tickLen);
        ctx.lineTo(ping.x, ping.y + ping.radius + tickLen);
        ctx.strokeStyle = `${ping.color}${ping.alpha * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [mode, propIsLight]);

  const isLight =
    propIsLight ??
    (typeof document !== 'undefined' &&
      document.documentElement.classList.contains('light'));

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ mixBlendMode: isLight ? 'multiply' : 'screen' }}
      aria-hidden="true"
    />
  );
};
