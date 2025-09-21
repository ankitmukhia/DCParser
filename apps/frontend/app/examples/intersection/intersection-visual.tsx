"use client";

import React, { useEffect, useRef, useState } from "react";
import { useIntersection } from "react-use";

const margin = 90;

export function IntersectionVisualizer() {
  const ref = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  const intersection = useIntersection(ref, {
    root: null, // browser viewport
    rootargin: `-${margin}px`, // try changing this!
    threshold: 1, // 100% visible
  });

  const isVisible = intersection?.isIntersecting;

  useEffect(() => {
    // Store viewport height to size the overlays
    setViewportHeight(window.innerHeight);
    const resize = () => setViewportHeight(window.innerHeight);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      style={{ padding: "100vh 0", textAlign: "center", position: "relative" }}
    >
      <h1>Scroll down to observe</h1>

      {/* 🔷 Normal visible viewport outline */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: viewportHeight,
          border: "2px dashed blue",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      />

      {/* 🟥 RootMargin area (shrink or expand depending on sign) */}
      <div
        style={{
          position: "fixed",
          top: `${margin}px`,
          left: 0,
          width: "100%",
          height: `${viewportHeight - margin * 2}px`,
          border: "2px dashed red",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      />

      <div
        ref={ref}
        style={{
          height: "100px",
          background: "lightblue",
          margin: "100px auto",
          width: "200px",
        }}
      >
        Observed Box
      </div>

      <h2>
        Is in rootMargin zone?{" "}
        <span style={{ color: isVisible ? "green" : "red" }}>
          {isVisible ? "YES ✅" : "NO ❌"}
        </span>
      </h2>
    </div>
  );
}
