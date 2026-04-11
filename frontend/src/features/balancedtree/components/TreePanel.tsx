"use client";

import type { TreeNode } from "@/features/shared/types";

interface TreePanelProps {
  root: TreeNode | null;
  nodeStates: Record<number, string>;
  currentNode: number | null;
  activeStep: { currentNode: TreeNode | null } | undefined;
  customNodePositions: Record<number, { x: number; y: number }>;
  onOpenTreeSetup?: () => void;
}

export function TreePanel({ root, nodeStates, currentNode, onOpenTreeSetup }: TreePanelProps) {
  if (!root) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        <p>Empty tree</p>
        {onOpenTreeSetup && (
          <button onClick={onOpenTreeSetup} className="mt-4 rounded-md bg-slate-800 px-3 py-1 text-xs text-white">
            Configure Tree
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <g>
          {/* Simple tree rendering - edges and nodes */}
          {renderTreeNodes(root, nodeStates, currentNode)}
        </g>
      </svg>
    </div>
  );
}

function renderTreeNodes(
  node: TreeNode | null,
  nodeStates: Record<number, string>,
  currentNode: number | null,
  depth = 0,
  x = 200,
  y = 40
): React.ReactElement[] {
  if (!node) return [];

  const elements: React.ReactElement[] = [];
  const state = nodeStates[node.val] ?? "unvisited";
  const isActive = currentNode === node.val;

  // Node color based on state
  let fill = "#e2e8f0"; // unvisited - slate-200
  if (state === "completed") fill = "#10b981"; // emerald-500
  else if (state === "current") fill = "#ef4444"; // red-500
  else if (state === "exploring_left" || state === "exploring_right") fill = "#3b82f6"; // blue-500
  else if (state === "processing") fill = "#f59e0b"; // amber-500

  const radius = isActive ? 28 : 24;
  const stroke = isActive ? "#1e40af" : "#64748b";
  const strokeWidth = isActive ? 3 : 2;

  // Render children first (so edges appear behind nodes)
  const xOffset = 120 / (depth + 1);
  const yOffset = 60;

  if (node.left) {
    elements.push(
      <line
        key={`edge-${node.val}-${node.left.val}`}
        x1={x}
        y1={y}
        x2={x - xOffset}
        y2={y + yOffset}
        stroke="#94a3b8"
        strokeWidth="2"
      />
    );
    elements.push(...renderTreeNodes(node.left, nodeStates, currentNode, depth + 1, x - xOffset, y + yOffset));
  }

  if (node.right) {
    elements.push(
      <line
        key={`edge-${node.val}-${node.right.val}`}
        x1={x}
        y1={y}
        x2={x + xOffset}
        y2={y + yOffset}
        stroke="#94a3b8"
        strokeWidth="2"
      />
    );
    elements.push(...renderTreeNodes(node.right, nodeStates, currentNode, depth + 1, x + xOffset, y + yOffset));
  }

  // Render this node
  elements.push(
    <g key={`node-${node.val}`}>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="#1e293b"
      >
        {node.val}
      </text>
    </g>
  );

  return elements;
}
