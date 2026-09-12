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

    // Skip the animation on mobile viewports and for users who asked for
    // reduced motion — it's purely decorative and per-frame canvas work is
    // one of the more expensive things we can do on a low-end phone CPU.
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || window.innerWidth < 768) return;

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

    // Pre-render the glow once into an offscreen sprite instead of paying for
    // ctx.shadowBlur on every particle, every frame (shadowBlur is very slow).
    const SPRITE_SIZE = 24;
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = SPRITE_SIZE;
    const sctx = sprite.getContext("2d");
    const grad = sctx.createRadialGradient(
      SPRITE_SIZE / 2, SPRITE_SIZE / 2, 0,
      SPRITE_SIZE / 2, SPRITE_SIZE / 2, SPRITE_SIZE / 2
    );
    grad.addColorStop(0, "rgba(212,175,55,1)");
    grad.addColorStop(0.4, "rgba(212,175,55,0.5)");
    grad.addColorStop(1, "rgba(212,175,55,0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

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

        const size = SPRITE_SIZE * (p.r / 1.2);
        ctx.globalAlpha = p.alpha;
        ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
      });
      ctx.globalAlpha = 1;
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
