"use client";

import { useMemo } from "react";
import type { LinkedListNodeState } from "../linked-list-types";

interface LinkedListSVGProps {
  values: number[];
  nodeStates: Record<number, LinkedListNodeState>;
  links: Record<number, number | null>;
  pointers: { prev: number | null; curr: number | null; nextSaved: number | null };
}

const NODE_W = 52;
const NODE_H = 36;
const GAP = 60;
const ARROW_LEN = GAP - 4;
const PAD_X = 40;
const PAD_Y = 56;
const POINTER_ROW_Y = NODE_H + 28;
const NULL_W = 40;

const stateColors: Record<LinkedListNodeState, { fill: string; stroke: string; text: string }> = {
  unvisited:  { fill: "#e5e7eb", stroke: "#94a3b8", text: "#475569" },
  prev:       { fill: "#fda4af", stroke: "#f43f5e", text: "#881337" },
  current:    { fill: "#fbbf24", stroke: "#d97706", text: "#78350f" },
  next_saved: { fill: "#93c5fd", stroke: "#3b82f6", text: "#1e3a5a" },
  reversed:   { fill: "#c4b5fd", stroke: "#8b5cf6", text: "#3b0764" },
  completed:  { fill: "#86efac", stroke: "#22c55e", text: "#14532d" },
};

const pointerColors: Record<string, string> = {
  prev: "#f43f5e",
  curr: "#d97706",
  nextSaved: "#3b82f6",
};

const pointerLabels: Record<string, string> = {
  prev: "prev",
  curr: "curr",
  nextSaved: "next",
};

export function LinkedListSVG({ values, nodeStates, links, pointers }: LinkedListSVGProps) {
  // Position map: value → index in original array
  const positionMap = useMemo(() => {
    const map: Record<number, number> = {};
    values.forEach((v, i) => {
      map[v] = i;
    });
    return map;
  }, [values]);

  const totalNodes = values.length;
  const svgWidth = totalNodes * (NODE_W + GAP) - GAP + NULL_W + GAP + PAD_X * 2;
  const svgHeight = PAD_Y + NODE_H + POINTER_ROW_Y + 20;

  const nodeX = (index: number) => PAD_X + index * (NODE_W + GAP);
  const nullX = PAD_X + totalNodes * (NODE_W + GAP);

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker id="ll-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,1 L7,4 L0,7" fill="none" stroke="#64748b" strokeWidth="1.5" />
        </marker>
        <marker id="ll-arrow-rev" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
          <path d="M8,1 L1,4 L8,7" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
        </marker>
        <marker id="ll-arrow-active" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,1 L7,4 L0,7" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        </marker>
      </defs>

      {/* ── Arrows (links) ── */}
      {values.map((val, i) => {
        const x1 = nodeX(i) + NODE_W;
        const y = PAD_Y + NODE_H / 2;
        const target = links[val];

        if (target === null || target === undefined) {
          // Arrow to null box
          const x2 = nullX;
          return (
            <line
              key={`arrow-null-${val}`}
              x1={x1 + 2}
              y1={y}
              x2={x2 - 2}
              y2={y}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4 3"
              markerEnd="url(#ll-arrow)"
              className="transition-all duration-300"
            />
          );
        }

        const targetIdx = positionMap[target];
        if (targetIdx === undefined) return null;

        const targetX = nodeX(targetIdx);
        const isReversed = targetIdx < i;

        if (isReversed) {
          // Reversed arrow — curved below
          const midX = (x1 + targetX + NODE_W) / 2;
          const curveY = y + 42;
          return (
            <path
              key={`arrow-${val}-${target}`}
              d={`M${x1 + 2},${y} C${x1 + 20},${curveY} ${targetX + NODE_W - 20},${curveY} ${targetX + NODE_W - 2},${y}`}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              markerEnd="url(#ll-arrow-rev)"
              className="transition-all duration-500"
            />
          );
        }

        // Normal forward arrow
        const x2 = targetX;
        return (
          <line
            key={`arrow-${val}-${target}`}
            x1={x1 + 2}
            y1={y}
            x2={x2 - 2}
            y2={y}
            stroke={nodeStates[val] === "completed" ? "#22c55e" : "#64748b"}
            strokeWidth="2"
            markerEnd={nodeStates[val] === "completed" ? "url(#ll-arrow-active)" : "url(#ll-arrow)"}
            className="transition-all duration-300"
          />
        );
      })}

      {/* ── Null box ── */}
      <rect
        x={nullX}
        y={PAD_Y + (NODE_H - 24) / 2}
        width={NULL_W}
        height={24}
        rx={6}
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <text
        x={nullX + NULL_W / 2}
        y={PAD_Y + NODE_H / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[11px] font-bold"
        fill="#94a3b8"
      >
        null
      </text>

      {/* ── Nodes ── */}
      {values.map((val, i) => {
        const x = nodeX(i);
        const y = PAD_Y;
        const state = nodeStates[val] ?? "unvisited";
        const colors = stateColors[state];

        return (
          <g key={`node-${val}`} className="transition-all duration-300">
            {/* Glow */}
            {state !== "unvisited" && (
              <rect
                x={x - 3}
                y={y - 3}
                width={NODE_W + 6}
                height={NODE_H + 6}
                rx={12}
                fill="none"
                stroke={colors.stroke}
                strokeWidth="1"
                opacity="0.3"
              />
            )}
            {/* Box */}
            <rect
              x={x}
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx={8}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth="2"
              className="transition-all duration-300"
            />
            {/* Value */}
            <text
              x={x + NODE_W / 2}
              y={y + NODE_H / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[14px] font-extrabold"
              fill={colors.text}
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* ── Pointer labels ── */}
      {(["prev", "curr", "nextSaved"] as const).map((pKey) => {
        const val = pointers[pKey];
        if (val === null || val === undefined) return null;
        const idx = positionMap[val];
        if (idx === undefined) return null;

        const x = nodeX(idx) + NODE_W / 2;
        const y = PAD_Y + NODE_H + 18;

        return (
          <g key={`ptr-${pKey}`}>
            {/* Pointer arrow */}
            <line
              x1={x}
              y1={y}
              x2={x}
              y2={PAD_Y + NODE_H + 4}
              stroke={pointerColors[pKey]}
              strokeWidth="2"
              markerEnd="none"
            />
            <polygon
              points={`${x},${PAD_Y + NODE_H + 2} ${x - 4},${PAD_Y + NODE_H + 8} ${x + 4},${PAD_Y + NODE_H + 8}`}
              fill={pointerColors[pKey]}
            />
            {/* Label */}
            <rect
              x={x - 18}
              y={y + 2}
              width={36}
              height={16}
              rx={4}
              fill={pointerColors[pKey]}
              opacity="0.15"
            />
            <text
              x={x}
              y={y + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[9px] font-extrabold"
              fill={pointerColors[pKey]}
            >
              {pointerLabels[pKey]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
