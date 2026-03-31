import type { ExecutionStep, NodeVisualState } from "../types";

interface TreePanelProps {
  currentOperation: string;
  operationBadge: string;
  nodeStates: Record<number, NodeVisualState>;
  activeStep: ExecutionStep | undefined;
}

const positions = {
  1: { x: 190, y: 52 },
  2: { x: 110, y: 122 },
  3: { x: 270, y: 122 },
  4: { x: 80, y: 190 },
  5: { x: 160, y: 190 },
  6: { x: 300, y: 190 },
};

const edges: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [3, 6],
];

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

export function TreePanel({
  currentOperation,
  operationBadge,
  nodeStates,
  activeStep,
}: TreePanelProps) {
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
    <section className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_2px_10px_rgba(17,24,39,0.06)]">
      <div className="mb-0.5 flex items-center justify-between">
        <h2 className="text-[13px] font-extrabold uppercase tracking-[0.01em] text-slate-700">
          Tree Structure
        </h2>
        <span className="rounded-full bg-gradient-to-r from-teal-700 to-teal-400 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.04em] text-white">
          {operationBadge}
        </span>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-gradient-to-b from-[#fcfffe] to-[#f6f8fb] p-2">
        <svg viewBox="0 0 380 240" className="h-full w-full">
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
                  positions[from as keyof typeof positions],
                  positions[to as keyof typeof positions],
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

          {Object.entries(positions).map(([value, point]) => {
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
