"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  color?: string;
  showText?: boolean;
}

export function Logo({ size = 40, className, color, showText = false }: LogoProps) {
  // Use stable IDs to prevent hydration mismatch
  const gradientIdT = "gradT-main";
  const gradientIdD = "gradD-main";
  const strokeColor = color || "currentColor";

  return (
    <div className={cn("flex items-center gap-3", className)} style={{ color: strokeColor }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ThinkDSA logo"
        className="shrink-0"
      >
        <defs>
          {/* T gradient - bright, energetic */}
          <linearGradient id={gradientIdT} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>

          {/* D gradient - deeper, grounded */}
          <linearGradient id={gradientIdD} x1="80%" y1="0%" x2="20%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
        </defs>

        {/* Hexagon frame - clean rounded corners */}
        <path
          d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />

        {/* Letter D - smooth rounded rectangle */}
        <path
          d="M46 28 
             L46 72
             L54 72
             C70 72 70 28 54 28
             Z"
          fill={`url(#${gradientIdD})`}
          opacity="0.95"
        />

        {/* Letter T - positioned to overlap/interlock with D */}
        <g>
          {/* T top bar */}
          <rect
            x="22"
            y="28"
            width="32"
            height="10"
            rx="2"
            fill={`url(#${gradientIdT})`}
          />
          {/* T vertical stem */}
          <rect
            x="33"
            y="38"
            width="10"
            height="34"
            rx="2"
            fill={`url(#${gradientIdT})`}
          />
        </g>

        {/* Subtle connecting line between T and D */}
        <path
          d="M46 50 L54 50"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {showText && (
        <span className="font-[var(--font-space-grotesk)] font-semibold text-2xl text-[var(--l-text)] tracking-tight">
          ThinkDSA
        </span>
      )}
    </div>
  );
}

// Compact mark for sidebar/favicon
export function LogoMark({ size = 28, className, color }: Omit<LogoProps, 'showText'>) {
  // Use stable IDs to prevent hydration mismatch
  const gradientIdT = "gradTM-mark";
  const gradientIdD = "gradDM-mark";
  const strokeColor = color || "currentColor";

  return (
    <div className={cn("shrink-0", className)} style={{ color: strokeColor, display: 'flex' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ThinkDSA"
      >
      <defs>
        <linearGradient id={gradientIdT} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id={gradientIdD} x1="80%" y1="0%" x2="20%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
      </defs>

      {/* Hexagon */}
      <path
        d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        fill="none"
      />

      {/* D */}
      <path
        d="M46 28 L46 72 L54 72 C70 72 70 28 54 28 Z"
        fill={`url(#${gradientIdD})`}
      />

      {/* T */}
      <rect x="22" y="28" width="32" height="10" rx="2" fill={`url(#${gradientIdT})`} />
      <rect x="33" y="38" width="10" height="34" rx="2" fill={`url(#${gradientIdT})`} />
    </svg>
    </div>
  );
}
