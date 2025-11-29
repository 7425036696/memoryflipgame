import React, { useEffect, useRef } from 'react';

export const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const colors = ['#f472b6', '#22d3ee', '#facc15', '#a78bfa', '#4ade80'];

    class Particle {
      x: number;
      y: number;
      dx: number;
      dy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = -10; // Start above screen
        this.dx = Math.random() * 6 - 3;
        this.dy = Math.random() * 3 + 2;
        this.size = Math.random() * 8 + 4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
      }

      update() {
        this.y += this.dy;
        this.x += this.dx;
        this.rotation += this.rotationSpeed;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    // Create initial burst
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    let animationId: number;
    let frame = 0;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add new particles periodically
      if (frame % 5 === 0 && particles.length < 300) {
        particles.push(new Particle());
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Remove off-screen particles
        if (particles[i].y > canvas.height) {
          particles.splice(i, 1);
          i--;
        }
      }

      frame++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
};

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  update: () => void;
  draw: () => void;
}
