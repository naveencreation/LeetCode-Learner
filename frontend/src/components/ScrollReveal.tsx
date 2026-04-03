"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "scale-up";
  delay?: number;
}

export default function ScrollReveal({ children, className = "", animation = "fade-up", delay = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -100px 0px", threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const baseStyle = {
    transition: `opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: `${delay}ms`,
  };

  let animationStyle = {};
  if (!isVisible) {
    if (animation === "fade-up") animationStyle = { opacity: 0, transform: "translateY(40px)" };
    if (animation === "fade-in") animationStyle = { opacity: 0 };
    if (animation === "scale-up") animationStyle = { opacity: 0, transform: "scale(0.95)" };
  } else {
    if (animation === "fade-up") animationStyle = { opacity: 1, transform: "translateY(0)" };
    if (animation === "fade-in") animationStyle = { opacity: 1 };
    if (animation === "scale-up") animationStyle = { opacity: 1, transform: "scale(1)" };
  }

  return (
    <div ref={ref} className={className} style={{ ...baseStyle, ...animationStyle }}>
      {children}
    </div>
  );
}
