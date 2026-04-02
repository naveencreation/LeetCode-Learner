import type { ExecutionStep, NodePosition, NodeVisualState, TreeNode } from "../types";

interface TreePanelProps {
  root: TreeNode;
  currentOperation: string;
  operationBadge: string;
  nodeStates: Record<number, NodeVisualState>;
  activeStep: ExecutionStep | undefined;
  customNodePositions: Record<number, NodePosition>;
  onOpenTreeSetup: () => void;
}

const stateStyles: Record<
  NodeVisualState,
  { fill: string; stroke: string; text: string; glow: string }
> = {
  unvisited: {
    fill: "#e5e7eb",
    stroke: "#cbd5e1",
    text: "#475569",
    glow: "rgba(148, 163, 184, 0.2)",
  },
  exploring_left: {
    fill: "#bfdbfe",
    stroke: "#60a5fa",
    text: "#0f172a",
    glow: "rgba(59, 130, 246, 0.22)",
  },
  current: {
    fill: "#f59e0b",
    stroke: "#d97706",
    text: "#111827",
    glow: "rgba(245, 158, 11, 0.22)",
  },
  exploring_right: {
    fill: "#c084fc",
    stroke: "#a855f7",
    text: "#1f2937",
    glow: "rgba(168, 85, 247, 0.2)",
  },
  completed: {
    fill: "#86efac",
    stroke: "#22c55e",
    text: "#14532d",
    glow: "rgba(34, 197, 94, 0.22)",
  },
};

const childByOperation: Record<string, "left" | "right" | null> = {
  traverse_left: "left",
  traverse_right: "right",
  enter_function: null,
  visit: null,
  exit_function: null,
};

function collectNodesAndEdges(
  node: TreeNode | null,
  depth: number,
  nodes: Array<{ value: number; depth: number }>,
  edges: Array<[number, number]>,
): void {
  if (!node) {
    return;
  }

  nodes.push({ value: node.val, depth });

  if (node.left) {
    edges.push([node.val, node.left.val]);
    collectNodesAndEdges(node.left, depth + 1, nodes, edges);
  }

  if (node.right) {
    edges.push([node.val, node.right.val]);
    collectNodesAndEdges(node.right, depth + 1, nodes, edges);
  }
}

function assignLeftViewIndex(
  node: TreeNode | null,
  map: Record<number, number>,
  counter: { value: number },
): void {
  if (!node) {
    return;
  }

  assignLeftViewIndex(node.left, map, counter);
  map[node.val] = counter.value;
  counter.value += 1;
  assignLeftViewIndex(node.right, map, counter);
}

function buildAutoPositions(root: TreeNode): Record<number, NodePosition> {
  const nodes: Array<{ value: number; depth: number }> = [];
  const edges: Array<[number, number]> = [];
  collectNodesAndEdges(root, 0, nodes, edges);

  const leftviewIndex: Record<number, number> = {};
  assignLeftViewIndex(root, leftviewIndex, { value: 0 });

  const nodeCount = nodes.length;
  const maxDepth = nodes.reduce((max, node) => Math.max(max, node.depth), 0);

  const viewWidth = 380;
  const viewHeight = 240;
  const minX = 40;
  const maxX = viewWidth - 40;
  const minY = 40;
  const maxY = viewHeight - 34;

  const xStep = nodeCount > 1 ? (maxX - minX) / (nodeCount - 1) : 0;
  const yStep = maxDepth > 0 ? (maxY - minY) / maxDepth : 0;

  const positions: Record<number, NodePosition> = {};
  nodes.forEach((node) => {
    positions[node.value] = {
      x: minX + leftviewIndex[node.value] * xStep,
      y: minY + node.depth * yStep,
    };
  });

  return positions;
}

function getConnectorPoints(
  from: { x: number; y: number },
  to: { x: number; y: number },
  nodeRadius = 20,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy) || 1;
  const ux = dx / distance;
  const uy = dy / distance;

  return {
    x1: from.x + ux * nodeRadius,
    y1: from.y + uy * nodeRadius,
    x2: to.x - ux * nodeRadius,
    y2: to.y - uy * nodeRadius,
  };
}

function fitPositionsToViewport(
  positions: Record<number, NodePosition>,
  nodeValues: number[],
  viewWidth: number,
  viewHeight: number,
  nodeRadius: number,
): Record<number, NodePosition> {
  if (nodeValues.length === 0) {
    return positions;
  }

  const points = nodeValues
    .map((value) => ({ value, point: positions[value] }))
    .filter((entry): entry is { value: number; point: NodePosition } => Boolean(entry.point));

  if (points.length === 0) {
    return positions;
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  points.forEach(({ point }) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });

  const boundsWidth = Math.max(1, maxX - minX);
  const boundsHeight = Math.max(1, maxY - minY);
  const safePadding = nodeRadius + 8;
  const availableWidth = Math.max(1, viewWidth - safePadding * 2);
  const availableHeight = Math.max(1, viewHeight - safePadding * 2);

  const scale = Math.min(availableWidth / boundsWidth, availableHeight / boundsHeight, 1);

  const scaledWidth = boundsWidth * scale;
  const scaledHeight = boundsHeight * scale;
  const offsetX = (viewWidth - scaledWidth) / 2;
  const offsetY = (viewHeight - scaledHeight) / 2;

  const fitted: Record<number, NodePosition> = {};
  points.forEach(({ value, point }) => {
    fitted[value] = {
      x: offsetX + (point.x - minX) * scale,
      y: offsetY + (point.y - minY) * scale,
    };
  });

  return {
    ...positions,
    ...fitted,
  };
}

export function TreePanel({
  root,
  currentOperation,
  operationBadge,
  nodeStates,
  activeStep,
  customNodePositions,
  onOpenTreeSetup,
}: TreePanelProps) {
  const viewWidth = 380;
  const viewHeight = 240;
  const nodeRadius = 20;

  const nodes: Array<{ value: number; depth: number }> = [];
  const edges: Array<[number, number]> = [];
  collectNodesAndEdges(root, 0, nodes, edges);

  const autoPositions = buildAutoPositions(root);
  const mergedPositions: Record<number, NodePosition> = {
    ...autoPositions,
    ...customNodePositions,
  };

  const nodeValues = nodes.map((node) => node.value);
  const positions = fitPositionsToViewport(
    mergedPositions,
    nodeValues,
    viewWidth,
    viewHeight,
    nodeRadius,
  );

  const sourceNode = activeStep?.node?.val;
  const direction = activeStep ? childByOperation[activeStep.type] : null;
  const targetNode =
    sourceNode && direction
      ? direction === "left"
        ? activeStep?.node?.left?.val
        : activeStep?.node?.right?.val
      : undefined;

  const activeEdgeKey =
    typeof sourceNode === "number" && typeof targetNode === "number"
      ? `${sourceNode}-${targetNode}`
      : null;

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
          <span className="rounded-full bg-gradient-to-r from-teal-700 to-teal-400 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] text-white">
            {operationBadge}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-gradient-to-b from-[#fcfffe] to-[#f6f8fb] p-2">
        <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="h-full w-full">
          <defs>
            <marker
              id="tree-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L8,4 L0,8 z" fill="#94a3b8" />
            </marker>
            <marker
              id="tree-arrow-active"
              markerWidth="9"
              markerHeight="9"
              refX="8"
              refY="4.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L9,4.5 L0,9 z" fill="#14b8a6" />
            </marker>
          </defs>

          {edges.map(([from, to]) => (
            <g key={`${from}-${to}`}>
              {(() => {
                const connector = getConnectorPoints(
                  positions[from],
                  positions[to],
                );

                return (
                  <>
                    <line
                      x1={connector.x1}
                      y1={connector.y1}
                      x2={connector.x2}
                      y2={connector.y2}
                      stroke="#cbd5e1"
                      strokeOpacity="0.95"
                      strokeWidth="2.2"
                      markerEnd="url(#tree-arrow)"
                    />
                    {activeEdgeKey === `${from}-${to}` ? (
                      <line
                        x1={connector.x1}
                        y1={connector.y1}
                        x2={connector.x2}
                        y2={connector.y2}
                        stroke="#14b8a6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="8 6"
                        markerEnd="url(#tree-arrow-active)"
                      />
                    ) : null}
                  </>
                );
              })()}
            </g>
          ))}

          {Object.entries(positions)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([value, point]) => {
            const nodeValue = Number(value);
            const nodeState = nodeStates[nodeValue] ?? "unvisited";
            const styles = stateStyles[nodeState];
            const isCompleted = nodeState === "completed";

            return (
              <g key={value}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="27"
                  fill={styles.glow}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="20"
                  fill={styles.fill}
                  stroke={styles.stroke}
                  strokeWidth="2.2"
                />
                <text
                  x={point.x}
                  y={point.y + 5}
                  textAnchor="middle"
                  fill={styles.text}
                  className="text-sm font-extrabold"
                >
                  {value}
                </text>
                {isCompleted ? (
                  <text
                    x={point.x + 22}
                    y={point.y - 18}
                    textAnchor="middle"
                    className="fill-emerald-600 text-sm font-black"
                  >
                    ✓
                  </text>
                ) : null}
              </g>
            );
          })}
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



