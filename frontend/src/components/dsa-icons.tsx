import type { SVGProps } from "react";

interface DSAIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
}

function base(size: number | undefined) {
  const s = size ?? 24;
  return {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

/** Array — clean 4-cell row with value dots, well centered */
export function ArrayIcon({ size, strokeWidth: sw = 1.8, ...props }: DSAIconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3" y="8" width="18" height="8" rx="1.5" stroke="currentColor" strokeWidth={sw} />
      <line x1="7.5" y1="8" x2="7.5" y2="16" stroke="currentColor" strokeWidth={sw} opacity={0.5} />
      <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth={sw} opacity={0.5} />
      <line x1="16.5" y1="8" x2="16.5" y2="16" stroke="currentColor" strokeWidth={sw} opacity={0.5} />
      <circle cx="5.25" cy="12" r="0.9" fill="currentColor" />
      <circle cx="9.75" cy="12" r="0.9" fill="currentColor" />
      <circle cx="14.25" cy="12" r="0.9" fill="currentColor" />
      <circle cx="18.75" cy="12" r="0.9" fill="currentColor" />
    </svg>
  );
}

/** Linked list — two square nodes with connecting arrow */
export function LinkedListIcon({ size, strokeWidth: sw = 1.8, ...props }: DSAIconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3" y="8.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={sw} />
      <rect x="14" y="8.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={sw} />
      <circle cx="5.5" cy="12" r="1" fill="currentColor" />
      <circle cx="16.5" cy="12" r="1" fill="currentColor" />
      <line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth={sw} />
      <polyline points="12.5,10.5 14,12 12.5,13.5" stroke="currentColor" strokeWidth={sw} fill="none" />
    </svg>
  );
}

/** Binary tree — balanced symmetric tree, clean Lucide style */
export function BinaryTreeIcon({ size, strokeWidth: sw = 1.8, ...props }: DSAIconProps) {
  return (
    <svg {...base(size)} {...props}>
      {/* Edges — connecting node perimeters */}
      <path d="M10.4 6.2 L8.4 11.6" stroke="currentColor" strokeWidth={sw} />
      <path d="M13.6 6.2 L15.6 11.6" stroke="currentColor" strokeWidth={sw} />
      <path d="M5.8 14.8 L5.2 17.3" stroke="currentColor" strokeWidth={sw} />
      <path d="M8.2 14.8 L8.8 17.3" stroke="currentColor" strokeWidth={sw} />
      <path d="M15.8 14.8 L15.2 17.3" stroke="currentColor" strokeWidth={sw} />
      <path d="M18.2 14.8 L18.8 17.3" stroke="currentColor" strokeWidth={sw} />
      {/* Level 0 */}
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth={sw} />
      {/* Level 1 */}
      <circle cx="7" cy="13.5" r="1.8" stroke="currentColor" strokeWidth={sw} />
      <circle cx="17" cy="13.5" r="1.8" stroke="currentColor" strokeWidth={sw} />
      {/* Level 2 — smaller, filled dot style */}
      <circle cx="5" cy="19" r="1.4" stroke="currentColor" strokeWidth={sw} />
      <circle cx="9" cy="19" r="1.4" stroke="currentColor" strokeWidth={sw} />
      <circle cx="15" cy="19" r="1.4" stroke="currentColor" strokeWidth={sw} />
      <circle cx="19" cy="19" r="1.4" stroke="currentColor" strokeWidth={sw} />
    </svg>
  );
}

/** BST — tree with chevron indicators in child nodes */
export function BSTIcon({ size, strokeWidth: sw = 1.8, ...props }: DSAIconProps) {
  return (
    <svg {...base(size)} {...props}>
      {/* Edges */}
      <path d="M10.3 7.5 L8.3 12.8" stroke="currentColor" strokeWidth={sw} />
      <path d="M13.7 7.5 L15.7 12.8" stroke="currentColor" strokeWidth={sw} />
      {/* Root node */}
      <circle cx="12" cy="5.5" r="2.8" stroke="currentColor" strokeWidth={sw} />
      <circle cx="12" cy="5.5" r="0.7" fill="currentColor" />
      {/* Left child — left-pointing chevron */}
      <circle cx="7" cy="15" r="2.8" stroke="currentColor" strokeWidth={sw} />
      <polyline points="8,13.8 6.3,15 8,16.2" stroke="currentColor" strokeWidth={sw * 0.9} fill="none" />
      {/* Right child — right-pointing chevron */}
      <circle cx="17" cy="15" r="2.8" stroke="currentColor" strokeWidth={sw} />
      <polyline points="16,13.8 17.7,15 16,16.2" stroke="currentColor" strokeWidth={sw * 0.9} fill="none" />
    </svg>
  );
}

/** Graph — 4-node diamond with cross edges, centered */
export function GraphIcon({ size, strokeWidth: sw = 1.8, ...props }: DSAIconProps) {
  return (
    <svg {...base(size)} {...props}>
      {/* Edges — drawn at reduced opacity */}
      <line x1="12" y1="6.5" x2="7.3" y2="10.5" stroke="currentColor" strokeWidth={sw} opacity={0.4} />
      <line x1="12" y1="6.5" x2="16.7" y2="10.5" stroke="currentColor" strokeWidth={sw} opacity={0.4} />
      <line x1="7.3" y1="13.5" x2="12" y2="17.5" stroke="currentColor" strokeWidth={sw} opacity={0.4} />
      <line x1="16.7" y1="13.5" x2="12" y2="17.5" stroke="currentColor" strokeWidth={sw} opacity={0.4} />
      <line x1="7.5" y1="12" x2="16.5" y2="12" stroke="currentColor" strokeWidth={sw} opacity={0.4} />
      {/* Nodes */}
      <circle cx="12" cy="4.5" r="2" stroke="currentColor" strokeWidth={sw} />
      <circle cx="5.5" cy="12" r="2" stroke="currentColor" strokeWidth={sw} />
      <circle cx="18.5" cy="12" r="2" stroke="currentColor" strokeWidth={sw} />
      <circle cx="12" cy="19.5" r="2" stroke="currentColor" strokeWidth={sw} />
      {/* Node dots */}
      <circle cx="12" cy="4.5" r="0.6" fill="currentColor" />
      <circle cx="5.5" cy="12" r="0.6" fill="currentColor" />
      <circle cx="18.5" cy="12" r="0.6" fill="currentColor" />
      <circle cx="12" cy="19.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

/** DP — 3x3 grid table with diagonal transition arrow */
export function DPIcon({ size, strokeWidth: sw = 1.8, ...props }: DSAIconProps) {
  return (
    <svg {...base(size)} {...props}>
      {/* Outer frame */}
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" stroke="currentColor" strokeWidth={sw} />
      {/* Grid lines */}
      <line x1="3.5" y1="9.2" x2="20.5" y2="9.2" stroke="currentColor" strokeWidth={sw * 0.6} opacity={0.4} />
      <line x1="3.5" y1="14.8" x2="20.5" y2="14.8" stroke="currentColor" strokeWidth={sw * 0.6} opacity={0.4} />
      <line x1="9.2" y1="3.5" x2="9.2" y2="20.5" stroke="currentColor" strokeWidth={sw * 0.6} opacity={0.4} />
      <line x1="14.8" y1="3.5" x2="14.8" y2="20.5" stroke="currentColor" strokeWidth={sw * 0.6} opacity={0.4} />
      {/* Transition arrow — bottom-left to top-right (optimal substructure) */}
      <line x1="6.5" y1="17.5" x2="17" y2="7" stroke="currentColor" strokeWidth={sw * 1.1} />
      <polyline points="14.5,7 17,7 17,9.5" stroke="currentColor" strokeWidth={sw * 1.1} fill="none" />
      {/* Filled cells hint */}
      <circle cx="6.5" cy="6.5" r="0.8" fill="currentColor" opacity={0.3} />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" opacity={0.3} />
    </svg>
  );
}

/** Recursion — clean branching tree (call stack), 3 levels */
export function RecursionIcon({ size, strokeWidth: sw = 1.8, ...props }: DSAIconProps) {
  return (
    <svg {...base(size)} {...props}>
      {/* Branches */}
      <line x1="12" y1="4" x2="12" y2="7.5" stroke="currentColor" strokeWidth={sw} />
      <line x1="12" y1="7.5" x2="7" y2="13" stroke="currentColor" strokeWidth={sw} />
      <line x1="12" y1="7.5" x2="17" y2="13" stroke="currentColor" strokeWidth={sw} />
      <line x1="7" y1="13" x2="5" y2="18" stroke="currentColor" strokeWidth={sw} />
      <line x1="7" y1="13" x2="9" y2="18" stroke="currentColor" strokeWidth={sw} />
      <line x1="17" y1="13" x2="15" y2="18" stroke="currentColor" strokeWidth={sw} />
      <line x1="17" y1="13" x2="19" y2="18" stroke="currentColor" strokeWidth={sw} />
      {/* Junction nodes — solid fills, decreasing size = recursion depth */}
      <circle cx="12" cy="4" r="1.8" fill="currentColor" opacity={0.9} />
      <circle cx="12" cy="7.5" r="1.5" fill="currentColor" opacity={0.7} />
      <circle cx="7" cy="13" r="1.3" fill="currentColor" opacity={0.55} />
      <circle cx="17" cy="13" r="1.3" fill="currentColor" opacity={0.55} />
      <circle cx="5" cy="18" r="1" fill="currentColor" opacity={0.35} />
      <circle cx="9" cy="18" r="1" fill="currentColor" opacity={0.35} />
      <circle cx="15" cy="18" r="1" fill="currentColor" opacity={0.35} />
      <circle cx="19" cy="18" r="1" fill="currentColor" opacity={0.35} />
    </svg>
  );
}

/** LeetCode platform icon */
export function LeetCodeIcon({ size, ...props }: DSAIconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fill="#B3B1B0" d="M22,14.355c0-0.742-0.564-1.345-1.26-1.345H10.676c-0.696,0-1.26,0.604-1.26,1.345c0,0.742,0.564,1.346,1.26,1.346H20.74C21.436,15.701,22,15.098,22,14.355z" />
      <path fill="#E7A41F" d="M3.483,18.187l4.312,4.361C8.767,23.527,10.113,24,11.599,24c1.484,0,2.83-0.511,3.804-1.494l2.589-2.637c0.51-0.514,0.492-1.365-0.039-1.9c-0.53-0.535-1.375-0.553-1.884-0.039l-2.676,2.607c-0.462,0.467-1.102,0.662-1.808,0.662c-0.706,0-1.346-0.195-1.81-0.662l-4.297-4.363c-0.463-0.468-0.697-1.15-0.697-1.863c0-0.713,0.234-1.357,0.697-1.824l4.285-4.38c0.464-0.468,1.116-0.645,1.822-0.645c0.707,0,1.347,0.195,1.808,0.662l2.676,2.606c0.51,0.515,1.354,0.497,1.885-0.038c0.531-0.536,0.549-1.386,0.039-1.901l-2.589-2.635c-0.648-0.646-1.471-1.116-2.392-1.33l-0.033-0.006l2.447-2.504c0.512-0.514,0.494-1.366-0.037-1.901c-0.53-0.535-1.376-0.553-1.887-0.038L3.483,10.476C2.509,11.458,2,12.814,2,14.312S2.509,17.206,3.483,18.187z" />
      <path fill="#070706" d="M8.115,22.814c-0.176-0.097-0.332-0.219-0.474-0.361c-1.327-1.333-2.66-2.66-3.984-3.996c-1.988-2.009-2.302-4.936-0.785-7.32c0.234-0.37,0.529-0.694,0.839-1.004c3.208-3.214,6.415-6.43,9.623-9.644c0.625-0.626,1.497-0.652,2.079-0.066c0.559,0.562,0.527,1.455-0.077,2.065c-0.77,0.776-1.54,1.55-2.31,2.325c-0.041,0.122-0.14,0.2-0.226,0.287c-0.863,0.877-1.751,1.73-2.6,2.619c-0.111,0.115-0.262,0.186-0.372,0.305c-1.423,1.423-2.862,2.83-4.265,4.272c-1.136,1.167-1.096,2.938,0.068,4.128c1.309,1.336,2.639,2.65,3.96,3.974l0.204,0.198c0.469,0.303,0.473,1.25,0.182,1.671c-0.321,0.466-0.739,0.75-1.333,0.728C8.445,22.987,8.281,22.907,8.115,22.814z" />
    </svg>
  );
}

/** GeeksforGeeks platform icon */
export function GFGIcon({ size, ...props }: DSAIconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="-0.96 -0.96 49.92 49.92" xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
      <path d="M23.9944,24H43.5a9.7513,9.7513,0,1,1-2.8565-6.8943" stroke="#2F8D46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M24.0056,24H4.5a9.7513,9.7513,0,1,0,2.8565-6.8943" stroke="#2F8D46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
