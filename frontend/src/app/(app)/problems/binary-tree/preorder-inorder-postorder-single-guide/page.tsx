import Link from "next/link";
import { ProblemFocusHeader } from "@/components/problem-focus-header";

import { binaryTreeProblemData } from "@/features/binary-tree/problemData";

const problem =
  binaryTreeProblemData["preorder-inorder-postorder-in-a-single-traversal"];

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

function TreeDiagram({ highlighted }: { highlighted: number[] }) {
  return (
    <svg viewBox="0 0 340 190" className="h-[220px] w-full rounded-xl border border-teal-200 bg-white p-3">
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
        const isHighlighted = highlighted.includes(node.id);

        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="17"
              fill={isHighlighted ? "#14b8a6" : "#ffffff"}
              stroke={isHighlighted ? "#0f766e" : "#cbd5e1"}
              strokeWidth="2.2"
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className={`text-sm font-extrabold ${isHighlighted ? "fill-white" : "fill-slate-700"}`}
            >
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const sampleSteps = [
  {
    step: "Pop (1,1)",
    action: "PRE add 1, push (1,2), push (2,1)",
    pre: "[1]",
    ino: "[]",
    post: "[]",
  },
  {
    step: "Pop (2,1)",
    action: "PRE add 2, push (2,2), push (4,1)",
    pre: "[1,2]",
    ino: "[]",
    post: "[]",
  },
  {
    step: "Pop (4,1)",
    action: "PRE add 4, push (4,2)",
    pre: "[1,2,4]",
    ino: "[]",
    post: "[]",
  },
  {
    step: "Pop (4,2)",
    action: "IN add 4, push (4,3)",
    pre: "[1,2,4]",
    ino: "[4]",
    post: "[]",
  },
  {
    step: "Pop (4,3)",
    action: "POST add 4",
    pre: "[1,2,4]",
    ino: "[4]",
    post: "[4]",
  },
  {
    step: "Continue similarly",
    action: "Complete states for all nodes",
    pre: "[1,2,4,5,3,6,7]",
    ino: "[4,2,5,1,6,3,7]",
    post: "[4,5,2,6,7,3,1]",
  },
] as const;

export default function PreInPostSingleGuidePage() {
  return (
    <section className="w-full space-y-4 bg-[linear-gradient(140deg,#ecfeff_0%,#f0fdfa_55%,#f8fafc_100%)] p-4 md:p-6">
      <ProblemFocusHeader
        title={problem.title}
        subtitle={problem.intuition}
        extraActions={
          <Link
            href="/problems/binary-tree/preorder-inorder-postorder-in-a-single-traversal"
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Open Visualizer
          </Link>
        }
        stats={[]}
        backLabel="Back To Tree Problems"
      />

      <article className="rounded-xl border border-teal-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Approach Summary</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm font-semibold text-slate-700">
          <li>Use one stack that stores tuple (node, state).</li>
          <li>State 1 means PRE: append node to preorder, then re-push same node with state 2.</li>
          <li>State 2 means IN: append node to inorder, then re-push same node with state 3.</li>
          <li>State 3 means POST: append node to postorder and finish that node.</li>
          <li>Children always enter with state 1, so each node flows PRE -&gt; IN -&gt; POST correctly.</li>
        </ol>
      </article>

      <article className="rounded-xl border border-teal-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Important Notes</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-cyan-700">State 1</p>
            <p className="mt-1 text-sm font-bold text-slate-800">Preorder work</p>
            <p className="text-xs font-semibold text-slate-600">Record node in Pre, schedule state 2, then move left.</p>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-violet-700">State 2</p>
            <p className="mt-1 text-sm font-bold text-slate-800">Inorder work</p>
            <p className="text-xs font-semibold text-slate-600">Record node in In, schedule state 3, then move right.</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-emerald-700">State 3</p>
            <p className="mt-1 text-sm font-bold text-slate-800">Postorder work</p>
            <p className="text-xs font-semibold text-slate-600">Record node in Post, no re-push needed.</p>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-teal-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Example Tree and Final Outputs</h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div>
            <TreeDiagram highlighted={[1, 2, 3, 4, 5, 6, 7]} />
          </div>
          <div className="grid content-start gap-2">
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-cyan-700">Preorder</p>
              <p className="mt-1 text-sm font-bold text-slate-800">[1, 2, 4, 5, 3, 6, 7]</p>
            </div>
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-violet-700">Inorder</p>
              <p className="mt-1 text-sm font-bold text-slate-800">[4, 2, 5, 1, 6, 3, 7]</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-emerald-700">Postorder</p>
              <p className="mt-1 text-sm font-bold text-slate-800">[4, 5, 2, 6, 7, 3, 1]</p>
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-teal-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Dry Run Snapshot (Core Steps)</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          Sample tree: 1 as root, 2/3 children, and 4/5 under 2, 6/7 under 3.
        </p>
        <div className="mt-3 grid gap-2">
          {sampleSteps.map((item) => (
            <div key={item.step} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-slate-600">{item.step}</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{item.action}</p>
              <div className="mt-2 grid gap-2 text-xs font-semibold text-slate-700 md:grid-cols-3">
                <p className="rounded border border-cyan-200 bg-cyan-50 px-2 py-1">pre: {item.pre}</p>
                <p className="rounded border border-violet-200 bg-violet-50 px-2 py-1">in: {item.ino}</p>
                <p className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1">post: {item.post}</p>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-teal-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Edge Cases and Pitfalls</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-amber-700">Edge Cases</p>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-sm font-semibold text-slate-700">
              <li>Empty tree: return [], [], [] immediately.</li>
              <li>Single node: all three arrays contain that one node.</li>
              <li>Skewed tree: logic still works because stack drives order.</li>
            </ul>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-rose-700">Common Mistakes</p>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-sm font-semibold text-slate-700">
              <li>Pushing child before re-pushing current node with next state.</li>
              <li>Forgetting to change state 2 to state 3 before moving right.</li>
              <li>Appending to wrong output array for a given state.</li>
            </ul>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-teal-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Interview Notes</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm font-semibold text-slate-700">
          <li>This is iterative DFS that simulates recursion using explicit states.</li>
          <li>Each node is popped up to three times, but total work remains linear.</li>
          <li>Auxiliary space is O(h), where h is tree height, worst case O(n).</li>
          <li>Useful when interviewer asks to avoid recursion stack overflow risk.</li>
        </ol>
      </article>

      <article className="rounded-xl border border-teal-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Python Solution
        </h2>
        <pre className="overflow-x-auto rounded-lg border bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <code>{problem.pythonCode}</code>
        </pre>
      </article>

      <article className="rounded-xl border border-teal-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">Complexity</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <div className="rounded-lg border border-teal-200 bg-teal-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-teal-700">Time</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(n)</p>
            <p className="text-xs font-semibold text-slate-600">Each state transition is constant work over all nodes.</p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-sky-700">Space</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(h), worst O(n)</p>
            <p className="text-xs font-semibold text-slate-600">Stack depth follows tree height for DFS style traversal.</p>
          </div>
        </div>
      </article>
    </section>
  );
}

