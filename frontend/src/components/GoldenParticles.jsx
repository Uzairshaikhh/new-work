import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 28;

const rand = (min, max) => Math.random() * (max - min) + min;

const GoldenParticles = () => {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      r: rand(0.4, 1.8),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.35, -0.1),
      alpha: rand(0.1, 0.55),
      da: rand(-0.003, 0.003),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.da;
        if (p.alpha < 0.05 || p.alpha > 0.55) p.da *= -1;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = rand(0, canvas.width); }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "#d4af37";
        ctx.shadowColor = "#d4af37";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      frameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
};

export default GoldenParticles;
