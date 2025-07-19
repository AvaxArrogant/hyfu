
"use client";

import Image from 'next/image';
import { useEffect, type ReactNode, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function InteractiveWrapper({ children, showWallpaper = false }: { children: ReactNode, showWallpaper?: boolean }) {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const fogCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const particleCanvas = particleCanvasRef.current;
    if (!particleCanvas) return;
    const particleCtx = particleCanvas.getContext('2d');
    if (!particleCtx) return;
    
    const fogCanvas = fogCanvasRef.current;
    if (!fogCanvas) return;
    const fogCtx = fogCanvas.getContext('2d');
    if (!fogCtx) return;

    // Set loaded after a short delay to allow for initial render
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    let animationFrameId: number;
    let particles: Particle[] = [];
    let fogPatches: FogPatch[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      color: string;

      constructor(canvasWidth: number, canvasHeight: number, color: string) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = -(Math.random() * 0.5 + 0.2); // Move up
        this.color = color;
      }

      update(canvasHeight: number, canvasWidth: number) {
        this.y += this.speedY;
        if (this.y < -this.size) {
          this.y = canvasHeight + this.size;
          this.x = Math.random() * canvasWidth;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class FogPatch {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      speedX: number;
      speedY: number;
      
      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.radius = Math.random() * 400 + 200; // Large, soft patches
        this.opacity = Math.random() * 0.05 + 0.02; // Very subtle
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = (Math.random() - 0.5) * 0.15;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvasWidth + this.radius) this.x = -this.radius;
        if (this.x < -this.radius) this.x = canvasWidth + this.radius;
        if (this.y > canvasHeight + this.radius) this.y = -this.radius;
        if (this.y < -this.radius) this.y = canvasHeight + this.radius;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, `rgba(128, 128, 160, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(128, 128, 160, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const init = () => {
        if(!particleCanvas || !fogCanvas) return;

        // Init Particles
        particles = [];
        const particleCount = Math.floor((particleCanvas.width / 1920) * 200);
        const primaryHsl = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        const accentHsl = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        const backgroundGreenHsl = '170 60% 55%'; // A teal-ish green to match the background
        
        for (let i = 0; i < particleCount; i++) {
            const rand = Math.random();
            let colorHsl;
            if (rand > 0.8) {
              colorHsl = accentHsl;
            } else if (rand > 0.6) {
              colorHsl = backgroundGreenHsl;
            } else {
              colorHsl = primaryHsl;
            }
            const color = `hsl(${colorHsl} / ${Math.random() * 0.6 + 0.2})`;
            particles.push(new Particle(particleCanvas.width, particleCanvas.height, color));
        }

        // Init Fog
        fogPatches = [];
        const fogPatchCount = 20;
        for (let i = 0; i < fogPatchCount; i++) {
          fogPatches.push(new FogPatch(fogCanvas.width, fogCanvas.height));
        }
    };
    
    const resizeCanvases = () => {
        if(!particleCanvas || !fogCanvas) return;
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        fogCanvas.width = window.innerWidth;
        fogCanvas.height = window.innerHeight;
        init();
    };
    
    const animate = () => {
        if(!particleCtx || !particleCanvas || !fogCtx || !fogCanvas) return;
        
        // Animate particles
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        for (const particle of particles) {
            particle.update(particleCanvas.height, particleCanvas.width);
            particle.draw(particleCtx);
        }

        // Animate fog
        fogCtx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
        for (const patch of fogPatches) {
          patch.update(fogCanvas.width, fogCanvas.height);
          patch.draw(fogCtx);
        }

        animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
    animate();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeCanvases);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {showWallpaper && (
        <>
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in"
            style={{ 
              backgroundImage: "url('/images/a3.jpg')",
             opacity: isLoaded ? 0.8 : 0
            }}
            onLoad={() => console.log('Background image loaded')}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        </>
      )}
      <canvas ref={particleCanvasRef} className="absolute inset-0 z-[1] pointer-events-none" />
      <canvas 
        ref={fogCanvasRef} 
        className={cn(
          "absolute inset-0 z-[2] mix-blend-screen transition-opacity duration-1000 ease-in pointer-events-none",
          isLoaded ? "opacity-15" : "opacity-0"
        )} 
      />
      {children}
    </div>
  );
}
