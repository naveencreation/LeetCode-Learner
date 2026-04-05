import Link from "next/link";

import { binaryTreeProblemData } from "@/features/binary-tree/problemData";

const problem = binaryTreeProblemData["root-to-node-path-in-a-binary-tree"];

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
};

const NODES: TreeNodePoint[] = [
  { id: 1, x: 170, y: 34 },
  { id: 2, x: 92, y: 92 },
  { id: 3, x: 250, y: 92 },
  { id: 4, x: 58, y: 150 },
  { id: 5, x: 170, y: 150 },
  { id: 6, x: 140, y: 206 },
  { id: 7, x: 200, y: 206 },
];

const EDGES: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [5, 6],
  [5, 7],
];

const TARGET = 7;
const PATH = [1, 2, 5, 7];

function nodeById(id: number): TreeNodePoint {
  const node = NODES.find((item) => item.id === id);
  if (!node) {
    throw new Error(`Missing node ${id}`);
  }

  return node;
}

function TreeDiagram() {
  const pathSet = new Set(PATH);

  return (
    <svg viewBox="0 0 340 240" className="h-[240px] w-full rounded-xl border border-orange-200 bg-white p-3">
      {EDGES.map(([from, to]) => {
        const source = nodeById(from);
        const target = nodeById(to);
        const isPathEdge = pathSet.has(from) && pathSet.has(to) && PATH.indexOf(to) === PATH.indexOf(from) + 1;

        return (
          <line
            key={`${from}-${to}`}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={isPathEdge ? "#f97316" : "#cbd5e1"}
            strokeWidth={isPathEdge ? "3" : "2"}
          />
        );
      })}

      {NODES.map((node) => {
        const isPathNode = PATH.includes(node.id);
        const isTarget = node.id === TARGET;

        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="17"
              fill={isPathNode ? "#fb923c" : "#ffffff"}
              stroke={isPathNode ? "#c2410c" : "#cbd5e1"}
              strokeWidth="2.2"
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className={`text-sm font-extrabold ${isPathNode ? "fill-white" : "fill-slate-700"}`}
            >
              {node.id}
            </text>
            {isTarget ? (
              <text x={node.x + 22} y={node.y - 14} className="fill-rose-600 text-xs font-black">target</text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export default function RootToNodeGuidePage() {
  return (
    <section className="mx-auto max-w-6xl space-y-4 rounded-2xl border border-orange-200 bg-[linear-gradient(140deg,#fff7ed_0%,#fffbeb_55%,#fefce8_100%)] p-4 shadow-[0_14px_38px_rgba(194,65,12,0.15)] md:p-6">
      <header className="rounded-xl border border-orange-200 bg-white/90 p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.06em] text-orange-700">Read Here</p>
        <h1 className="mt-1 text-2xl font-black tracking-[-0.02em] text-slate-900 md:text-3xl">{problem.title}</h1>
        <p className="mt-2 text-sm font-semibold text-slate-600">{problem.intuition}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/problems/binary-tree/root-to-node-path-in-a-binary-tree"
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Open Root To Node Visualizer
          </Link>
          <Link
            href="/problems/topics/trees#problem-list"
            className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 transition hover:bg-orange-100"
          >
            Back To Tree Problems
          </Link>
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        <article className="rounded-xl border border-orange-200 bg-white p-4">
          <h2 className="text-base font-extrabold text-slate-900">Core Idea</h2>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            Use DFS with backtracking. Add node to path when entering. If target is found, keep path.
            If both subtrees fail, pop node from path and return false.
          </p>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-800">
{`def dfs(node):
  if node is None: return False
  path.append(node.val)
  if node.val == target: return True
  if dfs(node.left): return True
  if dfs(node.right): return True
  path.pop()      # backtrack
  return False`}
            </pre>
          </div>
        </article>

        <article className="rounded-xl border border-orange-200 bg-white p-4">
          <h2 className="text-base font-extrabold text-slate-900">Example (Target = 7)</h2>
          <TreeDiagram />
          <p className="mt-2 text-xs font-semibold text-slate-600">Output Path: [{PATH.join(", ")}]</p>
        </article>
      </div>

      <article className="rounded-xl border border-orange-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Step-by-Step Flow</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm font-semibold text-slate-700">
          <li>Visit 1, path becomes [1].</li>
          <li>Go left to 2, path becomes [1, 2].</li>
          <li>Try 4, not target and dead end, backtrack to [1, 2].</li>
          <li>Go right to 5, path becomes [1, 2, 5].</li>
          <li>Try 6, fail, backtrack to [1, 2, 5].</li>
          <li>Try 7, success, return true all the way up.</li>
        </ol>
      </article>

      <article className="rounded-xl border border-orange-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Important Notes</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold text-slate-700">
          <li>Path array always stores current recursion route.</li>
          <li>Backtracking pop is mandatory to remove wrong branches.</li>
          <li>As soon as target is found, recursion should short-circuit with true.</li>
          <li>If target does not exist, answer is empty path.</li>
        </ul>
      </article>

      <article className="rounded-xl border border-orange-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Complexity</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-orange-700">Time</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(n)</p>
            <p className="text-xs font-semibold text-slate-600">Each node is visited at most once.</p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-sky-700">Space</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(h)</p>
            <p className="text-xs font-semibold text-slate-600">Recursion depth and current path size follow tree height.</p>
          </div>
        </div>
      </article>
    </section>
  );
}
