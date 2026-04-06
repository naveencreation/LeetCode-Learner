import Link from "next/link";
import { ProblemFocusHeader } from "@/components/problem-focus-header";

import { binaryTreeProblemData } from "@/features/binary-tree/problemData";

const problem = binaryTreeProblemData["vertical-order-traversal"];

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
  col: number;
};

const NODES: TreeNodePoint[] = [
  { id: 1, x: 170, y: 36, col: 0 },
  { id: 2, x: 90, y: 92, col: -1 },
  { id: 3, x: 250, y: 92, col: 1 },
  { id: 4, x: 56, y: 148, col: -2 },
  { id: 5, x: 122, y: 148, col: 0 },
  { id: 6, x: 220, y: 148, col: 0 },
  { id: 7, x: 284, y: 148, col: 2 },
];

const EDGES: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [3, 6],
  [3, 7],
];

const RESULT_COLUMNS = [
  { col: -2, values: [4] },
  { col: -1, values: [2] },
  { col: 0, values: [1, 5, 6] },
  { col: 1, values: [3] },
  { col: 2, values: [7] },
] as const;

function nodeById(id: number): TreeNodePoint {
  const node = NODES.find((item) => item.id === id);
  if (!node) {
    throw new Error(`Missing node ${id}`);
  }

  return node;
}

function TreeDiagram() {
  return (
    <svg viewBox="0 0 340 190" className="h-[220px] w-full rounded-xl border border-orange-200 bg-white p-3">
      {[ -2, -1, 0, 1, 2 ].map((col, index) => {
        const x = 46 + index * 62;
        return (
          <g key={`col-${col}`}>
            <line x1={x} y1={18} x2={x} y2={174} stroke="#fecaca" strokeWidth="1.5" strokeDasharray="5 5" />
            <text x={x} y={12} textAnchor="middle" className="fill-slate-500 text-[10px] font-bold">
              {col}
            </text>
          </g>
        );
      })}

      {EDGES.map(([from, to]) => {
        const source = nodeById(from);
        const target = nodeById(to);
        return (
          <line
            key={`${from}-${to}`}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke="#cbd5e1"
            strokeWidth="2"
          />
        );
      })}

      {NODES.map((node) => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r="17" fill="#f97316" stroke="#c2410c" strokeWidth="2.2" />
          <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-white text-sm font-extrabold">
            {node.id}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function VerticalOrderGuidePage() {
  return (
    <section className="w-full space-y-4 bg-[linear-gradient(140deg,#fff7ed_0%,#fffbeb_55%,#fefce8_100%)] p-4 md:p-6">
      <ProblemFocusHeader
        title={problem.title}
        subtitle={problem.intuition}
        extraActions={
          <Link
            href="/problems/binary-tree/vertical-order-traversal"
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Open Vertical Order Visualizer
          </Link>
        }
        stats={[]}
        backLabel="Back To Tree Problems"
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <article className="rounded-xl border border-orange-200 bg-white p-4">
          <h2 className="text-base font-extrabold text-slate-900">Concept</h2>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            Assign each node a column index (horizontal distance) and row (depth).
            Group nodes by column. For each column, sort by row first, then value.
          </p>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-800">
{`queue = [(root, row=0, col=0)]
cols = map(col -> list of (row, value))
while queue:
  node, row, col = pop_front(queue)
  cols[col].append((row, node.val))
  if node.left:  push(node.left,  row+1, col-1)
  if node.right: push(node.right, row+1, col+1)
for each col in sorted(cols):
  sort cols[col] by (row, value)
  append values to answer`}
            </pre>
          </div>
        </article>

        <article className="rounded-xl border border-orange-200 bg-white p-4">
          <h2 className="text-base font-extrabold text-slate-900">Tree + Columns</h2>
          <TreeDiagram />
          <p className="mt-2 text-xs font-semibold text-slate-600">
            Final result: {JSON.stringify(RESULT_COLUMNS.map((column) => column.values))}
          </p>
        </article>
      </div>

      <article className="rounded-xl border border-orange-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Important Notes</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold text-slate-700">
          <li>Use BFS so row order is naturally processed level by level.</li>
          <li>Still sort each column bucket by (row, value) for strict output rules.</li>
          <li>Left child shifts column by -1, right child shifts by +1.</li>
          <li>When row and column both match, smaller node value comes first.</li>
        </ul>
      </article>

      <article className="rounded-xl border border-orange-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Column Buckets</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {RESULT_COLUMNS.map((bucket) => (
            <div key={bucket.col} className="rounded-lg border border-orange-200 bg-orange-50 p-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-orange-700">Column {bucket.col}</p>
              <p className="mt-1 text-sm font-bold text-slate-800">[{bucket.values.join(", ")}]</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-orange-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Complexity</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-orange-700">Time</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(n log n)</p>
            <p className="text-xs font-semibold text-slate-600">Sorting buckets dominates after BFS collection.</p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-sky-700">Space</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(n)</p>
            <p className="text-xs font-semibold text-slate-600">Queue + column map together hold all nodes.</p>
          </div>
        </div>
      </article>
    </section>
  );
}

