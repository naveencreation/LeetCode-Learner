import Link from "next/link";

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
};

const NODES: TreeNodePoint[] = [
  { id: 1, x: 160, y: 36 },
  { id: 2, x: 96, y: 90 },
  { id: 3, x: 224, y: 90 },
  { id: 4, x: 60, y: 152 },
  { id: 5, x: 132, y: 152 },
  { id: 6, x: 192, y: 152 },
  { id: 7, x: 260, y: 152 },
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

function TreeDiagram() {
  return (
    <svg viewBox="0 0 320 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="max-w-[320px]">
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
            stroke="#1D9E75"
            strokeWidth="1.5"
          />
        );
      })}
      {NODES.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r="20"
            fill="#E1F5EE"
            stroke="#1D9E75"
            strokeWidth="1.5"
          />
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fontSize="14"
            fontWeight="500"
            fill="#085041"
          >
            {node.id}
          </text>
        </g>
      ))}
      <text x="160" y="195" textAnchor="middle" fontSize="12" fill="#6c7086">
        Result: [4, 2, 5, 1, 6, 3, 7]
      </text>
    </svg>
  );
}

const DRY_RUN_STEPS = [
  { num: 1, node: 4, what: "No left child. Visit 4. No right child. Done.", highlight: false },
  { num: 2, node: 2, what: "Left (4) already done. Visit 2. Now go right → 5.", highlight: true },
  { num: 3, node: 5, what: "No left child. Visit 5. No right child. Done.", highlight: false },
  { num: 4, node: 1, what: "Entire left subtree (4,2,5) done. Visit root 1. Go right → 3.", highlight: true },
  { num: 5, node: 6, what: "No left child. Visit 6. No right child. Done.", highlight: false },
  { num: 6, node: 3, what: "Left (6) done. Visit 3. Go right → 7.", highlight: true },
  { num: 7, node: 7, what: "No left child. Visit 7. No right child. Done.", highlight: false },
];

const INTERVIEW_ITEMS = [
  {
    title: "Kth smallest in BST",
    desc: "Inorder gives sorted order, so the kth element is the answer.",
  },
  {
    title: "Validate a BST",
    desc: "Check that the inorder sequence is strictly increasing.",
  },
  {
    title: "Convert BST to sorted array",
    desc: "Directly collect inorder result.",
  },
  {
    title: "Recover BST",
    desc: "Find the two swapped nodes by spotting where inorder order breaks.",
  },
];

export default function InorderGuidePage() {
  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,#fef3c7_0%,transparent_50%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Binary Tree · Traversal</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/inorder-traversal"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                Visual Editor
              </Link>
              <Link
                href="/problems/topics/trees"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                Tree Problems
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Inorder Traversal</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            Visit nodes in Left → Root → Right order. For a BST, this gives you a sorted sequence.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Recursion
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1.5 text-xs font-medium text-purple-700">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              DFS
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Interview Essential
            </span>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-10" />

        {/* 01 - Task */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">01</span>
            <h2 className="text-xl font-semibold text-slate-900">The Task</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[15px] leading-relaxed text-slate-700 mb-3">
              Given the <span className="font-medium text-slate-900">root</span> of a binary tree, return a list of all node values in <span className="font-medium text-emerald-700">inorder sequence</span>.
            </p>
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Input:</span>
                <span className="font-mono text-slate-700">binary tree</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-400"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Output:</span>
                <span className="font-mono text-emerald-700 font-medium">[4, 2, 5, 1, 6, 3, 7]</span>
              </div>
            </div>
          </div>
        </div>

        {/* 02 - Rule */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">02</span>
            <h2 className="text-xl font-semibold text-slate-900">The Rule</h2>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white shadow-lg shadow-emerald-500/20">
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
            <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/10" />
            <div className="relative">
              <p className="text-2xl font-semibold tracking-wide mb-2">Left → Root → Right</p>
              <p className="text-emerald-100 text-sm leading-relaxed">
                At every node: go as far left as possible, visit the current node, then explore the right subtree.
              </p>
            </div>
          </div>
        </div>

        {/* 03 - Intuition */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">03</span>
            <h2 className="text-xl font-semibold text-slate-900">The Intuition</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
              <div className="mb-3 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-amber-600"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                <span className="text-sm font-semibold text-amber-800">Analogy</span>
              </div>
              <p className="text-[14px] leading-relaxed text-amber-900/80">
                Think of a bookshelf — books sorted left to right. You always finish the left shelf before reading the current book, then move right.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
              <div className="mb-3 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-600"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-sm font-semibold text-emerald-800">Superpower</span>
              </div>
              <p className="text-[14px] leading-relaxed text-emerald-900/80">
                Inorder of a <strong>Binary Search Tree</strong> always produces values in <strong>ascending sorted order</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 04 - Mental Model */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">04</span>
            <h2 className="text-xl font-semibold text-slate-900">Mental Model</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="space-y-0">
              <div className="flex gap-4 py-4 border-b border-slate-100">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-semibold text-white shadow-sm">1</div>
                <div>
                  <p className="text-[15px] font-medium text-slate-800 mb-0.5">Go Left</p>
                  <p className="text-[13px] text-slate-500">Keep going left until you hit <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600">None</code> — the recursion dives to the leftmost leaf.</p>
                </div>
              </div>
              <div className="flex gap-4 py-4 border-b border-slate-100">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-semibold text-white shadow-sm">2</div>
                <div>
                  <p className="text-[15px] font-medium text-slate-800 mb-0.5">Visit Current</p>
                  <p className="text-[13px] text-slate-500">Only after the entire left subtree is done, append this node's value.</p>
                </div>
              </div>
              <div className="flex gap-4 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-semibold text-white shadow-sm">3</div>
                <div>
                  <p className="text-[15px] font-medium text-slate-800 mb-0.5">Go Right</p>
                  <p className="text-[13px] text-slate-500">The right subtree is a new problem — apply the same Left → Root → Right rule.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 05 - Dry Run */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">05</span>
            <h2 className="text-xl font-semibold text-slate-900">Dry Run</h2>
          </div>

          <div className="mb-6 flex justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <TreeDiagram />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-[48px_100px_1fr] bg-slate-50/80">
              <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">Step</div>
              <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-r border-slate-200">Node</div>
              <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">What Happens</div>
            </div>
            {DRY_RUN_STEPS.map((step) => (
              <div
                key={step.num}
                className={`grid grid-cols-[48px_100px_1fr] border-t border-slate-100 transition-colors ${step.highlight ? "bg-emerald-50/60" : "bg-white"}`}
              >
                <div className="px-4 py-3.5 text-sm text-slate-400 border-r border-slate-100">{step.num}</div>
                <div className="px-4 py-3.5 border-r border-slate-100">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                    {step.node}
                  </span>
                </div>
                <div className="px-4 py-3.5 text-[13px] leading-relaxed text-slate-600">{step.what}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 06 - Code */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">06</span>
            <h2 className="text-xl font-semibold text-slate-900">Code</h2>
          </div>
          <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg shadow-slate-900/20">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[11px] text-slate-400 font-mono">solution.py</span>
            </div>
            <div className="p-5 font-mono text-[13.5px] leading-8">
              <div><span className="text-[#cba6f7]">def</span> <span className="text-[#89b4fa]">inorder</span><span className="text-[#cdd6f4]">(node, result):</span></div>
              <div><span className="text-[#cdd6f4]">    </span><span className="text-[#cba6f7]">if</span><span className="text-[#cdd6f4]"> node </span><span className="text-[#cba6f7]">is</span><span className="text-[#cdd6f4]"> </span><span className="text-[#cba6f7]">None</span><span className="text-[#cdd6f4]">: </span><span className="text-[#cba6f7]">return</span> <span className="ml-2 text-[#6c7086] italic"># base case</span></div>
              <div><span className="text-[#cdd6f4]">    </span><span className="text-[#89b4fa]">inorder</span><span className="text-[#cdd6f4]">(node.left, result)  </span><span className="text-[#6c7086] italic"># 1. go left</span></div>
              <div><span className="text-[#cdd6f4]">    result.</span><span className="text-[#89b4fa]">append</span><span className="text-[#cdd6f4]">(node.val)      </span><span className="text-[#6c7086] italic"># 2. visit</span></div>
              <div><span className="text-[#cdd6f4]">    </span><span className="text-[#89b4fa]">inorder</span><span className="text-[#cdd6f4]">(node.right, result) </span><span className="text-[#6c7086] italic"># 3. go right</span></div>
            </div>
          </div>
        </div>

        {/* 07 - Complexity */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">07</span>
            <h2 className="text-xl font-semibold text-slate-900">Complexity</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 border border-emerald-200/60">
              <div className="absolute top-3 right-3 h-16 w-16 rounded-full bg-emerald-200/40 blur-xl" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-600 mb-1">Time</p>
                <p className="text-3xl font-mono font-semibold text-emerald-800 mb-2">O(n)</p>
                <p className="text-[13px] leading-relaxed text-emerald-700/80">Every node visited exactly once.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 border border-purple-200/60">
              <div className="absolute top-3 right-3 h-16 w-16 rounded-full bg-purple-200/40 blur-xl" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-purple-600 mb-1">Space</p>
                <p className="text-3xl font-mono font-semibold text-purple-800 mb-2">O(h)</p>
                <p className="text-[13px] leading-relaxed text-purple-700/80">Recursion stack = tree height. Balanced: log n. Skewed: n.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 08 - Interview */}
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">08</span>
            <h2 className="text-xl font-semibold text-slate-900">Interview Questions</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {INTERVIEW_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl p-4 transition-colors hover:bg-slate-50/50">
                <div className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-slate-800">{item.title}</p>
                  <p className="text-[13px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to see it in action?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer to watch the recursion stack live.</p>
            </div>
            <Link
              href="/problems/binary-tree/inorder-traversal"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25"
            >
              Open Visualizer
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}