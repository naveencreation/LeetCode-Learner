import Link from "next/link";
import { ProblemFocusHeader } from "@/components/problem-focus-header";

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
};

const SAMPLE_TREE_NODES: TreeNodePoint[] = [
  { id: 1, x: 170, y: 36 },
  { id: 2, x: 90, y: 92 },
  { id: 3, x: 250, y: 92 },
  { id: 4, x: 56, y: 148 },
  { id: 5, x: 122, y: 148 },
  { id: 6, x: 220, y: 148 },
  { id: 7, x: 284, y: 148 },
];

const SAMPLE_TREE_EDGES: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [3, 6],
  [3, 7],
];

const SAMPLE_TREE_NODE_MAP = new Map<number, TreeNodePoint>(
  SAMPLE_TREE_NODES.map((node) => [node.id, node]),
);

function findNode(nodeId: number): TreeNodePoint {
  const node = SAMPLE_TREE_NODE_MAP.get(nodeId);
  if (!node) {
    throw new Error(`Missing node ${nodeId}`);
  }

  return node;
}

function TreeDiagram({ bottomViewNodes }: { bottomViewNodes: number[] }) {
  const bottomViewNodeSet = new Set(bottomViewNodes);

  return (
    <svg viewBox="0 0 340 190" className="h-[220px] w-full rounded-xl border border-orange-200 bg-white p-3">
      {SAMPLE_TREE_EDGES.map(([from, to]) => {
        const source = findNode(from);
        const target = findNode(to);

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

      {SAMPLE_TREE_NODES.map((node) => {
        const isBottomViewNode = bottomViewNodeSet.has(node.id);

        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="17"
              fill={isBottomViewNode ? "#f59e0b" : "#ffffff"}
              stroke={isBottomViewNode ? "#d97706" : "#cbd5e1"}
              strokeWidth="2.2"
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className={`text-sm font-extrabold ${isBottomViewNode ? "fill-slate-900" : "fill-slate-700"}`}
            >
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function QueueStep({
  level,
  queueBefore,
  chosen,
  queueAfter,
}: {
  level: number;
  queueBefore: number[];
  chosen: number;
  queueAfter: number[];
}) {
  return (
    <div className="rounded-xl border border-orange-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-slate-500">Level {level}</p>
        <p className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">Pick {chosen}</p>
      </div>
      <div className="grid gap-2 text-xs font-semibold text-slate-700">
        <p>Queue before: [{queueBefore.join(", ")}]</p>
        <p>Queue after processing level: [{queueAfter.join(", ")}]</p>
      </div>
    </div>
  );
}

export default function BottomViewGuidePage() {
  return (
    <section className="w-full space-y-4 bg-[linear-gradient(140deg,#fff7ed_0%,#fffbeb_55%,#fffbf5_100%)] p-4 md:p-6">
      <ProblemFocusHeader
        title="Bottom View of Binary Tree"
        subtitle="Think of viewing the tree from below. For each horizontal distance, keep the last node seen in BFS."
        extraActions={
          <Link
            href="/problems/binary-tree/bottom-view-of-binary-tree"
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Open Interactive Visualizer
          </Link>
        }
        stats={[]}
        backLabel="Back To Tree Problems"
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <article className="rounded-xl border border-orange-200 bg-white p-4">
          <h2 className="text-base font-extrabold text-slate-900">1) What is Bottom View?</h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Bottom view keeps one node per horizontal distance (hd): always the latest node seen for that distance.
          </p>
          <div className="mt-3">
            <TreeDiagram bottomViewNodes={[4, 2, 6, 3, 7]} />
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500">Bottom view for this tree: [4, 2, 6, 3, 7]</p>
        </article>

        <article className="rounded-xl border border-orange-200 bg-white p-4">
          <h2 className="text-base font-extrabold text-slate-900">2) BFS + Horizontal Distance</h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">Use a queue (level-order traversal). For each level:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold text-slate-700">
            <li>Pop node with its hd.</li>
            <li>Overwrite map[hd] = node value.</li>
            <li>Push left child with hd - 1 and right child with hd + 1.</li>
          </ul>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
            pseudo:
            <pre className="mt-2 overflow-x-auto text-[11px] leading-relaxed text-slate-800">
{`queue = [(root, 0)]
hd_to_val = {}
while queue:
  node, hd = queue.pop(0)
  hd_to_val[hd] = node.val
  if node.left: queue.append((node.left, hd - 1))
  if node.right: queue.append((node.right, hd + 1))
return [hd_to_val[k] for k in sorted(hd_to_val)]`}
            </pre>
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-orange-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">3) Queue Walkthrough</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          Every dequeue can overwrite one horizontal-distance bucket.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <QueueStep level={0} queueBefore={[1]} chosen={1} queueAfter={[2, 3]} />
          <QueueStep level={1} queueBefore={[2, 3]} chosen={3} queueAfter={[4, 5, 6, 7]} />
          <QueueStep level={2} queueBefore={[4, 5, 6, 7]} chosen={6} queueAfter={[]} />
        </div>
      </article>

      <article className="rounded-xl border border-orange-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">4) Complexity</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-emerald-700">Time</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(n)</p>
            <p className="text-xs font-semibold text-slate-600">Every node is visited once.</p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-sky-700">Space</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(w)</p>
            <p className="text-xs font-semibold text-slate-600">Queue holds one level at a time (w = max width).</p>
          </div>
        </div>
      </article>
    </section>
  );
}

