import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type AtmosphereMode = 'bubbles' | 'sky' | 'water';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius?: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  glowColor: string;
  wobbleSpeed: number;
  wobbleOffset: number;
  wobbleAmplitude: number;
  life: number;
  maxLife: number;
  type: 'bubble' | 'star' | 'raindrop' | 'ripple' | 'spark';
  sparkle?: number;
  shootingAngle?: number;
}

interface InteractiveAtmosphereProps {
  mode: AtmosphereMode;
  onModeChange?: (mode: AtmosphereMode) => void;
}

// Synthesize pleasant, organic bubble pop / water drop chime using Web Audio API
class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled && !this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended' && enabled) {
      this.ctx.resume();
    }
  }

  public isEnabled() {
    return this.enabled;
  }

  public playBubblePop() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch sweep mimicking water bubble detachment / surface pop
      const startFreq = 480 + Math.random() * 320;
      const endFreq = startFreq + 280 + Math.random() * 150;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio autoplay policy catch
    }
  }

  public playWaterDrop() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 800 + Math.random() * 400;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.05);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Audio autoplay policy catch
    }
  }
}

const audioSynth = new AudioSynthesizer();

const PALETTE = {
  cyan: 'rgba(6, 182, 212, ',
  emerald: 'rgba(16, 185, 129, ',
  violet: 'rgba(139, 92, 246, ',
  sky: 'rgba(56, 189, 248, ',
  pink: 'rgba(244, 63, 94, ',
  amber: 'rgba(245, 158, 11, ',
};

export const InteractiveAtmosphere: React.FC<InteractiveAtmosphereProps> = ({
  mode,
  onModeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Particle[]>([]);
  const ambientSpawnerRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number; active: boolean; lastSpawn: number }>({
    x: -1000,
    y: -1000,
    active: false,
    lastSpawn: 0,
  });

  const [popCount, setPopCount] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [controlsExpanded, setControlsExpanded] = useState<boolean>(true);
  const [lastBurstTime, setLastBurstTime] = useState<number>(0);

  // Toggle synthesized audio
  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    audioSynth.setEnabled(next);
    if (next) {
      audioSynth.playBubblePop();
    }
  };

  // Helper to spawn water ripple on click/tap
  const spawnRipple = useCallback((x: number, y: number, colorType: 'cyan' | 'emerald' | 'violet' = 'cyan') => {
    ripplesRef.current.push({
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 4,
      maxRadius: 65 + Math.random() * 35,
      alpha: 0.8,
      maxAlpha: 0.8,
      color: PALETTE[colorType],
      glowColor: PALETTE[colorType],
      wobbleSpeed: 0,
      wobbleOffset: 0,
      wobbleAmplitude: 0,
      life: 0,
      maxLife: 60,
      type: 'ripple',
    });
  }, []);

  // Spawn bubbles with realistic upward physics, wobble, and specular glint
  const spawnBubbleBurst = useCallback((x: number, y: number, count = 10, isTap = true) => {
    const colors: (keyof typeof PALETTE)[] = ['cyan', 'sky', 'emerald', 'violet', 'pink', 'amber'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isTap ? 1.5 + Math.random() * 3.8 : 0.8 + Math.random() * 2;
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];
      const radius = isTap ? 8 + Math.random() * 22 : 5 + Math.random() * 14;

      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isTap ? 1.5 : 0.8), // Initial upward tendency
        radius,
        alpha: 0.85,
        maxAlpha: 0.85,
        color: PALETTE[chosenColor],
        glowColor: PALETTE[chosenColor],
        wobbleSpeed: 0.03 + Math.random() * 0.05,
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleAmplitude: 1.2 + Math.random() * 2.2,
        life: 0,
        maxLife: 140 + Math.random() * 160,
        type: 'bubble',
      });
    }

    // Spawn tiny glittering micro-sparks
    for (let j = 0; j < 6; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 3.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2,
        alpha: 1,
        maxAlpha: 1,
        color: PALETTE.sky,
        glowColor: PALETTE.cyan,
        wobbleSpeed: 0.1,
        wobbleOffset: 0,
        wobbleAmplitude: 0.5,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        type: 'spark',
      });
    }

    spawnRipple(x, y, 'cyan');
    setPopCount((prev) => prev + count);
    setLastBurstTime(Date.now());

    if (mode === 'water') {
      audioSynth.playWaterDrop();
    } else {
      audioSynth.playBubblePop();
    }
  }, [mode, spawnRipple]);

  // Spawn celestial shooting star
  const spawnShootingStar = useCallback((canvasWidth: number) => {
    const x = Math.random() * canvasWidth;
    const y = Math.random() * 200;
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // roughly 45 degrees
    const speed = 9 + Math.random() * 7;

    particlesRef.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 2.2 + Math.random() * 1.5,
      alpha: 1,
      maxAlpha: 1,
      color: 'rgba(255, 255, 255, ',
      glowColor: PALETTE.cyan,
      wobbleSpeed: 0,
      wobbleOffset: 0,
      wobbleAmplitude: 0,
      life: 0,
      maxLife: 50 + Math.random() * 30,
      type: 'spark',
      shootingAngle: angle,
    });
  }, []);

  // Global Pointer Events listener so clicking or touching anywhere on screen creates responsive FX
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // We spawn responsive bubbles & ripples at pointer location
      spawnBubbleBurst(e.clientX, e.clientY, mode === 'sky' ? 8 : 12, true);
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;

      const now = performance.now();
      // Throttle trail emissions to every 70ms so it flows lightly
      if (now - pointerRef.current.lastSpawn > 70) {
        pointerRef.current.lastSpawn = now;

        if (mode === 'bubbles') {
          // Micro bubble trail
          particlesRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -0.8 - Math.random() * 1.4,
            radius: 3 + Math.random() * 7,
            alpha: 0.65,
            maxAlpha: 0.65,
            color: PALETTE.cyan,
            glowColor: PALETTE.sky,
            wobbleSpeed: 0.05,
            wobbleOffset: Math.random() * Math.PI,
            wobbleAmplitude: 1,
            life: 0,
            maxLife: 60 + Math.random() * 40,
            type: 'bubble',
          });
        } else if (mode === 'sky') {
          // Stardust trail
          particlesRef.current.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: 1.5 + Math.random() * 2,
            alpha: 0.9,
            maxAlpha: 0.9,
            color: PALETTE.violet,
            glowColor: PALETTE.cyan,
            wobbleSpeed: 0,
            wobbleOffset: 0,
            wobbleAmplitude: 0,
            life: 0,
            maxLife: 45,
            type: 'spark',
          });
        } else if (mode === 'water') {
          // Water ripple trail
          if (Math.random() > 0.5) {
            spawnRipple(e.clientX, e.clientY, 'sky');
          }
        }
      }
    };

    const handlePointerUp = () => {
      pointerRef.current.active = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        for (let i = 0; i < e.touches.length; i++) {
          const t = e.touches[i];
          spawnBubbleBurst(t.clientX, t.clientY, mode === 'sky' ? 8 : 14, true);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        pointerRef.current.x = t.clientX;
        pointerRef.current.y = t.clientY;
        pointerRef.current.active = true;

        if (mode === 'bubbles' && Math.random() > 0.4) {
          particlesRef.current.push({
            x: t.clientX + (Math.random() - 0.5) * 8,
            y: t.clientY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -1 - Math.random() * 1.5,
            radius: 4 + Math.random() * 8,
            alpha: 0.7,
            maxAlpha: 0.7,
            color: PALETTE.cyan,
            glowColor: PALETTE.sky,
            wobbleSpeed: 0.05,
            wobbleOffset: Math.random() * Math.PI,
            wobbleAmplitude: 1,
            life: 0,
            maxLife: 60,
            type: 'bubble',
          });
        }
      }
    };

    const handleCustomBurst = (e: Event) => {
      const ce = e as CustomEvent<{ x?: number; y?: number; count?: number }>;
      const cx = ce.detail?.x ?? window.innerWidth / 2;
      const cy = ce.detail?.y ?? window.innerHeight / 3;
      const count = ce.detail?.count ?? 22;
      spawnBubbleBurst(cx, cy, count, true);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('burst-bubbles', handleCustomBurst as EventListener);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('burst-bubbles', handleCustomBurst as EventListener);
    };
  }, [mode, spawnBubbleBurst, spawnRipple]);

  // Main Canvas Render & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initial population of ambient particles
    particlesRef.current = [];
    ripplesRef.current = [];

    // Mode-specific initial populations
    if (mode === 'sky') {
      // 120 twinkling sky stars
      for (let i = 0; i < 110; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          radius: 0.8 + Math.random() * 2.2,
          alpha: 0.3 + Math.random() * 0.7,
          maxAlpha: 0.3 + Math.random() * 0.7,
          color: Math.random() > 0.3 ? 'rgba(255, 255, 255, ' : PALETTE.sky,
          glowColor: PALETTE.cyan,
          wobbleSpeed: 0.02 + Math.random() * 0.04,
          wobbleOffset: Math.random() * Math.PI * 2,
          wobbleAmplitude: 0.4,
          life: 0,
          maxLife: 100000,
          type: 'star',
          sparkle: Math.random() * Math.PI * 2,
        });
      }
    } else if (mode === 'bubbles') {
      // 35 Ambient rising bubbles
      for (let i = 0; i < 35; i++) {
        const colors: (keyof typeof PALETTE)[] = ['cyan', 'emerald', 'violet', 'sky'];
        const col = colors[Math.floor(Math.random() * colors.length)];
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.6 - Math.random() * 1.5,
          radius: 5 + Math.random() * 20,
          alpha: 0.45 + Math.random() * 0.4,
          maxAlpha: 0.8,
          color: PALETTE[col],
          glowColor: PALETTE[col],
          wobbleSpeed: 0.02 + Math.random() * 0.03,
          wobbleOffset: Math.random() * Math.PI * 2,
          wobbleAmplitude: 1.5 + Math.random() * 2.5,
          life: Math.random() * 200,
          maxLife: 300 + Math.random() * 200,
          type: 'bubble',
        });
      }
    } else if (mode === 'water') {
      // Ambient rain drops
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 6 + Math.random() * 8,
          radius: 1.5 + Math.random() * 1.5,
          alpha: 0.35 + Math.random() * 0.45,
          maxAlpha: 0.8,
          color: PALETTE.sky,
          glowColor: PALETTE.cyan,
          wobbleSpeed: 0,
          wobbleOffset: 0,
          wobbleAmplitude: 0,
          life: 0,
          maxLife: 200,
          type: 'raindrop',
        });
      }
    }

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;

      // Ambient automatic spawning based on current mode
      ambientSpawnerRef.current++;
      if (mode === 'bubbles' && ambientSpawnerRef.current % 18 === 0) {
        // Continuous upward bubble stream from bottom
        const colors: (keyof typeof PALETTE)[] = ['cyan', 'emerald', 'violet', 'sky'];
        const col = colors[Math.floor(Math.random() * colors.length)];
        particlesRef.current.push({
          x: Math.random() * width,
          y: height + 20,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -0.8 - Math.random() * 1.8,
          radius: 6 + Math.random() * 22,
          alpha: 0.5 + Math.random() * 0.35,
          maxAlpha: 0.85,
          color: PALETTE[col],
          glowColor: PALETTE[col],
          wobbleSpeed: 0.02 + Math.random() * 0.03,
          wobbleOffset: Math.random() * Math.PI * 2,
          wobbleAmplitude: 1.5 + Math.random() * 2.5,
          life: 0,
          maxLife: 350 + Math.random() * 200,
          type: 'bubble',
        });
      } else if (mode === 'water' && ambientSpawnerRef.current % 4 === 0) {
        // Raindrops from top
        particlesRef.current.push({
          x: Math.random() * width,
          y: -10,
          vx: (Math.random() - 0.5) * 0.3,
          vy: 7 + Math.random() * 7,
          radius: 1.2 + Math.random() * 1.4,
          alpha: 0.4 + Math.random() * 0.4,
          maxAlpha: 0.8,
          color: PALETTE.sky,
          glowColor: PALETTE.cyan,
          wobbleSpeed: 0,
          wobbleOffset: 0,
          wobbleAmplitude: 0,
          life: 0,
          maxLife: 200,
          type: 'raindrop',
        });
      } else if (mode === 'sky' && ambientSpawnerRef.current % 140 === 0) {
        // Random shooting star streak
        spawnShootingStar(width);
      }

      // Constellation lines in Sky mode
      if (mode === 'sky') {
        const stars = particlesRef.current.filter((p) => p.type === 'star');
        ctx.lineWidth = 0.5;
        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 90) {
              const alpha = (1 - dist / 90) * 0.16;
              ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(stars[i].x, stars[i].y);
              ctx.lineTo(stars[j].x, stars[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Render expanding ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const rip = ripplesRef.current[i];
        rip.life++;
        rip.radius += 1.8;
        rip.alpha = (1 - rip.life / rip.maxLife) * rip.maxAlpha;

        if (rip.life >= rip.maxLife) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        // Inner glowing ring
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${rip.color}${rip.alpha * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Secondary soft echo ripple ring
        if (rip.radius > 12) {
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, Math.max(0, rip.radius - 8), 0, Math.PI * 2);
          ctx.strokeStyle = `${rip.color}${rip.alpha * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Render and update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;

        if (p.type === 'bubble') {
          // Buoyant upward motion + horizontal sinusoidal wobble
          p.vy -= 0.015; // Buoyant acceleration
          p.vx *= 0.98;
          p.vy *= 0.985;
          p.x += p.vx + Math.sin(frameCount * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmplitude;
          p.y += p.vy;

          // Pointer interaction: bubbles gently push away from cursor/finger
          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 110 && dist > 0) {
              const force = (1 - dist / 110) * 3.5;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          // Fade out near end of life or if it reaches very top
          const lifeRatio = p.life / p.maxLife;
          const currentAlpha = Math.max(0, (1 - lifeRatio) * p.maxAlpha);

          if (p.y < -p.radius * 2 || p.life >= p.maxLife) {
            // Natural pop into micro splash
            particlesRef.current.splice(i, 1);
            continue;
          }

          // --- Draw Soap Bubble / Bioluminescent Orb ---
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

          // Translucent iridescent glass sphere fill
          const grad = ctx.createRadialGradient(
            p.x - p.radius * 0.3,
            p.y - p.radius * 0.3,
            p.radius * 0.1,
            p.x,
            p.y,
            p.radius
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha * 0.45})`);
          grad.addColorStop(0.4, `${p.color}${currentAlpha * 0.25})`);
          grad.addColorStop(0.85, `${p.glowColor}${currentAlpha * 0.4})`);
          grad.addColorStop(1, `${p.color}${currentAlpha * 0.85})`);

          ctx.fillStyle = grad;
          ctx.fill();

          // Delicate glowing perimeter rim
          ctx.lineWidth = Math.max(1, p.radius * 0.08);
          ctx.strokeStyle = `${p.glowColor}${currentAlpha * 0.9})`;
          ctx.stroke();

          // Realistic specular reflection arc / glint (top-left)
          if (p.radius > 5) {
            ctx.beginPath();
            ctx.arc(
              p.x - p.radius * 0.28,
              p.y - p.radius * 0.28,
              p.radius * 0.38,
              Math.PI * 1.15,
              Math.PI * 1.85
            );
            ctx.lineWidth = Math.max(1, p.radius * 0.12);
            ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha * 0.85})`;
            ctx.stroke();

            // Secondary tiny specular dot (bottom-right reflection)
            ctx.beginPath();
            ctx.arc(
              p.x + p.radius * 0.35,
              p.y + p.radius * 0.35,
              p.radius * 0.14,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.5})`;
            ctx.fill();
          }

          ctx.restore();
        } else if (p.type === 'star') {
          // Twinkling celestial star
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Twinkle pulse
          p.sparkle = (p.sparkle || 0) + 0.03;
          const twinkle = 0.5 + Math.sin(p.sparkle) * 0.5;
          const starAlpha = p.maxAlpha * (0.4 + twinkle * 0.6);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${starAlpha})`;
          ctx.fill();

          // Star glow halo on brighter stars
          if (p.radius > 1.8) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 2.4, 0, Math.PI * 2);
            ctx.fillStyle = `${p.glowColor}${starAlpha * 0.25})`;
            ctx.fill();
          }
        } else if (p.type === 'raindrop') {
          // Downward streaming cyber raindrop
          p.y += p.vy;
          p.x += p.vx;

          // Draw speed streak
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.8);
          ctx.strokeStyle = `${p.color}${p.alpha})`;
          ctx.lineWidth = p.radius;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Water impact on hitting floor
          if (p.y >= height - 20) {
            spawnRipple(p.x, height - 15, 'sky');
            particlesRef.current.splice(i, 1);
            continue;
          }
        } else if (p.type === 'spark') {
          // Burst spark / Shooting star trail
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;

          const lifeRatio = p.life / p.maxLife;
          const sparkAlpha = (1 - lifeRatio) * p.maxAlpha;

          if (p.life >= p.maxLife) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          if (p.shootingAngle !== undefined) {
            // Shooting star with trailing tail
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
            ctx.strokeStyle = `rgba(255, 255, 255, ${sparkAlpha})`;
            ctx.lineWidth = p.radius;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${sparkAlpha})`;
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode, spawnShootingStar, spawnRipple]);

  return (
    <>
      {/* Interactive FX Canvas Overlay (transparent, non-blocking click-through) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Floating Interactive Atmosphere Control Dock */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 font-mono text-xs select-none">
        <AnimatePresence>
          {controlsExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="p-3 rounded-2xl bg-[#0b101d]/90 backdrop-blur-xl border border-[#06b6d4]/40 shadow-2xl shadow-[#06b6d4]/15 flex flex-col gap-2.5 w-64 max-w-[90vw]"
            >
              {/* Header with Title & Audio Synth Toggle */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
                <div className="flex items-center gap-1.5 text-[#06b6d4] font-bold">
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    motion_photos_on
                  </span>
                  <span>ATMOSPHERE FX</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleToggleAudio}
                    className={`px-2 py-0.5 rounded-md border text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                      audioEnabled
                        ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]'
                        : 'bg-[#141d2f] border-[#1e293b] text-[#64748b] hover:text-[#94a3b8]'
                    }`}
                    title="Toggle synthesized bubble pop & water chimes"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {audioEnabled ? 'volume_up' : 'volume_off'}
                    </span>
                    <span>{audioEnabled ? 'SFX' : 'Mute'}</span>
                  </button>
                </div>
              </div>

              {/* Theme Mode Selector Buttons: Bubbles, Sky, Water Drops */}
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => onModeChange?.('bubbles')}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                    mode === 'bubbles'
                      ? 'bg-[#06b6d4]/20 border-[#06b6d4] text-[#06b6d4] shadow-md shadow-[#06b6d4]/20 font-bold'
                      : 'bg-[#141d2f]/70 border-[#1e293b] text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#141d2f]'
                  }`}
                >
                  <span className="text-base">🫧</span>
                  <span>Bubbles</span>
                </button>

                <button
                  type="button"
                  onClick={() => onModeChange?.('sky')}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                    mode === 'sky'
                      ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6] shadow-md shadow-[#8b5cf6]/20 font-bold'
                      : 'bg-[#141d2f]/70 border-[#1e293b] text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#141d2f]'
                  }`}
                >
                  <span className="text-base">🌌</span>
                  <span>Sky</span>
                </button>

                <button
                  type="button"
                  onClick={() => onModeChange?.('water')}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                    mode === 'water'
                      ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981] shadow-md shadow-[#10b981]/20 font-bold'
                      : 'bg-[#141d2f]/70 border-[#1e293b] text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#141d2f]'
                  }`}
                >
                  <span className="text-base">💧</span>
                  <span>Drops</span>
                </button>
              </div>

              {/* Touch Anywhere Instruction & Pop Counter */}
              <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between text-[10px] text-[#94a3b8]">
                <span className="flex items-center gap-1 text-[#38bdf8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
                  Tap screen anywhere!
                </span>
                <span className="text-[#64748b]">
                  Spawned: <strong className="text-[#f1f5f9]">{popCount}</strong>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Pill Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setControlsExpanded((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0b101d]/90 backdrop-blur-md border border-[#06b6d4]/50 text-[#06b6d4] shadow-xl hover:border-[#06b6d4] hover:shadow-[#06b6d4]/20 transition-all cursor-pointer"
        >
          <span className="text-sm">
            {mode === 'bubbles' ? '🫧' : mode === 'sky' ? '🌌' : '💧'}
          </span>
          <span className="font-bold text-xs capitalize">{mode} FX</span>
          <span className="material-symbols-outlined text-[14px]">
            {controlsExpanded ? 'expand_more' : 'tune'}
          </span>
        </motion.button>
      </div>
    </>
  );
};
