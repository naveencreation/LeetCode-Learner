"use client";

import { useMemo } from "react";
import type { LinkedListNodeState } from "../linked-list-types";

interface LinkedListSVGProps {
  values: number[];
  nodeStates: Record<number, LinkedListNodeState>;
  links: Record<number, number | null>;
  pointers: { 
    prev: number | null; 
    curr: number | null; 
    nextSaved: number | null;
    // Alternative pointer names for slow/fast (tortoise/hare) algorithm
    slow?: number | null;
    fast?: number | null;
  };
}

// ── Layout constants ──────────────────────────────────────────────────
const NODE_W = 72;       // wider node
const NODE_H = 48;       // taller node
const DIVIDER = 48;      // x position of val/next divider inside node
const GAP = 52;          // gap between nodes
const PAD_X = 36;
const BADGE_H = 24;      // height of pointer badge
const BADGE_PAD_TOP = 12; // space above node for badges
const CHAIN_Y = BADGE_H + BADGE_PAD_TOP + 8; // top of node row
const NULL_W = 44;
const NULL_H = 28;

// ── State colors ─────────────────────────────────────────────────────
const stateColors: Record<
  LinkedListNodeState,
  { valFill: string; nextFill: string; stroke: string; text: string; glow: string }
> = {
  unvisited:  { valFill: "#f1f5f9", nextFill: "#e2e8f0", stroke: "#94a3b8", text: "#475569",  glow: "none" },
  prev:       { valFill: "#ffe4e6", nextFill: "#fecdd3", stroke: "#f43f5e", text: "#881337",  glow: "#fda4af" },
  current:    { valFill: "#fef9c3", nextFill: "#fde68a", stroke: "#d97706", text: "#78350f",  glow: "#fbbf24" },
  next_saved: { valFill: "#dbeafe", nextFill: "#bfdbfe", stroke: "#3b82f6", text: "#1e3a5a",  glow: "#93c5fd" },
  reversed:   { valFill: "#ede9fe", nextFill: "#ddd6fe", stroke: "#8b5cf6", text: "#3b0764",  glow: "#c4b5fd" },
  completed:  { valFill: "#dcfce7", nextFill: "#bbf7d0", stroke: "#22c55e", text: "#14532d",  glow: "#86efac" },
};

// ── Pointer badge config ──────────────────────────────────────────────
const pointerConfigBase = [
  { key: "prev"      as const, label: "prev", color: "#f43f5e", textColor: "#ffffff", offset: 0 },
  { key: "curr"      as const, label: "curr", color: "#d97706", textColor: "#ffffff", offset: 0 },
  { key: "nextSaved" as const, label: "next", color: "#3b82f6", textColor: "#ffffff", offset: 0 },
  { key: "slow"      as const, label: "slow", color: "#f59e0b", textColor: "#ffffff", offset: 0 },  // amber-500
  { key: "fast"      as const, label: "fast", color: "#3b82f6", textColor: "#ffffff", offset: 0 },  // blue-500
] as const;

// Arrow marker IDs
const MARKERS = {
  forward:  "ll-fwd",
  reversed: "ll-rev",
  reversedActive: "ll-rev-active",
  done:     "ll-done",
  null:     "ll-null",
};

export function LinkedListSVG({ values, nodeStates, links, pointers }: LinkedListSVGProps) {
  const positionMap = useMemo(() => {
    const map: Record<number, number> = {};
    values.forEach((v, i) => { map[v] = i; });
    return map;
  }, [values]);

  const totalNodes = values.length;
  const nodeX = (i: number) => PAD_X + i * (NODE_W + GAP);
  const nullX = PAD_X + totalNodes * (NODE_W + GAP);
  const svgWidth  = nullX + NULL_W + PAD_X;
  const svgHeight = CHAIN_Y + NODE_H + 16; // small bottom pad

  // Group pointers by node index to handle stacking
  const ptrByIndex = useMemo(() => {
    const map: Record<number, Array<typeof pointerConfigBase[number]>> = {};
    for (const pc of pointerConfigBase) {
      const val = pointers[pc.key];
      if (val === null || val === undefined) continue;
      const idx = positionMap[val];
      if (idx === undefined) continue;
      if (!map[idx]) map[idx] = [];
      map[idx].push(pc);
    }
    return map;
  }, [pointers, positionMap]);

  const nodeYTop = CHAIN_Y;
  const nodeCY   = nodeYTop + NODE_H / 2;

  const hasReversedArcAt = (index: number): boolean => {
    if (index < 0 || index >= values.length) {
      return false;
    }

    const sourceVal = values[index];
    const targetVal = links[sourceVal];
    if (targetVal === null || targetVal === undefined) {
      return false;
    }

    const targetIdx = positionMap[targetVal];
    return targetIdx !== undefined && targetIdx < index;
  };

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ willChange: 'transform' }} // GPU acceleration hint
    >
      <defs>
        {/* Drop shadow filter — optimized for crisp edges */}
        <filter id="ll-shadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.08" />
        </filter>
        {/* Arrow markers — pixel-perfect sizing */}
        <marker id={MARKERS.forward}  markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,1 L7,4 L0,7" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id={MARKERS.done}     markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,1 L7,4 L0,7" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id={MARKERS.reversed} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse">
          <path d="M0.8,1.5 L7,4 L0.8,6.5 Z" fill="#7c3aed"/>
        </marker>
        <marker id={MARKERS.reversedActive} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse">
          <path d="M0.8,1.5 L7,4 L0.8,6.5 Z" fill="#ef4444"/>
        </marker>
        <marker id={MARKERS.null}     markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,1 L7,4 L0,7" fill="none" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>

      {/* ── Arrows ─────────────────────────────────────────────── */}
      {values.map((val, i) => {
        const srcRight = nodeX(i) + NODE_W; // right edge of node
        const target   = links[val];
        const state    = nodeStates[val] ?? "unvisited";

        // → null
        if (target === null || target === undefined) {
          const x2 = nullX;
          return (
            <line
              key={`arr-null-${val}`}
              x1={srcRight + 2} y1={nodeCY}
              x2={x2 - 2}       y2={nodeCY}
              stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 3"
              markerEnd={`url(#${MARKERS.null})`}
            />
          );
        }

        const targetIdx = positionMap[target];
        if (targetIdx === undefined) return null;
        const isReversed = targetIdx < i;
        const isActiveReverse = isReversed && state === "reversed" && pointers.curr === val;
        const hasAdjacentReversedArc = isReversed && (hasReversedArcAt(i - 1) || hasReversedArcAt(i + 1));
        const reverseArcOpacity = hasAdjacentReversedArc && !isActiveReverse ? 0.74 : 1;

        if (isReversed) {
          // Arc above the chain
          const x1 = nodeX(i)         + DIVIDER / 2 + DIVIDER; // right zone centre
          const x2 = nodeX(targetIdx) + DIVIDER / 2 + DIVIDER;
          const nodeDistance = Math.abs(i - targetIdx);
          const arcH = 32 + nodeDistance * 6.5;
          const arcY = nodeYTop - arcH;
          const controlX2 = x2 + Math.min(22, 10 + nodeDistance * 4);
          return (
            <path
              key={`arr-${val}-${target}`}
              d={`M${x1},${nodeYTop} C${x1},${arcY} ${controlX2},${nodeYTop} ${x2},${nodeYTop}`}
              fill="none"
              stroke={isActiveReverse ? "#ef4444" : "#7c3aed"}
              strokeWidth={isActiveReverse ? "2.9" : "2.6"}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={reverseArcOpacity}
              markerEnd={`url(#${isActiveReverse ? MARKERS.reversedActive : MARKERS.reversed})`}
              style={{ transition: "d 0.4s ease, stroke 0.25s ease, opacity 0.2s ease" }}
            />
          );
        }

        // Forward arrow
        const x2 = nodeX(targetIdx);
        const arrowColor = state === "completed" ? "#16a34a" : "#64748b";
        const markerId   = state === "completed" ? MARKERS.done : MARKERS.forward;
        return (
          <line
            key={`arr-${val}-${target}`}
            x1={srcRight + 2} y1={nodeCY}
            x2={x2 - 2}       y2={nodeCY}
            stroke={arrowColor} strokeWidth="2.5"
            markerEnd={`url(#${markerId})`}
            style={{ transition: "stroke 0.3s" }}
          />
        );
      })}

      {/* ── Null terminal ─────────────────────────────────────── */}
      <rect
        x={nullX} y={nodeYTop + (NODE_H - NULL_H) / 2}
        width={NULL_W} height={NULL_H}
        rx={6}
        fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3"
      />
      <text
        x={nullX + NULL_W / 2} y={nodeYTop + NODE_H / 2}
        textAnchor="middle" dominantBaseline="central"
        fontSize="11" fontWeight="700" fill="#94a3b8"
      >
        null
      </text>

      {/* ── Nodes ──────────────────────────────────────────────── */}
      {values.map((val, i) => {
        const x     = nodeX(i);
        const y     = nodeYTop;
        const state = nodeStates[val] ?? "unvisited";
        const c     = stateColors[state];
        const isActive = state !== "unvisited";

        return (
          <g
            key={`node-${val}-${state}`}
            className={isActive ? "ll-node-active" : ""}
            style={isActive ? { 
              animation: "llNodePop 320ms cubic-bezier(0.34,1.2,0.64,1) both", 
              transformOrigin: `${x + NODE_W / 2}px ${y + NODE_H / 2}px`,
              willChange: 'transform'
            } : undefined}
          >
            {/* Glow ring — pixel-perfect inset */}
            {isActive && c.glow !== "none" && (
              <rect
                x={x - 3} y={y - 3}
                width={NODE_W + 6} height={NODE_H + 6}
                rx={12}
                fill="none"
                stroke={c.glow}
                strokeWidth="2"
                opacity={0.6}
                style={{ animation: "llPulse 1.6s ease-in-out infinite" }}
              />
            )}

            {/* Node body with shadow — crisp edges */}
            <rect
              x={x} y={y}
              width={NODE_W} height={NODE_H}
              rx={10}
              fill={c.valFill}
              stroke={c.stroke}
              strokeWidth="1.5"
              filter="url(#ll-shadow)"
              style={{ transition: "fill 180ms ease, stroke 180ms ease" }}
            />

            {/* Right "next" zone — precise inset */}
            <rect
              x={x + DIVIDER + 1} y={y + 2}
              width={NODE_W - DIVIDER - 3} height={NODE_H - 4}
              rx={7}
              fill={c.nextFill}
              style={{ transition: "fill 180ms ease" }}
            />

            {/* Divider line — hairline precision */}
            <line
              x1={x + DIVIDER} y1={y + 5}
              x2={x + DIVIDER} y2={y + NODE_H - 5}
              stroke={c.stroke} strokeWidth="1" opacity="0.4" strokeLinecap="round"
            />

            {/* Value — pixel-perfect centered */}
            <text
              x={x + DIVIDER / 2} y={y + NODE_H / 2}
              textAnchor="middle" dominantBaseline="central"
              fontSize="15" fontWeight="800" fill={c.text}
              style={{ userSelect: 'none' }}
            >
              {val}
            </text>

            {/* "next" label — pixel-perfect centered */}
            <text
              x={x + DIVIDER + (NODE_W - DIVIDER) / 2} y={y + NODE_H / 2}
              textAnchor="middle" dominantBaseline="central"
              fontSize="9" fontWeight="700" fill={c.stroke} opacity="0.75"
              style={{ userSelect: 'none' }}
            >
              next
            </text>
          </g>
        );
      })}

      {/* ── Pointer badges above nodes ──────────────────────── */}
      {Object.entries(ptrByIndex).map(([idxStr, ptrs]) => {
        const idx = Number(idxStr);
        const cx  = nodeX(idx) + NODE_W / 2;

        return ptrs.map((pc, slot) => {
          // Stagger: each extra pointer shifts left/right with tighter spacing
          const badgeW = 40;
          const badgeGap = 3;
          const totalW = ptrs.length * badgeW + (ptrs.length - 1) * badgeGap;
          const startX = cx - totalW / 2;
          const bx = Math.round(startX + slot * (badgeW + badgeGap));
          const by = nodeYTop - BADGE_H - 8; // Slightly higher for cleaner look
          const stemX = bx + badgeW / 2;

          return (
            <g key={`ptr-${idx}-${pc.key}`}>
              {/* Vertical stem — hairline */}
              <line
                x1={stemX} y1={by + BADGE_H}
                x2={stemX} y2={nodeYTop - 3}
                stroke={pc.color} strokeWidth="1.5" strokeLinecap="round"
              />
              {/* Triangle tip — crisp triangle */}
              <polygon
                points={`${stemX},${nodeYTop - 2} ${stemX - 3},${nodeYTop - 7} ${stemX + 3},${nodeYTop - 7}`}
                fill={pc.color}
              />
              {/* Badge pill — crisp shadowless */}
              <rect
                x={bx} y={by}
                width={badgeW} height={BADGE_H}
                rx={5}
                fill={pc.color}
              />
              {/* Badge text — pixel-perfect centered */}
              <text
                x={bx + badgeW / 2} y={by + BADGE_H / 2}
                textAnchor="middle" dominantBaseline="central"
                fontSize="10" fontWeight="800" fill={pc.textColor}
                style={{ userSelect: 'none' }}
              >
                {pc.label}
              </text>
            </g>
          );
        });
      })}
    </svg>
  );
}
