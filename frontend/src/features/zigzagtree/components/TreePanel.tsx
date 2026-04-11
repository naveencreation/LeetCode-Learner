"use client";

import type { TreeNode } from "@/features/shared/types";

interface TreePanelProps {
  root: TreeNode | null;
  nodeStates: Record<number, string>;
  currentNode: number | null;
  currentOperation: string;
  activeStep: { currentNode: TreeNode | null } | undefined;
  customNodePositions: Record<number, { x: number; y: number }>;
  onOpenTreeSetup?: () => void;
}

export function TreePanel({ root, nodeStates, currentNode, currentOperation, onOpenTreeSetup }: TreePanelProps) {
  if (!root) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-slate-500">
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
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">
          Tree Structure
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenTreeSetup}
            className="traversal-pill hover:bg-slate-50"
          >
            Select Tree
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-gradient-to-b from-[#fcfffe] to-[#f6f8fb] p-2">
        <svg viewBox="0 0 400 300" className="h-full w-full">
          <g>{renderTreeNodes(root, nodeStates, currentNode)}</g>
        </svg>
      </div>

      <div className="rounded-lg border border-teal-100 bg-teal-50 px-2.5 py-2 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-slate-500">Operation:</span>
          <span className="max-w-[72%] truncate text-right font-extrabold text-teal-700">{currentOperation}</span>
        </div>
      </div>
    </section>
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

  let fill = "#e2e8f0";
  if (state === "completed") fill = "#10b981";
  else if (state === "current") fill = "#ef4444";
  else if (state === "processing") fill = "#f59e0b";

  const radius = isActive ? 28 : 24;
  const stroke = isActive ? "#1e40af" : "#64748b";
  const strokeWidth = isActive ? 3 : 2;

  const xOffset = 120 / (depth + 1);
  const yOffset = 60;

  if (node.left) {
    elements.push(
      <line key={`edge-${node.val}-${node.left.val}`} x1={x} y1={y} x2={x - xOffset} y2={y + yOffset} stroke="#94a3b8" strokeWidth="2" />
    );
    elements.push(...renderTreeNodes(node.left, nodeStates, currentNode, depth + 1, x - xOffset, y + yOffset));
  }

  if (node.right) {
    elements.push(
      <line key={`edge-${node.val}-${node.right.val}`} x1={x} y1={y} x2={x + xOffset} y2={y + yOffset} stroke="#94a3b8" strokeWidth="2" />
    );
    elements.push(...renderTreeNodes(node.right, nodeStates, currentNode, depth + 1, x + xOffset, y + yOffset));
  }

  elements.push(
    <g key={`node-${node.val}`}>
      <circle cx={x} cy={y} r={radius} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">{node.val}</text>
    </g>
  );

  return elements;
}
