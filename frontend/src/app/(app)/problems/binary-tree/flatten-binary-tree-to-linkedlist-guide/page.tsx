"use client";

import Link from "next/link";
import { useState } from "react";

type TraceStep = {
  step: number;
  current: number;
  action: string;
  chain: string;
};

const TRACE_STEPS: TraceStep[] = [
  { step: 1, current: 1, action: "Find rightmost of left subtree (node 4), connect 4.right -> 5", chain: "1 -> 2 -> 3 -> 4 -> 5 -> 6" },
  { step: 2, current: 1, action: "Move left subtree to right, set 1.left = null", chain: "1 -> 2 -> 3 -> 4 -> 5 -> 6" },
  { step: 3, current: 2, action: "Left absent, move ahead", chain: "1 -> 2 -> 3 -> 4 -> 5 -> 6" },
  { step: 4, current: 3, action: "Left absent, move ahead", chain: "1 -> 2 -> 3 -> 4 -> 5 -> 6" },
  { step: 5, current: 4, action: "Left absent, move ahead", chain: "1 -> 2 -> 3 -> 4 -> 5 -> 6" },
];

const QA = [
  {
    q: "Why does this preserve preorder order?",
    a: "At each node, we place the entire left subtree directly after the node and then append the original right subtree at the end of that left chain.",
  },
  {
    q: "Why find the rightmost node of the left subtree?",
    a: "That node is the tail of preorder for the left part, so attaching original right subtree there preserves the full sequence.",
  },
  {
    q: "Is this really O(1) extra space?",
    a: "Yes for the iterative pointer-rewiring method. It does not allocate recursion stack or auxiliary containers.",
  },
];

const MISTAKES = [
  {
    title: "Overwriting current.right before reconnecting it",
    wrong: "Original right subtree is lost permanently.",
    fix: "Always connect predecessor.right to old current.right first.",
  },
  {
    title: "Not nulling current.left",
    wrong: "Tree is not flattened to linked-list form and fails constraints.",
    fix: "After moving left subtree to right, set current.left = null.",
  },
  {
    title: "Recursion without mentioning stack cost",
    wrong: "Complexity claim becomes incorrect in interviews.",
    fix: "Call out O(h) stack for recursive variant; iterative is O(1) extra.",
  },
];

const INTERVIEW_CONTEXT = [
  "In-place tree transformations and pointer rewiring confidence.",
  "Preorder serialization logic for tree-to-list conversions.",
  "Morris-style traversal intuition without extra stack.",
  "Frequently paired with preorder traversal and tree threading questions.",
];

function TreeBeforeAfterDiagram() {
  return (
    <svg viewBox="0 0 720 230" className="h-[230px] w-full rounded-xl border border-slate-200 bg-white p-3">
      <text x="120" y="20" className="fill-slate-500 text-xs font-semibold">Before</text>
      <line x1="120" y1="48" x2="70" y2="98" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="120" y1="48" x2="170" y2="98" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="70" y1="98" x2="45" y2="148" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="70" y1="98" x2="95" y2="148" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="170" y1="98" x2="195" y2="148" stroke="#cbd5e1" strokeWidth="2" />

      {[{ x: 120, y: 48, v: 1 }, { x: 70, y: 98, v: 2 }, { x: 170, y: 98, v: 5 }, { x: 45, y: 148, v: 3 }, { x: 95, y: 148, v: 4 }, { x: 195, y: 148, v: 6 }].map((n) => (
        <g key={`${n.x}-${n.y}`}>
          <circle cx={n.x} cy={n.y} r="15" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <text x={n.x} y={n.y + 5} textAnchor="middle" className="fill-sky-800 text-xs font-semibold">{n.v}</text>
        </g>
      ))}

      <line x1="320" y1="20" x2="390" y2="20" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="355" y="14" textAnchor="middle" className="fill-slate-500 text-[11px]">flatten</text>

      <text x="470" y="20" className="fill-slate-500 text-xs font-semibold">After (right-only chain)</text>
      {[1, 2, 3, 4, 5, 6].map((v, i) => {
        const x = 430 + i * 42;
        return (
          <g key={v}>
            <circle cx={x} cy={96} r="14" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
            <text x={x} y={101} textAnchor="middle" className="fill-green-800 text-xs font-semibold">{v}</text>
            {i < 5 && <line x1={x + 14} y1={96} x2={x + 28} y2={96} stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowGreen)" />}
          </g>
        );
      })}

      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#94a3b8" />
        </marker>
        <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#22c55e" />
        </marker>
      </defs>
    </svg>
  );
}

export default function FlattenBinaryTreeGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_48%),radial-gradient(ellipse_at_bottom_left,#e2f6ef_0%,transparent_52%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Binary Tree · Pointer Rewiring</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/problems/binary-tree/flatten-binary-tree-to-linkedlist" className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100">Visual Editor</Link>
              <Link href="/problems/topics/trees" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">Tree Problems</Link>
            </div>
          </div>

          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Flatten Binary Tree to Linked List</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">Rewire pointers in-place so the tree becomes a preorder right-only chain.</p>

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
              <p className="text-[15px] leading-relaxed text-slate-700 mb-4">Flatten the tree in-place to a linked list using right pointers in preorder sequence.</p>
              <p className="font-mono text-[13px] text-slate-600">[1,2,5,3,4,null,6] -&gt; 1 -&gt; 2 -&gt; 3 -&gt; 4 -&gt; 5 -&gt; 6</p>
            </div>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">01 · Before/After Diagram</p>
              <TreeBeforeAfterDiagram />
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · Iterative Rewiring Steps</p>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <ol className="list-decimal pl-5 space-y-1 text-sm leading-6 text-slate-700">
                  <li>If current.left exists, find predecessor: rightmost node of left subtree.</li>
                  <li>Connect predecessor.right to current.right.</li>
                  <li>Move current.left to current.right.</li>
                  <li>Set current.left = null and advance current = current.right.</li>
                </ol>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · Quick Trace Grid</p>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="grid grid-cols-[64px_90px_1fr_1fr] bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <div className="px-3 py-2 border-r border-slate-200">Step</div>
                  <div className="px-3 py-2 border-r border-slate-200">Current</div>
                  <div className="px-3 py-2 border-r border-slate-200">Action</div>
                  <div className="px-3 py-2">Chain</div>
                </div>
                {TRACE_STEPS.map((s) => (
                  <div key={s.step} className="grid grid-cols-[64px_90px_1fr_1fr] border-t border-slate-100 text-[13px] text-slate-700">
                    <div className="px-3 py-2 border-r border-slate-100">{s.step}</div>
                    <div className="px-3 py-2 border-r border-slate-100">{s.current}</div>
                    <div className="px-3 py-2 border-r border-slate-100">{s.action}</div>
                    <div className="px-3 py-2 font-mono">{s.chain}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">04 · Code</p>
              <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg">
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-[#cdd6f4]">{`def flatten(root):
    cur = root
    while cur:
        if cur.left:
            pred = cur.left
            while pred.right:
                pred = pred.right
            pred.right = cur.right
            cur.right = cur.left
            cur.left = None
        cur = cur.right`}</pre>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Complexity</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-emerald-50 p-4"><p className="text-sm font-semibold text-emerald-800">Time O(n)</p><p className="text-[13px] text-emerald-700 mt-1">Each node is rewired once across traversal.</p></div>
                <div className="rounded-xl bg-violet-50 p-4"><p className="text-sm font-semibold text-violet-800">Extra Space O(1)</p><p className="text-[13px] text-violet-700 mt-1">No recursion stack in iterative method.</p></div>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">01 · Why rewiring preserves preorder</p>
              <p className="text-[15px] leading-relaxed text-slate-700">Preorder is root, left, right. By inserting left subtree between root and original right subtree, output order remains preorder while tree shape becomes linear.</p>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · Pointer-State Walkthrough</p>
              <div className="rounded-xl bg-[#1e1e2e] p-4 font-mono text-sm text-slate-200">
                <div className="rounded bg-[#313244] px-3 py-1.5 mb-1">cur=1, pred=4, pred.right=5</div>
                <div className="rounded bg-[#1e1e2e] px-3 py-1.5 mb-1 text-slate-400">cur.right=2, cur.left=None</div>
                <div className="rounded bg-[#1e1e2e] px-3 py-1.5 text-slate-500">advance through right chain</div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · Q&A</p>
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
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">04 · Common Mistakes</p>
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
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Interview Context</p>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <ul className="space-y-2 text-sm text-slate-700">
                  {INTERVIEW_CONTEXT.map((line) => (
                    <li key={line} className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />{line}</li>
                  ))}
                </ul>
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
            <Link href="/problems/binary-tree/flatten-binary-tree-to-linkedlist" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700">Open Visualizer</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
