"use client";

import { useMemo } from "react";
import type { LinkedListNodeState } from "../linked-list-types";

interface LinkedListSVGProps {
  values: number[];
  nodeStates: Record<number, LinkedListNodeState>;
  links: Record<number, number | null>;
  pointers: { prev: number | null; curr: number | null; nextSaved: number | null };
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
const pointerConfig = [
  { key: "prev"      as const, label: "prev",      color: "#f43f5e", textColor: "#fff", offset: 0 },
  { key: "curr"      as const, label: "curr",      color: "#d97706", textColor: "#fff", offset: 0 },
  { key: "nextSaved" as const, label: "next",      color: "#3b82f6", textColor: "#fff", offset: 0 },
] as const;

// Arrow marker IDs
const MARKERS = {
  forward:  "ll-fwd",
  reversed: "ll-rev",
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
    const map: Record<number, Array<typeof pointerConfig[number]>> = {};
    for (const pc of pointerConfig) {
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

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Drop shadow filter */}
        <filter id="ll-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.10" />
        </filter>
        {/* Arrow markers */}
        <marker id={MARKERS.forward}  markerWidth="10" markerHeight="10" refX="9"  refY="5" orient="auto">
          <path d="M1,1.5 L9,5 L1,8.5" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round"/>
        </marker>
        <marker id={MARKERS.done}     markerWidth="10" markerHeight="10" refX="9"  refY="5" orient="auto">
          <path d="M1,1.5 L9,5 L1,8.5" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/>
        </marker>
        <marker id={MARKERS.reversed} markerWidth="10" markerHeight="10" refX="1"  refY="5" orient="auto-start-reverse">
          <path d="M9,1.5 L1,5 L9,8.5" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round"/>
        </marker>
        <marker id={MARKERS.null}     markerWidth="10" markerHeight="10" refX="9"  refY="5" orient="auto">
          <path d="M1,1.5 L9,5 L1,8.5" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
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

        if (isReversed) {
          // Arc above the chain
          const x1 = nodeX(i)         + DIVIDER / 2 + DIVIDER; // right zone centre
          const x2 = nodeX(targetIdx) + DIVIDER / 2 + DIVIDER;
          const arcH = 32 + Math.abs(i - targetIdx) * 6;
          const arcY = nodeYTop - arcH;
          return (
            <path
              key={`arr-${val}-${target}`}
              d={`M${x1},${nodeYTop} C${x1},${arcY} ${x2},${arcY} ${x2},${nodeYTop}`}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2.5"
              markerEnd={`url(#${MARKERS.reversed})`}
              style={{ transition: "d 0.4s ease" }}
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
        rx={8}
        fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 3"
      />
      <text
        x={nullX + NULL_W / 2} y={nodeYTop + NODE_H / 2 + 1}
        textAnchor="middle" dominantBaseline="middle"
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
            style={isActive ? { animation: "llNodePop 320ms cubic-bezier(0.34,1.2,0.64,1) both", transformOrigin: `${x + NODE_W / 2}px ${y + NODE_H / 2}px` } : undefined}
          >
            {/* Glow ring */}
            {isActive && (
              <rect
                x={x - 4} y={y - 4}
                width={NODE_W + 8} height={NODE_H + 8}
                rx={14}
                fill="none"
                stroke={c.glow}
                strokeWidth="2.5"
                style={{ animation: "llPulse 1.6s ease-in-out infinite", opacity: 0.6 }}
              />
            )}

            {/* Node body with shadow */}
            <rect
              x={x} y={y}
              width={NODE_W} height={NODE_H}
              rx={10}
              fill={c.valFill}
              stroke={c.stroke}
              strokeWidth="2"
              filter="url(#ll-shadow)"
              style={{ transition: "fill 0.25s, stroke 0.25s" }}
            />

            {/* Right "next" zone */}
            <rect
              x={x + DIVIDER} y={y + 2}
              width={NODE_W - DIVIDER - 2} height={NODE_H - 4}
              rx={8}
              fill={c.nextFill}
              style={{ transition: "fill 0.25s" }}
            />

            {/* Divider line */}
            <line
              x1={x + DIVIDER} y1={y + 6}
              x2={x + DIVIDER} y2={y + NODE_H - 6}
              stroke={c.stroke} strokeWidth="1" opacity="0.5"
            />

            {/* Value */}
            <text
              x={x + DIVIDER / 2} y={y + NODE_H / 2 + 1}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="15" fontWeight="800" fill={c.text}
            >
              {val}
            </text>

            {/* "next" label */}
            <text
              x={x + DIVIDER + (NODE_W - DIVIDER) / 2} y={y + NODE_H / 2 + 1}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="9" fontWeight="700" fill={c.stroke} opacity="0.8"
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
          // Stagger: each extra pointer shifts left/right
          const badgeW = 42;
          const totalW = ptrs.length * badgeW + (ptrs.length - 1) * 4;
          const startX = cx - totalW / 2;
          const bx = startX + slot * (badgeW + 4);
          const by = nodeYTop - BADGE_H - 6;
          const stemX = bx + badgeW / 2;

          return (
            <g key={`ptr-${pc.key}`}>
              {/* Vertical stem */}
              <line
                x1={stemX} y1={by + BADGE_H}
                x2={stemX} y2={nodeYTop - 2}
                stroke={pc.color} strokeWidth="2"
              />
              {/* Triangle tip */}
              <polygon
                points={`${stemX},${nodeYTop - 1} ${stemX - 4},${nodeYTop - 7} ${stemX + 4},${nodeYTop - 7}`}
                fill={pc.color}
              />
              {/* Badge pill */}
              <rect
                x={bx} y={by}
                width={badgeW} height={BADGE_H}
                rx={6}
                fill={pc.color}
              />
              <text
                x={bx + badgeW / 2} y={by + BADGE_H / 2 + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="11" fontWeight="800" fill={pc.textColor}
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
