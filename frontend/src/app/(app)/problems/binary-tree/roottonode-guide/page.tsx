"use client";

import { useState } from "react";
import Link from "next/link";

type TreeNodePoint = {
  id: number;
  x: number;
  y: number;
};

const TARGET = 7;
const TARGET_PATH = [1, 2, 5, 7];

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

const QUICK_STEPS = [
  {
    num: 1,
    title: "Enter node and push to path",
    desc: "At each DFS call, append current node value to path.",
  },
  {
    num: 2,
    title: "If node is target, stop immediately",
    desc: "Return true and bubble success back up the recursion stack.",
  },
  {
    num: 3,
    title: "Try left, then right",
    desc: "If either subtree returns true, keep current node in path.",
  },
  {
    num: 4,
    title: "Backtrack on failure",
    desc: "If both sides fail, pop current node and return false.",
  },
];

const TRACE_STEPS = [
  {
    badge: "Push",
    badgeClass: "bg-blue-100 text-blue-700",
    title: "Visit 1 -> path = [1]",
    desc: "1 is not target, recurse left to node 2.",
  },
  {
    badge: "Push",
    badgeClass: "bg-blue-100 text-blue-700",
    title: "Visit 2 -> path = [1,2]",
    desc: "2 is not target, recurse left to node 4.",
  },
  {
    badge: "Backtrack",
    badgeClass: "bg-rose-100 text-rose-700",
    title: "Visit 4 -> dead end",
    desc: "4 is not target and has no children. Pop 4, path becomes [1,2].",
  },
  {
    badge: "Push",
    badgeClass: "bg-blue-100 text-blue-700",
    title: "Recurse right from 2 to 5",
    desc: "Push 5 -> path = [1,2,5].",
  },
  {
    badge: "Backtrack",
    badgeClass: "bg-rose-100 text-rose-700",
    title: "Visit 6 first -> fail",
    desc: "6 is not target and leaf. Pop 6, path returns to [1,2,5].",
  },
  {
    badge: "Found",
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Visit 7 -> success",
    desc: "7 equals target. Return true all the way up. Final path is [1,2,5,7].",
  },
];

const COMMON_MISTAKES = [
  {
    title: "Forgetting to pop during backtracking",
    desc: "Without path.pop(), failed branches remain in answer and corrupt the path.",
  },
  {
    title: "Searching both subtrees after target found",
    desc: "Do not continue once found. Return true immediately to preserve path and save time.",
  },
  {
    title: "Using path as local copy on each call",
    desc: "Use one shared path list with push/pop, not independent copies per recursion frame.",
  },
  {
    title: "Missing target-not-found handling",
    desc: "If DFS returns false from root, output should be an empty list.",
  },
];

const QA_ITEMS = [
  {
    q: "Why do we append before checking children?",
    a: "Because path should always represent the current recursion route from root to current node. Appending on entry keeps that invariant true.",
  },
  {
    q: "Why is pop needed only on failure?",
    a: "On success, we want to keep the winning route. On failure, current node is not part of the final path and must be removed.",
  },
  {
    q: "Can this be iterative?",
    a: "Yes, but recursion with backtracking is the clearest and most interview-friendly for this problem.",
  },
];

const INTERVIEW_CONTEXT = [
  {
    title: "LCA and path-based tree questions",
    desc: "Many LCA variants compute root-to-node paths first and compare them.",
  },
  {
    title: "Path sum and root-to-leaf problems",
    desc: "Same DFS + backtracking skeleton, with different success conditions.",
  },
  {
    title: "Tree navigation features",
    desc: "Useful in editors/visualizers where selected node breadcrumbs are needed.",
  },
  {
    title: "Backtracking fundamentals",
    desc: "This is a canonical example of choice, recurse, undo pattern.",
  },
];

function nodeById(id: number): TreeNodePoint {
  const node = NODES.find((item) => item.id === id);
  if (!node) throw new Error(`Missing node ${id}`);
  return node;
}

function isPathEdge(from: number, to: number): boolean {
  const fromIndex = TARGET_PATH.indexOf(from);
  const toIndex = TARGET_PATH.indexOf(to);
  return fromIndex !== -1 && toIndex === fromIndex + 1;
}

function TreeDiagram() {
  const pathSet = new Set(TARGET_PATH);

  return (
    <svg viewBox="0 0 340 240" className="h-[250px] w-full rounded-2xl border border-slate-200 bg-white p-3">
      {EDGES.map(([from, to]) => {
        const source = nodeById(from);
        const target = nodeById(to);
        const highlight = isPathEdge(from, to);
        return (
          <line
            key={`${from}-${to}`}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={highlight ? "#0891b2" : "#cbd5e1"}
            strokeWidth={highlight ? "3" : "1.8"}
          />
        );
      })}

      {NODES.map((node) => {
        const inPath = pathSet.has(node.id);
        const isTarget = node.id === TARGET;
        const isDeadBranchNode = node.id === 4 || node.id === 6;

        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="17"
              fill={isTarget ? "#dcfce7" : inPath ? "#e0f2fe" : isDeadBranchNode ? "#fef2f2" : "#ffffff"}
              stroke={isTarget ? "#16a34a" : inPath ? "#0891b2" : isDeadBranchNode ? "#ef4444" : "#cbd5e1"}
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className="fill-slate-800 text-sm font-semibold"
            >
              {node.id}
            </text>
            {isTarget && <text x={node.x + 22} y={node.y - 14} className="fill-emerald-700 text-[10px] font-bold">target</text>}
          </g>
        );
      })}
    </svg>
  );
}

export default function RootToNodeGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#cffafe_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,#fef3c7_0%,transparent_50%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-cyan-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-600">Binary Tree · DFS + Backtracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/root-to-node-path-in-a-binary-tree"
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 transition hover:bg-cyan-100"
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

          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Root to Node Path in a Binary Tree</h1>
          <p className="text-base text-slate-500 mb-5 max-w-xl">
            Find the exact path from root to target node using DFS and backtracking.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1.5 text-xs font-medium text-cyan-700"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />DFS</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Backtracking</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1.5 text-xs font-medium text-purple-700"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" />Path Search</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Interview Classic</span>
          </div>

          <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 gap-1 border border-slate-200">
            <button
              onClick={() => setMode("quick")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                mode === "quick"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Quick Recap
            </button>
            <button
              onClick={() => setMode("deep")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                mode === "deep"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Deep Explain
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            {mode === "quick"
              ? "Key concepts at a glance — for those who already know the basics."
              : "A full beginner-friendly walkthrough — understand it from scratch."}
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        {mode === "quick" && (
          <div className="space-y-12">
            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">01 · The core idea</p>
              <div className="rounded-2xl border-l-4 border-cyan-500 bg-cyan-50 p-5">
                <p className="text-[16px] leading-relaxed text-cyan-900">
                  Keep one shared path list. Push on entry, recurse, and pop only when that branch fails.
                </p>
              </div>
              <p className="mt-3 text-[14px] text-slate-600">The path list mirrors the recursion stack from root to current node.</p>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · Why backtracking matters</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <p className="mb-1 text-sm font-semibold text-cyan-800">Correct branch</p>
                  <p className="text-[13px] leading-relaxed text-slate-500">Keep nodes in path while bubbling true from target.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <p className="mb-1 text-sm font-semibold text-rose-800">Wrong branch</p>
                  <p className="text-[13px] leading-relaxed text-slate-500">Pop node before returning false to clean stale path entries.</p>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · How to think</p>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="space-y-4">
                  {QUICK_STEPS.map((step) => (
                    <div key={step.num} className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-semibold text-cyan-700">{step.num}</div>
                      <div>
                        <p className="text-[14px] font-medium text-slate-800">{step.title}</p>
                        <p className="text-[13px] text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">04 · Diagram</p>
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <TreeDiagram />
              </div>
              <p className="text-[13px] text-slate-500">Target: <span className="font-mono text-slate-700">7</span>, final path: <span className="font-mono text-slate-700">[1,2,5,7]</span></p>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Code</p>
              <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg shadow-slate-900/20">
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-[#cdd6f4]">
{`def rootToNodePath(root, target):
    path = []

    def dfs(node):
        if not node:
            return False

        path.append(node.val)

        if node.val == target:
            return True

        if dfs(node.left) or dfs(node.right):
            return True

        path.pop()  # backtrack
        return False

    return path if dfs(root) else []`}
                </pre>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">06 · Complexity</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-cyan-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Time</p>
                  <p className="mt-1 font-mono text-3xl font-semibold text-cyan-900">O(n)</p>
                  <p className="mt-2 text-[13px] text-cyan-700">Every node is visited at most once.</p>
                </div>
                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">Space</p>
                  <p className="mt-1 font-mono text-3xl font-semibold text-purple-900">O(h)</p>
                  <p className="mt-2 text-[13px] text-purple-700">Recursion depth and path size are bounded by tree height.</p>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">07 · Interview uses</p>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="space-y-3">
                  {INTERVIEW_CONTEXT.map((item) => (
                    <div key={item.title} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                      <p className="text-[14px] leading-relaxed text-slate-700"><span className="font-medium text-slate-800">{item.title}:</span> {item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {mode === "deep" && (
          <div className="space-y-12">
            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">01 · What does root-to-node path mean?</p>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">The exact route from root to target</h2>
              <p className="mb-4 text-[15px] leading-relaxed text-slate-700">
                This problem asks for one ordered list: every node value encountered from the root down to the target node.
                It is not all paths, not shortest path, and not root-to-leaf unless target is a leaf.
              </p>
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <TreeDiagram />
              </div>
              <div className="rounded-xl border-l-4 border-cyan-500 bg-cyan-50 p-4">
                <p className="text-[14px] leading-relaxed text-cyan-900">
                  For target 7, output must be [1,2,5,7]. Nodes 4 and 6 are explored but removed by backtracking.
                </p>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">02 · Why this needs backtracking</p>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Path must stay clean while DFS explores</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="grid grid-cols-[34px_1fr] bg-slate-50">
                  <div className="border-r border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-500">#</div>
                  <div className="px-4 py-2 text-[11px] font-semibold text-slate-500">What happens</div>
                </div>
                <div className="grid grid-cols-[34px_1fr] border-t border-slate-100">
                  <div className="border-r border-slate-100 px-3 py-2 text-[13px] text-slate-500">1</div>
                  <div className="px-4 py-2 text-[14px] text-slate-700">Push current node when entering recursion frame.</div>
                </div>
                <div className="grid grid-cols-[34px_1fr] border-t border-slate-100 bg-slate-50/60">
                  <div className="border-r border-slate-100 px-3 py-2 text-[13px] text-slate-500">2</div>
                  <div className="px-4 py-2 text-[14px] text-slate-700">If target found, stop and preserve path.</div>
                </div>
                <div className="grid grid-cols-[34px_1fr] border-t border-slate-100">
                  <div className="border-r border-slate-100 px-3 py-2 text-[13px] text-slate-500">3</div>
                  <div className="px-4 py-2 text-[14px] text-slate-700">If branch fails, pop node before returning false.</div>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">03 · DFS strategy</p>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Why recursion is a perfect fit</h2>
              <p className="mb-4 text-[15px] leading-relaxed text-slate-700">The recursion stack naturally models path depth. Shared path list plus push/pop gives clean and efficient state transitions.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border-2 border-cyan-300 bg-cyan-50 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">Recursion</p>
                  <p className="text-[13px] leading-relaxed text-cyan-900">Clear logic, minimal boilerplate, direct backtracking semantics.</p>
                </div>
                <div className="rounded-2xl bg-purple-50 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-700">Iterative stack</p>
                  <p className="text-[13px] leading-relaxed text-purple-900">Possible but usually more bookkeeping for parent/path reconstruction.</p>
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">04 · Real-world analogy</p>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Walking rooms in a building</h2>
              <div className="rounded-2xl bg-amber-50 p-5">
                <p className="text-[15px] leading-relaxed text-amber-900">
                  Think of exploring rooms from the entrance to find a target room. You record rooms you enter; if corridor ends wrong, you walk back and erase that branch.
                </p>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">05 · Code line by line</p>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">Understand each decision</h2>
              <div className="overflow-hidden rounded-2xl bg-[#1e1e2e] shadow-lg shadow-slate-900/20">
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-[#cdd6f4]">
{`def rootToNodePath(root, target):
    path = []

    def dfs(node):
        if not node:
            return False

        path.append(node.val)

        if node.val == target:
            return True

        if dfs(node.left) or dfs(node.right):
            return True

        path.pop()
        return False

    return path if dfs(root) else []`}
                </pre>
              </div>
              <div className="mt-4 space-y-3">
                {QA_ITEMS.map((item) => (
                  <div key={item.q} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <p className="bg-slate-50 px-4 py-3 text-[14px] font-medium text-slate-800">{item.q}</p>
                    <p className="border-t border-slate-200 px-4 py-3 text-[14px] leading-relaxed text-slate-700">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">06 · Full trace</p>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">Every DFS step on sample tree</h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="space-y-4">
                  {TRACE_STEPS.map((step) => (
                    <div key={step.title} className="flex items-start gap-4">
                      <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${step.badgeClass}`}>{step.badge}</span>
                      <div>
                        <p className="mb-0.5 text-sm font-medium text-slate-800">{step.title}</p>
                        <p className="text-[13px] leading-relaxed text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">07 · Common beginner mistakes</p>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">What breaks solutions</h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="space-y-3">
                  {COMMON_MISTAKES.map((mistake) => (
                    <div key={mistake.title} className="flex gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[11px] font-semibold text-rose-700">x</div>
                      <div>
                        <p className="text-[14px] font-medium text-slate-800">{mistake.title}</p>
                        <p className="text-[13px] leading-relaxed text-slate-500">{mistake.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">08 · Complexity full explanation</p>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">Why O(n) time and O(h) space</h2>
              <div className="mb-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-cyan-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Time</p>
                  <p className="mt-1 font-mono text-3xl font-semibold text-cyan-900">O(n)</p>
                  <p className="mt-2 text-[13px] text-cyan-700">Worst case explores the whole tree once.</p>
                </div>
                <div className="rounded-2xl bg-purple-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">Space</p>
                  <p className="mt-1 font-mono text-3xl font-semibold text-purple-900">O(h)</p>
                  <p className="mt-2 text-[13px] text-purple-700">Recursion depth and path length are bounded by tree height.</p>
                </div>
              </div>
              <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-4">
                <p className="text-[14px] leading-relaxed text-amber-900">If tree is skewed, h can become n, so worst-case space becomes O(n).</p>
              </div>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">09 · Interview context</p>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">Where this pattern appears</h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="space-y-3">
                  {INTERVIEW_CONTEXT.map((item) => (
                    <div key={item.title} className="flex gap-2 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                      <div>
                        <p className="text-[14px] font-medium text-slate-800">{item.title}</p>
                        <p className="text-[13px] leading-relaxed text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-cyan-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to see it in action?</p>
              <p className="text-[13px] text-slate-500 mt-0.5">Step through the visualizer to see push/pop backtracking live.</p>
            </div>
            <Link
              href="/problems/binary-tree/root-to-node-path-in-a-binary-tree"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-cyan-600/20 transition hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-600/25"
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
