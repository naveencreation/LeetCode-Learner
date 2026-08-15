"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  variant?: "horizontal" | "stacked" | "icon";
  theme?: "auto" | "light" | "dark";
  color?: string;
}

/**
 * Think DSA official brand logo icon component.
 * Features the signature triangular arrow/tree mark.
 */
export function LogoIcon({
  size = 32,
  className,
  color = "#4F46E5",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Think DSA Logo Icon"
      className={cn("shrink-0 transition-transform hover:scale-105", className)}
    >
      <path
        d="M 50 8 
           L 92 82 
           L 64 82 
           L 50 56 
           L 36 82 
           L 8 82 
           Z 
           M 50 32 
           L 65 60 
           L 35 60 
           Z"
        fill={color}
        fillRule="evenodd"
      />
    </svg>
  );
}

/**
 * Main Think DSA logo component with optional text layout variants and theme contrast modes.
 */
export function Logo({
  size = 32,
  className,
  variant = "horizontal",
  theme = "auto",
  color,
}: LogoProps) {
  // Determine text color classes based on theme mode
  const thinkTextClass =
    theme === "dark"
      ? "text-white"
      : theme === "light"
      ? "text-slate-900"
      : "text-slate-900 dark:text-zinc-100";

  const dsaTextClass =
    theme === "dark"
      ? "text-[#818CF8]"
      : theme === "light"
      ? "text-[#4F46E5]"
      : "text-indigo-600 dark:text-indigo-400";

  const iconColor =
    color ||
    (theme === "dark"
      ? "#818CF8"
      : theme === "light"
      ? "#4F46E5"
      : "#4F46E5");

  if (variant === "icon") {
    return <LogoIcon size={size} className={className} color={iconColor} />;
  }

  if (variant === "stacked") {
    return (
      <div className={cn("inline-flex items-center gap-3 select-none", className)}>
        <LogoIcon size={size} color={iconColor} />
        <div className="flex flex-col justify-center leading-none">
          <span className={cn("text-lg font-extrabold tracking-tight", thinkTextClass)}>
            Think
          </span>
          <span className={cn("text-lg font-extrabold tracking-tight", dsaTextClass)}>
            DSA
          </span>
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <LogoIcon size={size} color={iconColor} />
      <div className="flex items-center gap-1 leading-none text-xl font-extrabold tracking-tight">
        <span className={thinkTextClass}>Think</span>
        <span className={dsaTextClass}>DSA</span>
      </div>
    </div>
  );
}

// Compact mark alias for compatibility
export function LogoMark({ size = 28, className, color }: Omit<LogoProps, "variant">) {
  return <LogoIcon size={size} className={className} color={color || "#4F46E5"} />;
}
