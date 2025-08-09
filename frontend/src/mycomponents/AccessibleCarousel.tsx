import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

function AccessibleCarousel({ images = [], className = "" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef(null);

  const length = images?.length || 0;
  useEffect(() => {
    if (index >= length && length > 0) {
      setIndex(0);
    }
  }, [length, index]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        setIndex((i) => (length > 0 ? (i - 1 + length) % length : 0));
      } else if (e.key === "ArrowRight") {
        setIndex((i) => (length > 0 ? (i + 1) % length : 0));
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [length]);

  useEffect(() => {
    if (length <= 1) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const t = setInterval(() => {
      if (!paused) setIndex((i) => (length > 0 ? (i + 1) % length : 0));
    }, 4500);
    return () => clearInterval(t);
  }, [length, paused]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || length <= 1) return;
    let startX = 0;
    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        if (dx > 0) setIndex((i) => (i - 1 + length) % length);
        else setIndex((i) => (i + 1) % length);
      }
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [length]);

  const prev = () => {
    if (length <= 1) return;
    setIndex((i) => (i - 1 + length) % length);
  };
  const next = () => {
    if (length <= 1) return;
    setIndex((i) => (i + 1) % length);
  };

  if (length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Galeria de imagens"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ outlineOffset: 4 }}
    >
      <div className="relative overflow-hidden rounded-md" style={{ minHeight: 320 }}>
        {images.map((src, i) => {
          const offset = (i - index) * 100;
          return (
            <div
              key={i}
              className="absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(${offset}%)`,
                display: "block",
                willChange: "transform",
              }}
              aria-hidden={i === index ? false : true}
            >
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                loading={i === index ? "eager" : "lazy"}
                className="w-full h-80 object-contain bg-black/90 p-6"
                style={{ maxHeight: 320 }}
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Anterior"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-400/90 p-2 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Próximo"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-400/90 p-2 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para slide ${i + 1}`}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default AccessibleCarousel;
