import React, { useEffect, useRef, memo } from 'react';

export type BgMode = 'oled' | 'mesh' | 'static';

interface Props {
  mode: BgMode;
  isDark: boolean;
}

export const LiveBackground: React.FC<Props> = memo(({ mode, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // We render canvas for both 'oled' and 'mesh', but distinct logic
    if (mode === 'static') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // High DPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const particles: any[] = [];
    const isMesh = mode === 'mesh';
    
    // COLORS
    // Mesh: Vibrant, pastel, moving blobs
    // OLED: Dark background, neon tracers
    
    const colors = isMesh 
      ? [
          '#60A5FA', // Blue
          '#C084FC', // Purple
          '#F472B6', // Pink
          '#34D399', // Emerald
          '#FBBF24'  // Amber
        ]
      : [
          'rgba(56, 189, 248, 0.5)', // Cyan
          'rgba(168, 85, 247, 0.5)', // Purple
          'rgba(236, 72, 153, 0.5)'  // Pink
        ];

    const particleCount = isMesh ? 6 : 15;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMesh ? 0.3 : 0.8),
        vy: (Math.random() - 0.5) * (isMesh ? 0.3 : 0.8),
        radius: isMesh ? (Math.random() * 300 + 300) : (Math.random() * 100 + 50),
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let animationId: number;

    const render = () => {
      // Clear with Theme Background
      // IMPORTANT: We use transparent or very slight color so it sits behind the blurred glass of the app
      ctx.clearRect(0, 0, width, height);
      
      if (mode === 'oled') {
        // OLED is dark by definition, but we want it to be a background layer
        ctx.fillStyle = '#050505'; // Deep black
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter'; // Neon effect
      } else {
        // Mesh background base
        ctx.fillStyle = isDark ? '#0a0a0a' : '#f2f2f7';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'blur(60px)'; // Soften the blobs significantly
      }

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < -p.radius) p.vx *= -1;
        if (p.x > width + p.radius) p.vx *= -1;
        if (p.y < -p.radius) p.vy *= -1;
        if (p.y > height + p.radius) p.vy *= -1;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        
        if (isMesh) {
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.globalAlpha = 0.6;
        } else {
          // OLED
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.globalAlpha = 0.4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.filter = 'none';
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode, isDark]);

  return (
    <canvas 
      id="live-canvas" 
      ref={canvasRef} 
      className={mode !== 'static' ? 'active' : ''} 
    />
  );
});