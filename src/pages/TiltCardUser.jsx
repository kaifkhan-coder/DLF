import React, { useRef, useState } from "react";

export default function TiltCard({
  children,
  className = "",
  maxTilt = 12,      // rotation strength
  scale = 1.04,      // hover scale
  glare = true,      // light shine effect
  perspective = 900, // perspective depth
}) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const px = x / r.width;   // 0..1
    const py = y / r.height;  // 0..1

    // rotate around center
    const rx = (py - 0.5) * -2 * maxTilt; // invert so top tilts back
    const ry = (px - 0.5) *  2 * maxTilt;

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0) scale(${scale})`,
    });

    if (glare) {
      setGlareStyle({
        opacity: 1,
        background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)`,
      });
    }
  };

  const onLeave = () => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
    });
    setGlareStyle({ opacity: 0 });
  };

  const onEnter = () => {
    // slight snap-in
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(${scale})`,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      className={`relative will-change-transform ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 180ms ease",
        ...style,
      }}
    >
      {/* Glare */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[24px]"
          style={{
            ...glareStyle,
            transition: "opacity 180ms ease",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Depth wrapper */}
      <div style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
