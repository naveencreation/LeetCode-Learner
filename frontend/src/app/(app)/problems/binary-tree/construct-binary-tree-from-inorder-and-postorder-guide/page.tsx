"use client";

import Link from "next/link";
import { useState } from "react";

type Stage = "root" | "partial" | "final";

type SplitStep = {
  step: number;
  postorderPointer: number;
  pickedRoot: number;
  inorderRange: string;
  leftRange: string;
  rightRange: string;
};

type TraceRow = {
  call: string;
  postorderIndex: number;
  root: string;
  inorderWindow: string;
  action: string;
};

const SPLIT_STEPS: SplitStep[] = [
  { step: 1, postorderPointer: 4, pickedRoot: 3, inorderRange: "[9, 3, 15, 20, 7]", leftRange: "[9]", rightRange: "[15, 20, 7]" },
  { step: 2, postorderPointer: 3, pickedRoot: 20, inorderRange: "[15, 20, 7]", leftRange: "[15]", rightRange: "[7]" },
  { step: 3, postorderPointer: 2, pickedRoot: 7, inorderRange: "[7]", leftRange: "[]", rightRange: "[]" },
  { step: 4, postorderPointer: 1, pickedRoot: 15, inorderRange: "[15]", leftRange: "[]", rightRange: "[]" },
  { step: 5, postorderPointer: 0, pickedRoot: 9, inorderRange: "[9]", leftRange: "[]", rightRange: "[]" },
];

const TRACE_ROWS: TraceRow[] = [
  { call: "build(0,4)", postorderIndex: 4, root: "3", inorderWindow: "[9,3,15,20,7]", action: "create root, split at index 1" },
  { call: "build(2,4)", postorderIndex: 3, root: "20", inorderWindow: "[15,20,7]", action: "right subtree first" },
  { call: "build(4,4)", postorderIndex: 2, root: "7", inorderWindow: "[7]", action: "attach right child of 20" },
  { call: "build(2,2)", postorderIndex: 1, root: "15", inorderWindow: "[15]", action: "attach left child of 20" },
  { call: "build(0,0)", postorderIndex: 0, root: "9", inorderWindow: "[9]", action: "complete left subtree of 3" },
];

const QA = [
  {
    q: "Why must recursion build right before left here?",
    a: "When consuming postorder from the end, order becomes root, right, left. Right subtree must be built first to keep indices aligned.",
  },
  {
    q: "Can we still use inorder map exactly like LC105?",
    a: "Yes. The map logic is identical; only pointer direction and recursion order differ.",
  },
  {
    q: "What breaks if we recurse left first?",
    a: "You consume right-subtree roots too early and construct a structurally incorrect tree.",
  },
];

const INTERVIEW_CONTEXT = [
  "Pairing LC105 and LC106 shows strong understanding of traversal duality.",
  "Boundary management with index windows is a core divide-and-conquer interview skill.",
  "Right-first recursion order reasoning is a common interviewer probe.",
  "Foundation for advanced reconstruction variants with constraints or duplicates.",
];

const MISTAKES = [
  {
    title: "Recursing left before right",
    wrong: "Nodes from right subtree get consumed in wrong region, producing invalid shape.",
    fix: "For reverse postorder pointer, always build right subtree before left.",
  },
  {
    title: "Not decrementing postorder pointer exactly once",
    wrong: "Roots repeat or nodes disappear in final tree.",
    fix: "Decrement immediately after creating each node.",
  },
  {
    title: "Ignoring index map",
    wrong: "Repeated O(n) splits lead to O(n^2) performance.",
    fix: "Use hash map for constant-time inorder split lookup.",
  },
];

function StageTreeDiagram({ stage }: { stage: Stage }) {
  const showRight = stage === "partial" || stage === "final";
  const showLeft = stage === "final";

  return (
    <svg viewBox="0 0 340 210" className="h-[220px] w-full rounded-xl border border-slate-200 bg-white p-3">
      <line x1="170" y1="44" x2="95" y2="108" stroke="#cbd5e1" strokeWidth="2" opacity={showLeft ? 1 : 0.2} />
      <line x1="170" y1="44" x2="245" y2="108" stroke="#cbd5e1" strokeWidth="2" opacity={showRight ? 1 : 0.2} />
      <line x1="245" y1="108" x2="210" y2="170" stroke="#cbd5e1" strokeWidth="2" opacity={showRight ? 1 : 0.2} />
      <line x1="245" y1="108" x2="280" y2="170" stroke="#cbd5e1" strokeWidth="2" opacity={showRight ? 1 : 0.2} />

      <circle cx="170" cy="44" r="18" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
      <text x="170" y="49" textAnchor="middle" className="fill-green-800 text-sm font-semibold">3</text>

      <circle cx="245" cy="108" r="18" fill="#fef3c7" stroke="#d97706" strokeWidth="2" opacity={showRight ? 1 : 0.25} />
      <text x="245" y="113" textAnchor="middle" className="fill-amber-800 text-sm font-semibold" opacity={showRight ? 1 : 0.25}>20</text>

      <circle cx="280" cy="170" r="16" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" opacity={showRight ? 1 : 0.25} />
      <text x="280" y="175" textAnchor="middle" className="fill-violet-800 text-xs font-semibold" opacity={showRight ? 1 : 0.25}>7</text>

      <circle cx="210" cy="170" r="16" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" opacity={showRight ? 1 : 0.25} />
      <text x="210" y="175" textAnchor="middle" className="fill-violet-800 text-xs font-semibold" opacity={showRight ? 1 : 0.25}>15</text>

      <circle cx="95" cy="108" r="18" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" opacity={showLeft ? 1 : 0.25} />
      <text x="95" y="113" textAnchor="middle" className="fill-blue-800 text-sm font-semibold" opacity={showLeft ? 1 : 0.25}>9</text>
    </svg>
  );
}

export default function ConstructTreeInorderPostorderGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_48%),radial-gradient(ellipse_at_bottom_left,#e2f6ef_0%,transparent_52%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Binary Tree · Construction</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/problems/binary-tree/construct-binary-tree-from-inorder-and-postorder" className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100">Visual Editor</Link>
              <Link href="/problems/topics/trees" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">Tree Problems</Link>
            </div>
          </div>

          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Construct Binary Tree from Inorder and Postorder</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">Build root from postorder tail, split by inorder, then recurse right-first and left-second.</p>

          <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 gap-1 border border-slate-200">
            <button onClick={() => setMode("quick")} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${mode === "quick" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>Quick Recap</button>
            <button onClick={() => setMode("deep")} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${mode === "deep" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}>Deep Explain</button>
          </div>
          <p className="text-xs text-slate-400 mt-3">{mode === "quick" ? "Key concepts at a glance — for those who already know the basics." : "A full beginner-friendly walkthrough — understand it from scratch."}</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        {mode === "quick" ? (
          <div className="space-y-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Problem Statement</h3>
              <p className="text-[15px] leading-relaxed text-slate-700 mb-4">Given inorder and postorder arrays of distinct values, reconstruct the original binary tree.</p>
              <p className="font-mono text-[13px] text-slate-600">inorder=[9,3,15,20,7], postorder=[9,15,7,20,3] -&gt; root=3</p>
            </div>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">01 · Full Diagram</p>
              <StageTreeDiagram stage="final" />
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · Array Split Visualization</p>
              <div className="grid gap-3">
                {SPLIT_STEPS.map((s) => (
                  <div key={s.step} className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-800">Step {s.step}: pick root {s.pickedRoot} (postorder pointer={s.postorderPointer})</p>
                    <p className="text-[13px] text-slate-600 mt-1">inorder window {s.inorderRange} -&gt; left {s.leftRange}, right {s.rightRange}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · Dry Run Grid</p>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="grid grid-cols-[64px_120px_1fr] bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <div className="px-3 py-2 border-r border-slate-200">Step</div>
                  <div className="px-3 py-2 border-r border-slate-200">Pointer</div>
                  <div className="px-3 py-2">Partial Tree</div>
                </div>
                {SPLIT_STEPS.map((s) => (
                  <div key={`row-${s.step}`} className="grid grid-cols-[64px_120px_1fr] border-t border-slate-100 text-[13px] text-slate-700">
                    <div className="px-3 py-2 border-r border-slate-100">{s.step}</div>
                    <div className="px-3 py-2 border-r border-slate-100">post[{s.postorderPointer}]</div>
                    <div className="px-3 py-2">root={s.pickedRoot}, recurse right then left</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">04 · Code</p>
              <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg">
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-[#cdd6f4]">{`def buildTree(inorder, postorder):
    idx = {v: i for i, v in enumerate(inorder)}
    post_i = len(postorder) - 1

    def build(l, r):
        nonlocal post_i
        if l > r:
            return None
        root_val = postorder[post_i]
        post_i -= 1
        root = TreeNode(root_val)
        mid = idx[root_val]
        root.right = build(mid + 1, r)
        root.left = build(l, mid - 1)
        return root

    return build(0, len(inorder) - 1)`}</pre>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Final Preview</p>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">Constructed tree: root 3, left 9, right 20 with children 15 and 7.</div>
            </section>
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">01 · Pointer Trace Table</p>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="grid grid-cols-[120px_90px_70px_1fr_1fr] bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <div className="px-3 py-2 border-r border-slate-200">Call</div>
                  <div className="px-3 py-2 border-r border-slate-200">postIdx</div>
                  <div className="px-3 py-2 border-r border-slate-200">Root</div>
                  <div className="px-3 py-2 border-r border-slate-200">Inorder</div>
                  <div className="px-3 py-2">Action</div>
                </div>
                {TRACE_ROWS.map((r) => (
                  <div key={r.call + r.postorderIndex} className="grid grid-cols-[120px_90px_70px_1fr_1fr] border-t border-slate-100 text-[13px] text-slate-700">
                    <div className="px-3 py-2 border-r border-slate-100">{r.call}</div>
                    <div className="px-3 py-2 border-r border-slate-100">{r.postorderIndex}</div>
                    <div className="px-3 py-2 border-r border-slate-100">{r.root}</div>
                    <div className="px-3 py-2 border-r border-slate-100">{r.inorderWindow}</div>
                    <div className="px-3 py-2">{r.action}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · Call Stack Visual</p>
              <div className="rounded-xl bg-[#1e1e2e] p-4 font-mono text-sm text-slate-200">
                <div className="rounded bg-[#313244] px-3 py-1.5 mb-1">-&gt; build(2,4) root=20</div>
                <div className="rounded bg-[#1e1e2e] px-3 py-1.5 mb-1 text-slate-400">   build(4,4) root=7</div>
                <div className="rounded bg-[#1e1e2e] px-3 py-1.5 text-slate-500">   build(2,2) root=15</div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · Before/After Subtree Build</p>
              <div className="grid gap-4 md:grid-cols-3">
                <div><p className="text-xs text-slate-500 mb-1">Before</p><StageTreeDiagram stage="root" /></div>
                <div><p className="text-xs text-slate-500 mb-1">After Right</p><StageTreeDiagram stage="partial" /></div>
                <div><p className="text-xs text-slate-500 mb-1">After Full</p><StageTreeDiagram stage="final" /></div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">04 · Deep Q&A</p>
              <div className="space-y-3">
                {QA.map((item) => (
                  <div key={item.q} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">{item.q}</div>
                    <div className="px-4 py-3 text-sm text-slate-700 border-t border-slate-100">{item.a}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Common Mistakes with Wrong Output</p>
              <div className="space-y-3">
                {MISTAKES.map((m) => (
                  <div key={m.title} className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-sm font-semibold text-rose-800">{m.title}</p>
                    <p className="text-[13px] text-rose-700 mt-1">Wrong outcome: {m.wrong}</p>
                    <p className="text-[13px] text-emerald-700 mt-1">Fix: {m.fix}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">06 · Interview Context</p>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <ul className="space-y-2 text-sm text-slate-700">
                  {INTERVIEW_CONTEXT.map((line) => (
                    <li key={line} className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />{line}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">07 · Complexity Deep Dive</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-emerald-50 p-4"><p className="text-sm font-semibold text-emerald-800">Time O(n)</p><p className="text-[13px] text-emerald-700 mt-1">Each node built once; map lookup O(1).</p></div>
                <div className="rounded-xl bg-violet-50 p-4"><p className="text-sm font-semibold text-violet-800">Stack O(h)</p><p className="text-[13px] text-violet-700 mt-1">Balanced: O(log n), skewed: O(n). Map remains O(n).</p></div>
              </div>
            </section>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to see it in action?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer to watch the algorithm state update live.</p>
            </div>
            <Link href="/problems/binary-tree/construct-binary-tree-from-inorder-and-postorder" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700">Open Visualizer</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
