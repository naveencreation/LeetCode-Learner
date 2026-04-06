import Link from "next/link";
import { ProblemFocusHeader } from "@/components/problem-focus-header";

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
};

const NODES: TreeNodePoint[] = [
  { id: 1, x: 170, y: 36 },
  { id: 2, x: 90, y: 92 },
  { id: 3, x: 250, y: 92 },
  { id: 4, x: 56, y: 148 },
  { id: 5, x: 122, y: 148 },
  { id: 6, x: 220, y: 148 },
  { id: 7, x: 284, y: 148 },
];

const EDGES: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [3, 6],
  [3, 7],
];

function nodeById(id: number): TreeNodePoint {
  const node = NODES.find((item) => item.id === id);
  if (!node) {
    throw new Error(`Missing node ${id}`);
  }

  return node;
}

function TreeDiagram({ visited }: { visited: number[] }) {
  return (
    <svg viewBox="0 0 340 190" className="h-[220px] w-full rounded-xl border border-orange-200 bg-white p-3">
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

      {NODES.map((node) => {
        const isVisited = visited.includes(node.id);
        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="17"
              fill={isVisited ? "#22c55e" : "#ffffff"}
              stroke={isVisited ? "#15803d" : "#cbd5e1"}
              strokeWidth="2.2"
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className={`text-sm font-extrabold ${isVisited ? "fill-white" : "fill-slate-700"}`}
            >
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function InorderGuidePage() {
  return (
    <section className="w-full space-y-4 bg-[linear-gradient(140deg,#f0fdf4_0%,#f7fee7_55%,#fffbeb_100%)] p-4 md:p-6">
      <ProblemFocusHeader
        title="Inorder Traversal"
        subtitle="Inorder means: go Left, then Root, then Right. For BSTs, this gives sorted order."
        extraActions={
          <Link
            href="/problems/binary-tree/inorder-traversal"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[12px] font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Open Inorder Visualizer
          </Link>
        }
        stats={[]}
        backLabel="Back To Tree Problems"
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <article className="rounded-xl border border-emerald-200 bg-white p-4">
          <h2 className="text-base font-extrabold text-slate-900">Rule</h2>
          <p className="mt-2 text-sm font-semibold text-slate-700">Traversal order: Left → Root → Right</p>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-800">
{`def inorder(node):
  if not node:
    return
  inorder(node.left)
  visit(node)
  inorder(node.right)`}
            </pre>
          </div>
        </article>

        <article className="rounded-xl border border-emerald-200 bg-white p-4">
          <h2 className="text-base font-extrabold text-slate-900">Example Tree</h2>
          <TreeDiagram visited={[4, 2, 5, 1, 6, 3, 7]} />
          <p className="mt-2 text-xs font-semibold text-slate-600">Inorder sequence: [4, 2, 5, 1, 6, 3, 7]</p>
        </article>
      </div>

      <article className="rounded-xl border border-emerald-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">How to Think</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm font-semibold text-slate-700">
          <li>Keep going left until you cannot.</li>
          <li>Visit the current node.</li>
          <li>Move to right subtree and repeat the same logic.</li>
        </ol>
      </article>

      <article className="rounded-xl border border-emerald-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Complexity</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-emerald-700">Time</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(n)</p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-sky-700">Space</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(h)</p>
          </div>
        </div>
      </article>
    </section>
  );
}

