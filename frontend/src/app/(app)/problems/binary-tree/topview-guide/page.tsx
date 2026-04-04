import Link from "next/link";

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
  hd: number;
};

const SAMPLE_TREE_NODES: TreeNodePoint[] = [
  { id: 1, x: 170, y: 36, hd: 0 },
  { id: 2, x: 90, y: 92, hd: -1 },
  { id: 3, x: 250, y: 92, hd: 1 },
  { id: 4, x: 56, y: 148, hd: -2 },
  { id: 5, x: 122, y: 148, hd: 0 },
  { id: 6, x: 284, y: 148, hd: 2 },
];

const SAMPLE_TREE_EDGES: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [3, 6],
];

const TOP_VIEW_RESULT = [4, 2, 1, 3, 6];

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

function TreeDiagram({ topViewNodes }: { topViewNodes: number[] }) {
  const topViewNodeSet = new Set(topViewNodes);

  return (
    <svg viewBox="0 0 340 200" className="h-[220px] w-full rounded-xl border border-orange-200 bg-white p-3">
      {[ -2, -1, 0, 1, 2 ].map((hd, index) => {
        const x = 46 + index * 62;
        return (
          <g key={`hd-${hd}`}>
            <line x1={x} y1={24} x2={x} y2={166} stroke="#fde68a" strokeWidth="1.5" strokeDasharray="5 5" />
            <text x={x} y={16} textAnchor="middle" className="fill-slate-500 text-[10px] font-bold">
              {hd}
            </text>
          </g>
        );
      })}

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
        const isTopViewNode = topViewNodeSet.has(node.id);

        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="17"
              fill={isTopViewNode ? "#f59e0b" : "#ffffff"}
              stroke={isTopViewNode ? "#d97706" : "#cbd5e1"}
              strokeWidth="2.2"
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className={`text-sm font-extrabold ${isTopViewNode ? "fill-slate-900" : "fill-slate-700"}`}
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
  popped,
  hd,
  action,
  mapState,
}: {
  popped: number;
  hd: number;
  action: string;
  mapState: string;
}) {
  return (
    <div className="rounded-xl border border-orange-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-slate-500">Pop {popped}</p>
        <p className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">hd={hd}</p>
      </div>
      <div className="grid gap-1 text-xs font-semibold text-slate-700">
        <p>{action}</p>
        <p>Map: {mapState}</p>
      </div>
    </div>
  );
}

export default function TopViewGuidePage() {
  return (
    <section className="mx-auto max-w-6xl space-y-4 rounded-2xl border border-orange-200 bg-[linear-gradient(140deg,#fff7ed_0%,#fffbeb_55%,#fffbf5_100%)] p-4 shadow-[0_14px_38px_rgba(120,53,15,0.14)] md:p-6">
      <header className="rounded-xl border border-orange-200 bg-white/85 p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.06em] text-orange-700">Easy Read</p>
        <h1 className="mt-1 text-2xl font-black tracking-[-0.02em] text-slate-900 md:text-3xl">
          Top View of Binary Tree
        </h1>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          Think of looking at the tree from above. For each horizontal distance (HD), keep only the first node seen in BFS.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/problems/binary-tree/top-view-of-binary-tree"
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Open Interactive Visualizer
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
          <h2 className="text-base font-extrabold text-slate-900">1) What is Top View?</h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Top view keeps one node per HD: whichever node appears first while processing level-order.
          </p>
          <div className="mt-3">
            <TreeDiagram topViewNodes={TOP_VIEW_RESULT} />
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500">Top view: [{TOP_VIEW_RESULT.join(", ")}]</p>
        </article>

        <article className="rounded-xl border border-orange-200 bg-white p-4">
          <h2 className="text-base font-extrabold text-slate-900">2) BFS + HD Trick</h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Traverse with queue of (node, hd). Record first node for each hd only once.
          </p>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
            pseudo:
            <pre className="mt-2 overflow-x-auto text-[11px] leading-relaxed text-slate-800">
{`queue = [(root, 0)]
first = {}
while queue:
  node, hd = queue.pop(0)
  if hd not in first:
    first[hd] = node.val
  if node.left: queue.append((node.left, hd - 1))
  if node.right: queue.append((node.right, hd + 1))
return [first[k] for k in sorted(first)]`}
            </pre>
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-orange-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">3) Step Snapshot</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          First hit at each HD gets locked. Later nodes at same HD are ignored.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <QueueStep popped={1} hd={0} action="capture (first hit)" mapState="{0: 1}" />
          <QueueStep popped={2} hd={-1} action="capture (first hit)" mapState="{-1: 2, 0: 1}" />
          <QueueStep popped={5} hd={0} action="skip (already seen)" mapState="{-1: 2, 0: 1, 1: 3}" />
        </div>
      </article>

      <article className="rounded-xl border border-orange-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-900">4) Complexity</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-emerald-700">Time</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(n)</p>
            <p className="text-xs font-semibold text-slate-600">Each node is dequeued once.</p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.04em] text-sky-700">Space</p>
            <p className="mt-1 text-sm font-bold text-slate-800">O(n)</p>
            <p className="text-xs font-semibold text-slate-600">Queue + map can both grow with node count.</p>
          </div>
        </div>
      </article>
    </section>
  );
}
