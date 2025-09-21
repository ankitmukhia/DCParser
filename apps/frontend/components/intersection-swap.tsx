"use client";

import { useRef } from "react";
import { useIntersection } from "react-use";
import { cn } from "@/lib/utils";

export const IntersectionSwap = ({
  children,
  nav,
}: {
  children: React.ReactNode;
  nav: React.ReactNode;
}) => {
  const intersectionRef = useRef<any>(null);

  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "-55px",
  });

  let showPrimary = false;
  if (intersection && !intersection.isIntersecting) {
    showPrimary = true;
  }

  return (
    <>
      {showPrimary && (
        <div
          className={cn(
            "sticky top-6 z-30 -mx-px transition duration-75 will-change-transform",
          )}
        >
          {nav}
        </div>
      )}
      <div ref={intersectionRef}>
        <div
          className={cn("transition duration-150 will-change-transform", {
            "-translate-y-2 scale-[0.98] opacity-0": showPrimary,
            "opacity-100 delay-100": !showPrimary,
          })}
        >
          {children}
        </div>
      </div>
    </>
  );
};
