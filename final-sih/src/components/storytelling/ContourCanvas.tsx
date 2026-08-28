import React, { useEffect, useRef } from 'react';

interface ContourCanvasProps {
  className?: string;
  interactive?: boolean;
}

export const ContourCanvas: React.FC<ContourCanvasProps> = ({
  className = '',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let time = 0;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Topographic contour lines configuration in earth tones
    const lines = [
      { color: 'rgba(188, 108, 37, 0.12)', strokeWidth: 1.5, speed: 0.0008, freq: 0.003, amp: 45 },
      { color: 'rgba(197, 139, 57, 0.14)', strokeWidth: 1.2, speed: 0.0012, freq: 0.004, amp: 60 },
      { color: 'rgba(96, 108, 56, 0.10)', strokeWidth: 1.0, speed: 0.0006, freq: 0.0025, amp: 35 },
      { color: 'rgba(138, 112, 77, 0.16)', strokeWidth: 1.8, speed: 0.0010, freq: 0.0035, amp: 50 },
      { color: 'rgba(155, 34, 38, 0.08)', strokeWidth: 1.0, speed: 0.0015, freq: 0.005, amp: 40 },
    ];

    // Land data points / nodes
    const dataPoints = Array.from({ length: 22 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2 + Math.random() * 3,
      alpha: 0.2 + Math.random() * 0.5,
      speed: 0.2 + Math.random() * 0.4,
      angle: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      // Draw undulating topographic contour elevation bands
      const numBands = 9;
      for (let b = 0; b < numBands; b++) {
        const line = lines[b % lines.length];
        ctx.beginPath();
        const baseOffset = (height / (numBands + 1)) * (b + 1);

        for (let x = 0; x <= width; x += 15) {
          // Calculate wave height influenced by time & mouse cursor
          const distToMouse = Math.hypot(x - mouseX, baseOffset - mouseY);
          const mouseInfluence = Math.max(0, 1 - distToMouse / 350) * 35;

          const wave =
            Math.sin(x * line.freq + time * line.speed + b) * line.amp +
            Math.cos(x * 0.0015 - time * 0.0005) * 20 -
            mouseInfluence;

          const y = baseOffset + wave;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.strokeWidth;
        ctx.stroke();
      }

      // Draw subtle moving survey points & parcel connection vectors
      dataPoints.forEach((p, idx) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(188, 108, 37, ${p.alpha * 0.6})`;
        ctx.fill();

        // Connect nearby points to form simulated cadastral polygons
        for (let j = idx + 1; j < dataPoints.length; j++) {
          const p2 = dataPoints[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(138, 112, 77, ${(1 - dist / 140) * 0.12})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};
