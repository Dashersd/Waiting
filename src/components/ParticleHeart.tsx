import { useEffect, useRef } from 'react';
import './ParticleHeart.css';

interface Particle {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  speed: number;
  delay: number;
  progress: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
  isAtmospheric: boolean;
  driftFactor: number;
  vx?: number;
  vy?: number;
}

const ParticleHeart = ({ visible, isDispersing, onDispersed }: { visible: boolean; isDispersing?: boolean; onDispersed?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const isDispersingRef = useRef(isDispersing);
  const disperseTriggeredRef = useRef(false);
  const dispersedTimeoutRef = useRef<number>(0);

  useEffect(() => {
    isDispersingRef.current = isDispersing;
  }, [isDispersing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize by disabling alpha background if not needed, but we need motion blur, so we keep alpha: false is actually for opaque canvas. Let's stick to default or alpha:false and fill black.
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Handle high DPI displays
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2 for performance
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      if (visible) initParticles(); // Re-init on resize to fit
    };

    window.addEventListener('resize', handleResize);

    // Easing function: easeOutQuart (smooth deceleration)
    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    const initParticles = () => {
      particlesRef.current = [];
      const scaleX = Math.min(width, height) / 4.5; 
      const scaleY = -Math.min(width, height) / 4.5; 
      const centerX = width / 2;
      const centerY = height / 2 - height * 0.05; 

      // Red and Black palette: ONLY pure reds (G and B must be 0) to prevent additive blending from turning white
      const colors = ['#ff0000', '#e60000', '#cc0000', '#b30000', '#990000', '#800000', '#660000'];

      // Text Preparation
      const text = "Hello et";
      const fontSize = Math.max(Math.min(width, height) * 0.12, 45);
      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      const textPixels: {x: number, y: number}[] = [];
      
      if (offCtx) {
          offCtx.font = `bold ${fontSize}px sans-serif`;
          const textWidth = offCtx.measureText(text).width;
          offCanvas.width = textWidth + 20;
          offCanvas.height = fontSize * 2;
          
          // Re-set font after resize
          offCtx.font = `bold ${fontSize}px sans-serif`;
          offCtx.fillStyle = 'white';
          offCtx.textAlign = 'center';
          offCtx.textBaseline = 'middle';
          offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);
          
          const textData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;
          
          for (let y = 0; y < offCanvas.height; y += 3) {
              for (let x = 0; x < offCanvas.width; x += 3) {
                  const alpha = textData[(y * offCanvas.width + x) * 4 + 3];
                  if (alpha > 128) {
                      textPixels.push({
                          x: x - offCanvas.width / 2,
                          y: y - offCanvas.height / 2
                      });
                  }
              }
          }
      }

      const HEART_PARTICLES = 3000;
      const ATMOSPHERIC_PARTICLES = 600;
      const TOTAL_PARTICLES = HEART_PARTICLES + ATMOSPHERIC_PARTICLES + textPixels.length;

      let created = 0;
      const textCenterY = centerY + Math.min(width, height) / 2.7;
      
      while (created < TOTAL_PARTICLES) {
        let isAtmospheric = false;
        let isText = false;
        let targetX = 0, targetY = 0;

        if (created < ATMOSPHERIC_PARTICLES) {
            isAtmospheric = true;
            targetX = Math.random() * width;
            targetY = Math.random() * height;
        } else if (created < ATMOSPHERIC_PARTICLES + textPixels.length) {
            isText = true;
            const pixel = textPixels[created - ATMOSPHERIC_PARTICLES];
            targetX = centerX + pixel.x;
            targetY = textCenterY + pixel.y;
        } else {
            // Rejection sampling for filled heart
            let valid = false;
            while (!valid) {
                const hx = (Math.random() - 0.5) * 2.5; 
                const hy = (Math.random() - 0.5) * 2.5; 
                const equation = Math.pow(hx * hx + hy * hy - 1, 3) - (hx * hx) * Math.pow(hy, 3);
                
                if (equation < 0) {
                    targetX = centerX + hx * scaleX;
                    targetY = centerY + hy * scaleY;
                    valid = true;
                }
            }
        }
          
        // Start positions scattered around edges and occasionally center
        let startX = Math.random() * width;
        let startY = Math.random() * height;
        
        if (Math.random() > 0.3) { // 70% start from way outside
            if (Math.random() > 0.5) {
                startX = Math.random() > 0.5 ? -100 : width + 100;
                startY = Math.random() * height;
            } else {
                startX = Math.random() * width;
                startY = Math.random() > 0.5 ? -100 : height + 100;
            }
        }

        particlesRef.current.push({
            x: startX,
            y: startY,
            startX,
            startY,
            targetX: targetX,
            targetY: targetY,
            size: Math.random() > 0.95 ? Math.random() * 2 + 1 : Math.random() * 1.5 + 0.5, 
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 0.005 + 0.003, 
            delay: Math.random() * 60, // Delay frames
            progress: 0,
            noiseOffsetX: Math.random() * 1000,
            noiseOffsetY: Math.random() * 1000,
            isAtmospheric,
            driftFactor: isAtmospheric ? Math.random() * 10 + 5 : (isText ? Math.random() * 0.5 + 0.1 : Math.random() * 2 + 0.5),
        });
        created++;
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear with slight trailing effect for motion blur
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(5, 5, 5, 0.4)'; // Slightly more opaque to reduce overdraw accumulation lag
      ctx.fillRect(0, 0, width, height);

      // Add additive blending for glowing cosmic effect
      ctx.globalCompositeOperation = 'lighter';
      
      // Global breathing/pulsing scale
      timeRef.current += 0.02; // Slightly faster for smoother math over time
      const heartbeatScale = 1 + Math.sin(timeRef.current * 2) * 0.01 + Math.sin(timeRef.current * 4) * 0.005;
      
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(heartbeatScale, heartbeatScale);
      ctx.translate(-width / 2, -height / 2);

      // Draw subtle red nebula glow behind the heart
      const gradient = ctx.createRadialGradient(width/2, height/2 - height*0.05, 0, width/2, height/2 - height*0.05, Math.min(width, height) / 3);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.15)'); // Deep red core
      gradient.addColorStop(0.5, 'rgba(200, 0, 0, 0.05)'); // Outer red
      gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
      
      ctx.fillStyle = gradient;
      // Using fillRect instead of arc for the background gradient is faster
      ctx.fillRect(width/2 - Math.min(width, height) / 2, height/2 - height*0.05 - Math.min(width, height) / 2, Math.min(width, height), Math.min(width, height));

      // Optimize particle loop
      const pCount = particlesRef.current.length;
      for (let i = 0; i < pCount; i++) {
        const p = particlesRef.current[i];

        if (p.delay > 0) {
          p.delay--;
        } else {
          if (disperseTriggeredRef.current) {
            // Scatter physics
            p.x += p.vx!;
            p.y += p.vy!;
          } else {
            if (p.progress < 1) {
              p.progress += p.speed;
              if (p.progress >= 1) p.progress = 1;
            }
            
            const ease = easeOutQuart(p.progress);
            
            let currentX = p.startX + (p.targetX - p.startX) * ease;
            let currentY = p.startY + (p.targetY - p.startY) * ease;
            
            // Organic drifting motion
            if (p.progress > 0) {
               const noiseX = Math.sin(timeRef.current + p.noiseOffsetX) * p.driftFactor * p.progress;
               const noiseY = Math.cos(timeRef.current + p.noiseOffsetY) * p.driftFactor * p.progress;
               currentX += noiseX;
               currentY += noiseY;
               
               // Atmospheric particles slowly drift globally
               if (p.isAtmospheric && p.progress === 1) {
                   p.targetX += Math.sin(timeRef.current * 0.5 + p.noiseOffsetX) * 0.5;
                   p.targetY -= 0.5; // Slowly float up
                   
                   // Wrap around
                   if (p.targetY < -50) p.targetY = height + 50;
               }
            }

            p.x = currentX;
            p.y = currentY;
          }
        }

        ctx.fillStyle = p.color;
        // Optimization: Removing shadowBlur (extreme performance killer).
        // Optimization: Using fillRect instead of arc (much faster for thousands of particles).
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
      }
      
      ctx.restore();

      if (isDispersingRef.current && !disperseTriggeredRef.current) {
        disperseTriggeredRef.current = true;
        particlesRef.current.forEach(p => {
           const angle = Math.atan2(p.y - height/2, p.x - width/2) + (Math.random() - 0.5) * 0.5;
           const speed = Math.random() * 25 + 10;
           p.vx = Math.cos(angle) * speed;
           p.vy = Math.sin(angle) * speed;
        });
        
        if (onDispersed) {
          dispersedTimeoutRef.current = setTimeout(() => {
            onDispersed();
          }, 1500); // Wait 1.5s for particles to clear before triggering callback
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (visible) {
      initParticles();
      animate();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (dispersedTimeoutRef.current) clearTimeout(dispersedTimeoutRef.current);
    };
  }, [visible, onDispersed]);

  return (
    <div className={`particle-heart-container ${visible ? 'visible' : ''} ${isDispersing ? 'dispersing' : ''}`}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ParticleHeart;
