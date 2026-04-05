import Link from "next/link";

import { binaryTreeProblemData } from "@/features/binary-tree/problemData";

const problem = binaryTreeProblemData["max-width-of-a-binary-tree"];

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
  index: number;
};

const NODES: TreeNodePoint[] = [
  { id: 1, x: 170, y: 36, index: 0 },
  { id: 3, x: 90, y: 94, index: 1 },
  { id: 2, x: 250, y: 94, index: 2 },
  { id: 5, x: 50, y: 152, index: 1 },
  { id: 3, x: 122, y: 152, index: 2 },
  { id: 9, x: 222, y: 152, index: 3 },
  { id: 7, x: 292, y: 152, index: 4 },
];

const EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
];

const LEVEL_SUMMARY = [
  { level: 0, first: 0, last: 0, width: 1 },
  { level: 1, first: 1, last: 2, width: 2 },
  { level: 2, first: 1, last: 4, width: 4 },
] as const;

function nodeById(id: number): TreeNodePoint {
  const node = NODES[id];
  if (!node) {
    throw new Error(`Missing node index ${id}`);
  }

  return node;
}

function TreeDiagram() {
  return (
    <svg viewBox="0 0 340 200" className="h-[220px] w-full rounded-xl border border-teal-200 bg-white p-3">
      {[0, 1, 2, 3, 4].map((heapIndex, idx) => {
        const x = 46 + idx * 62;
        return (
          <g key={`idx-${heapIndex}`}>
            <line x1={x} y1={18} x2={x} y2={182} stroke="#ccfbf1" strokeWidth="1.5" strokeDasharray="5 5" />
            <text x={x} y={12} textAnchor="middle" className="fill-slate-500 text-[10px] font-bold">
              {heapIndex}
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

      {NODES.map((node, id) => {
        const isLevelTwo = node.y >= 140;
        return (
          <g key={`node-${id}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r="17"
              fill={isLevelTwo ? "#0d9488" : "#14b8a6"}
              stroke="#0f766e"
              strokeWidth="2.2"
            />
            <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-white text-sm font-extrabold">
              {node.id}
            </text>
            <text x={node.x} y={node.y + 28} textAnchor="middle" className="fill-slate-500 text-[9px] font-bold">
              i={node.index}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function MaxWidthGuidePage() {
  return (
    <section className="mx-auto max-w-6xl space-y-4 rounded-2xl border border-teal-200 bg-[linear-gradient(140deg,#ecfeff_0%,#f8fafc_55%,#f0fdfa_100%)] p-4 shadow-[0_14px_38px_rgba(13,148,136,0.16)] md:p-6">
      <header className="rounded-xl border border-teal-200 bg-white/90 p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.06em] text-teal-700">Read Here</p>
        <h1 className="mt-1 text-2xl font-black tracking-[-0.02em] text-slate-900 md:text-3xl">{problem.title}</h1>
        <p className="mt-2 text-sm font-semibold text-slate-600">{problem.intuition}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/problems/binary-tree/max-width-of-a-binary-tree"
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Open Max Width Visualizer
          </Link>
          <Link
            href="/problems/topics/trees#problem-list"
            className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 transition hover:bg-teal-100"
          >
            Back To Tree Problems
          </Link>
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        <article className="rounded-xl border border-teal-200 bg-white p-4">
          <h2 className="text-base font-extrabold text-slate-900">Core Idea</h2>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            Run BFS level by level. Treat each node as if it had a heap index. For every level,
            width is <span className="font-extrabold">lastIndex - firstIndex + 1</span>.
          </p>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-800">
{`q = deque([(root, 0)])
ans = 0
while q:
  first = q[0].idx
  last = q[-1].idx
  ans = max(ans, last - first + 1)
  for each node in this level:
    idx = idx - first  # normalize
    push left  as 2*idx + 1
    push right as 2*idx + 2`}
            </pre>
          </div>
        </article>

        <article className="rounded-xl border border-teal-200 bg-white p-4">
          <h2 className="text-base font-extrabold text-slate-900">Tree + Virtual Indices</h2>
          <TreeDiagram />
          <p className="mt-2 text-xs font-semibold text-slate-600">
            Level 2 index span: first=1, last=4, so width = 4.
          </p>
        </article>
      </div>

      <article className="rounded-xl border border-teal-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Why Normalize Index?</h2>
        <p className="mt-2 text-sm font-semibold text-slate-700">
          Raw heap indices can grow exponentially on deep trees. Subtracting first index each level
          keeps values small while preserving relative gaps and width correctness.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm font-semibold text-slate-700">
          <li>Prevents integer blow-up in very deep trees.</li>
          <li>Keeps left/right child formulas unchanged.</li>
          <li>Preserves exact width span for that level.</li>
        </ul>
      </article>

      <article className="rounded-xl border border-teal-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Dry Run Snapshot</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {LEVEL_SUMMARY.map((entry) => (
            <div key={entry.level} className="rounded-lg border border-teal-200 bg-teal-50 p-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-teal-700">Level {entry.level}</p>
              <p className="mt-1 text-xs font-semibold text-slate-700">first = {entry.first}</p>
              <p className="text-xs font-semibold text-slate-700">last = {entry.last}</p>
              <p className="mt-1 text-sm font-bold text-slate-900">width = {entry.width}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-teal-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Complexity</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <div className="rounded-lg border border-teal-200 bg-teal-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-teal-700">Time</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(n)</p>
            <p className="text-xs font-semibold text-slate-600">Each node is processed once in BFS.</p>
          </div>
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-cyan-700">Space</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(w)</p>
            <p className="text-xs font-semibold text-slate-600">Queue holds at most one level, where w is max width.</p>
          </div>
        </div>
      </article>

    </section>
  );
}
