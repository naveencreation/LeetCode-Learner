"use client";

import Link from "next/link";
import { useState } from "react";

export default function BstdllGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_48%),radial-gradient(ellipse_at_bottom_left,#e2f6ef_0%,transparent_52%)]" />

      <div className="relative z-[1] mx-auto max-w-[860px] px-6 py-6">
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">
                BST · In-order DFS · LeetCode 426
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/convert-bst-to-sorted-doubly-linked-list"
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

          <h1 className="mb-2 text-3xl font-semibold text-slate-900">
            Convert BST to Sorted Circular Doubly Linked List
          </h1>
          <p className="mb-5 max-w-xl text-base text-slate-500">
            Convert a BST in-place by reusing left as prev and right as next. In-order traversal gives sorted order for free; one final stitch closes the circle.
          </p>

          <div className="mb-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              In-order DFS
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              Pointer Rewiring
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Circular DLL
            </span>
          </div>
        </header>

        <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => setMode("quick")}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
              mode === "quick"
                ? "border border-slate-200 bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Quick Recap
          </button>
          <button
            onClick={() => setMode("deep")}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
              mode === "deep"
                ? "border border-slate-200 bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Deep Explain
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          {mode === "quick"
            ? "Key concepts at a glance — for those who already know the basics."
            : "A full beginner-friendly walkthrough with diagrams, trace logic, and interview framing."}
        </p>

        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {mode === "quick" ? (
          <div className="space-y-6">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Rule</p>
              <p className="rounded-md border-l-4 border-sky-500 bg-sky-50 px-4 py-3 text-[17px] font-semibold leading-7 text-sky-900">
                In-order traversal of a BST visits nodes in ascending order. Link each visited node to the previous one, then connect head and tail.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">How to Think</p>
              <div className="space-y-2.5 text-sm text-slate-700">
                <p><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">1</span>Run DFS in-order: left, node, right.</p>
                <p><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">2</span>Use <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">head</span> for the first visited node and <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">prev</span> for the last linked node.</p>
                <p><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">3</span>At each node: set <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">prev.right = node</span> and <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">node.left = prev</span>.</p>
                <p><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">4</span>After traversal: <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">head.left = tail</span>, <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[12px]">tail.right = head</span>.</p>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Diagram</p>
              <div className="overflow-x-auto">
                <svg viewBox="0 0 500 240" className="mx-auto h-auto w-full min-w-[460px] max-w-[520px]">
                  <line x1="250" y1="64" x2="170" y2="124" stroke="#b6d4f5" strokeWidth="2" />
                  <line x1="250" y1="64" x2="330" y2="124" stroke="#b6d4f5" strokeWidth="2" />
                  <line x1="170" y1="124" x2="120" y2="184" stroke="#b6d4f5" strokeWidth="2" />
                  <line x1="170" y1="124" x2="220" y2="184" stroke="#b6d4f5" strokeWidth="2" />

                  <circle cx="250" cy="50" r="22" fill="#e6f1fb" stroke="#378add" strokeWidth="2" />
                  <text x="250" y="56" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0c447c">4</text>

                  <circle cx="170" cy="110" r="22" fill="#faeeda" stroke="#ef9f27" strokeWidth="2" />
                  <text x="170" y="116" textAnchor="middle" fontSize="14" fontWeight="700" fill="#633806">2</text>

                  <circle cx="330" cy="110" r="22" fill="#faeeda" stroke="#ef9f27" strokeWidth="2" />
                  <text x="330" y="116" textAnchor="middle" fontSize="14" fontWeight="700" fill="#633806">5</text>

                  <circle cx="120" cy="170" r="22" fill="#e1f5ee" stroke="#1d9e75" strokeWidth="2" />
                  <text x="120" y="176" textAnchor="middle" fontSize="14" fontWeight="700" fill="#085041">1</text>

                  <circle cx="220" cy="170" r="22" fill="#e1f5ee" stroke="#1d9e75" strokeWidth="2" />
                  <text x="220" y="176" textAnchor="middle" fontSize="14" fontWeight="700" fill="#085041">3</text>

                  <text x="250" y="212" textAnchor="middle" fontSize="12" fill="#0f6e56" fontWeight="600">In-order: 1 → 2 → 3 → 4 → 5</text>
                </svg>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1 text-sm font-mono font-semibold">
                <span className="rounded border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-800">1</span>
                <span className="text-sky-600">⇄</span>
                <span className="rounded border border-sky-300 bg-sky-50 px-3 py-1 text-sky-800">2</span>
                <span className="text-sky-600">⇄</span>
                <span className="rounded border border-sky-300 bg-sky-50 px-3 py-1 text-sky-800">3</span>
                <span className="text-sky-600">⇄</span>
                <span className="rounded border border-sky-300 bg-sky-50 px-3 py-1 text-sky-800">4</span>
                <span className="text-sky-600">⇄</span>
                <span className="rounded border border-amber-300 bg-amber-50 px-3 py-1 text-amber-800">5</span>
                <span className="ml-2 text-xs text-slate-500">(circular: tail ↔ head)</span>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Complexity</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-sky-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-sky-700">Time</p>
                  <p className="font-mono text-[30px] font-semibold text-sky-900">O(n)</p>
                  <p className="text-sm text-sky-800">Each node is visited exactly once.</p>
                </div>
                <div className="rounded-xl bg-violet-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">Space</p>
                  <p className="font-mono text-[30px] font-semibold text-violet-900">O(h)</p>
                  <p className="text-sm text-violet-800">Recursion stack only. Balanced: O(log n), skewed: O(n).</p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Common Mistakes</p>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-7 text-slate-700">
                <li>Missing circular close: <span className="font-mono text-[12px]">head.left = tail</span> and <span className="font-mono text-[12px]">tail.right = head</span>.</li>
                <li>Using pre-order/post-order and expecting sorted order.</li>
                <li>Forgetting that this is in-place pointer rewiring (no new nodes).</li>
              </ul>
            </article>
          </div>
        ) : (
          <div className="space-y-6">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Problem Statement</p>
              <h2 className="mb-2 text-lg font-extrabold text-slate-900">Three constraints in one sentence</h2>
              <p className="text-sm leading-7 text-slate-700">
                Convert BST to a sorted circular DLL, in-place. That means no new nodes, sorted ascending order, and both wraparound links (head.left and tail.right) must exist.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Why This Strategy</p>
              <h2 className="mb-2 text-lg font-extrabold text-slate-900">In-order gives sorted order automatically</h2>
              <p className="text-sm leading-7 text-slate-700">
                In BST, left subtree values are smaller and right subtree values are larger. In-order DFS (left, node, right) therefore visits values in ascending order globally.
              </p>
              <div className="mt-3 rounded-md border-l-4 border-sky-500 bg-sky-50 px-4 py-3 text-sm text-sky-900">
                Insight: this is not a list-building problem first; it is a traversal-order problem first. Correct order from traversal simplifies linking logic.
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Traversal Diagram</p>
              <h2 className="mb-3 text-lg font-extrabold text-slate-900">In-order visit sequence (smallest to largest)</h2>
              <div className="overflow-x-auto">
                <svg viewBox="0 0 500 195" className="mx-auto h-auto w-full min-w-[480px] max-w-[500px]" xmlns="http://www.w3.org/2000/svg">
                  <text x="250" y="14" textAnchor="middle" fontSize="11" fontWeight="600" fill="#8888a8" letterSpacing="0.05em">IN-ORDER TRAVERSAL VISITS NODES SMALLEST TO LARGEST</text>

                  <line x1="140" y1="52"  x2="75"  y2="110" stroke="#B5D4F4" strokeWidth="1.8"/>
                  <line x1="140" y1="52"  x2="205" y2="110" stroke="#B5D4F4" strokeWidth="1.8"/>
                  <line x1="75"  y1="110" x2="42"  y2="155" stroke="#B5D4F4" strokeWidth="1.8"/>
                  <line x1="75"  y1="110" x2="108" y2="155" stroke="#B5D4F4" strokeWidth="1.8"/>
                  <line x1="205" y1="110" x2="238" y2="155" stroke="#B5D4F4" strokeWidth="1.8"/>

                  <circle cx="140" cy="40" r="20" fill="#E6F1FB" stroke="#378ADD" strokeWidth="2"/>
                  <text x="140" y="46" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0C447C">4</text>
                  <circle cx="75" cy="98" r="20" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="2"/>
                  <text x="75" y="104" textAnchor="middle" fontSize="14" fontWeight="700" fill="#633806">2</text>
                  <circle cx="205" cy="98" r="20" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="2"/>
                  <text x="205" y="104" textAnchor="middle" fontSize="14" fontWeight="700" fill="#633806">5</text>
                  <circle cx="42" cy="143" r="20" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="2"/>
                  <text x="42" y="149" textAnchor="middle" fontSize="14" fontWeight="700" fill="#085041">1</text>
                  <circle cx="108" cy="143" r="20" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="2"/>
                  <text x="108" y="149" textAnchor="middle" fontSize="14" fontWeight="700" fill="#085041">3</text>

                  <text x="310" y="22" fontSize="11" fill="#8888a8" fontWeight="600" letterSpacing="0.05em">VISIT SEQUENCE</text>
                  <rect x="305" y="30" width="175" height="28" rx="6" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1"/>
                  <text x="318" y="49" fontSize="12" fill="#085041" fontWeight="500">1 node(1) leftmost leaf</text>
                  <rect x="305" y="63" width="175" height="28" rx="6" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1"/>
                  <text x="318" y="82" fontSize="12" fill="#0C447C" fontWeight="500">2 node(2) left subtree root</text>
                  <rect x="305" y="96" width="175" height="28" rx="6" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1"/>
                  <text x="318" y="115" fontSize="12" fill="#085041" fontWeight="500">3 node(3) right child of 2</text>
                  <rect x="305" y="129" width="175" height="28" rx="6" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="1"/>
                  <text x="318" y="148" fontSize="12" fill="#633806" fontWeight="500">4 node(4) root visited later</text>
                  <rect x="305" y="162" width="175" height="28" rx="6" fill="#EEEDFE" stroke="#8B87E3" strokeWidth="1"/>
                  <text x="318" y="181" fontSize="12" fill="#3C3489" fontWeight="500">5 node(5) rightmost node</text>
                </svg>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Intuition</p>
              <h2 className="mb-2 text-lg font-extrabold text-slate-900">Link each node to the one visited just before it</h2>
              <p className="text-sm leading-7 text-slate-700">
                In-order hands nodes in sorted order one by one. If we always connect the previously visited node with the current node, the chain naturally becomes a sorted doubly linked list. The first visited node is head and the last visited node is tail.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Pointer Diagram</p>
              <h2 className="mb-2 text-lg font-extrabold text-slate-900">Reuse left/right as prev/next</h2>
              <div className="overflow-x-auto">
                <svg viewBox="0 0 560 220" className="mx-auto h-auto w-full min-w-[500px] max-w-[560px]">
                  <text x="130" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="#889">Before (BST node)</text>
                  <text x="430" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="#889">After (DLL node)</text>

                  <rect x="70" y="34" width="120" height="54" rx="10" fill="#e6f1fb" stroke="#378add" strokeWidth="2" />
                  <text x="130" y="67" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0c447c">node(X)</text>
                  <line x1="95" y1="89" x2="50" y2="133" stroke="#b6d4f5" strokeWidth="2" strokeDasharray="4 3" />
                  <line x1="165" y1="89" x2="210" y2="133" stroke="#b6d4f5" strokeWidth="2" strokeDasharray="4 3" />
                  <text x="50" y="147" textAnchor="middle" fontSize="11" fill="#666">left child</text>
                  <text x="210" y="147" textAnchor="middle" fontSize="11" fill="#666">right child</text>

                  <text x="280" y="68" textAnchor="middle" fontSize="28" fill="#1d9e75">→</text>
                  <text x="280" y="88" textAnchor="middle" fontSize="10" fill="#1d9e75" fontWeight="700">in-order linking</text>

                  <rect x="370" y="34" width="120" height="54" rx="10" fill="#e1f5ee" stroke="#1d9e75" strokeWidth="2" />
                  <text x="430" y="67" textAnchor="middle" fontSize="18" fontWeight="700" fill="#085041">node(X)</text>
                  <line x1="395" y1="89" x2="350" y2="133" stroke="#1d9e75" strokeWidth="2" />
                  <line x1="465" y1="89" x2="510" y2="133" stroke="#1d9e75" strokeWidth="2" />
                  <text x="350" y="147" textAnchor="middle" fontSize="11" fill="#085041" fontWeight="700">prev</text>
                  <text x="510" y="147" textAnchor="middle" fontSize="11" fill="#085041" fontWeight="700">next</text>

                  <path d="M 382 34 Q 430 6 478 34" fill="none" stroke="#8b87e3" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="430" y="10" textAnchor="middle" fontSize="10" fill="#534ab7">head.left = tail · tail.right = head</text>
                </svg>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Dry Run</p>
              <h2 className="mb-3 text-lg font-extrabold text-slate-900">Step-by-step linking trace</h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <div className="grid grid-cols-[110px_90px_90px_1fr] bg-slate-100 text-xs font-semibold text-slate-600">
                  <div className="px-3 py-2">Visit</div>
                  <div className="px-3 py-2">curr</div>
                  <div className="px-3 py-2">prev</div>
                  <div className="px-3 py-2">Action</div>
                </div>
                {[
                  ["1st", "1", "None", "Set head = 1. prev = 1."],
                  ["2nd", "2", "1", "1.right = 2 and 2.left = 1. prev = 2."],
                  ["3rd", "3", "2", "2.right = 3 and 3.left = 2. prev = 3."],
                  ["4th", "4", "3", "3.right = 4 and 4.left = 3. prev = 4."],
                  ["5th", "5", "4", "4.right = 5 and 5.left = 4. prev = 5."],
                  ["Close", "-", "5", "head.left = 5 and 5.right = head."],
                ].map((row, idx) => (
                  <div
                    key={`${row[0]}-${row[1]}`}
                    className={`grid grid-cols-[110px_90px_90px_1fr] text-sm ${idx % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                  >
                    <div className="px-3 py-2 text-slate-700">{row[0]}</div>
                    <div className="px-3 py-2 font-mono text-slate-800">{row[1]}</div>
                    <div className="px-3 py-2 font-mono text-slate-800">{row[2]}</div>
                    <div className="px-3 py-2 text-slate-700">{row[3]}</div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Circular Close Diagram</p>
              <h2 className="mb-3 text-lg font-extrabold text-slate-900">Final two links that make it circular</h2>
              <div className="overflow-x-auto">
                <svg viewBox="0 0 500 130" className="mx-auto h-auto w-full min-w-[480px] max-w-[500px]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arr-fwd" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#1D9E75"/></marker>
                    <marker id="arr-back" markerWidth="7" markerHeight="7" refX="2" refY="3.5" orient="auto-start-reverse"><polygon points="0 0,7 3.5,0 7" fill="#378ADD"/></marker>
                    <marker id="arr-circ" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#8B87E3"/></marker>
                  </defs>

                  <rect x="20" y="42" width="52" height="36" rx="8" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="2"/>
                  <text x="46" y="65" textAnchor="middle" fontSize="15" fontWeight="700" fill="#085041">1</text>
                  <text x="46" y="30" textAnchor="middle" fontSize="10" fill="#1D9E75" fontWeight="600">head</text>

                  <rect x="108" y="42" width="52" height="36" rx="8" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1.5"/>
                  <text x="134" y="65" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0C447C">2</text>

                  <rect x="196" y="42" width="52" height="36" rx="8" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1.5"/>
                  <text x="222" y="65" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0C447C">3</text>

                  <rect x="284" y="42" width="52" height="36" rx="8" fill="#E6F1FB" stroke="#378ADD" strokeWidth="1.5"/>
                  <text x="310" y="65" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0C447C">4</text>

                  <rect x="372" y="42" width="52" height="36" rx="8" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="2"/>
                  <text x="398" y="65" textAnchor="middle" fontSize="15" fontWeight="700" fill="#633806">5</text>
                  <text x="398" y="30" textAnchor="middle" fontSize="10" fill="#633806" fontWeight="600">tail</text>

                  <line x1="72" y1="60" x2="108" y2="60" stroke="#1D9E75" strokeWidth="2" markerEnd="url(#arr-fwd)"/>
                  <line x1="160" y1="60" x2="196" y2="60" stroke="#1D9E75" strokeWidth="2" markerEnd="url(#arr-fwd)"/>
                  <line x1="248" y1="60" x2="284" y2="60" stroke="#1D9E75" strokeWidth="2" markerEnd="url(#arr-fwd)"/>
                  <line x1="336" y1="60" x2="372" y2="60" stroke="#1D9E75" strokeWidth="2" markerEnd="url(#arr-fwd)"/>

                  <line x1="108" y1="68" x2="72" y2="68" stroke="#378ADD" strokeWidth="1.5" markerEnd="url(#arr-back)"/>
                  <line x1="196" y1="68" x2="160" y2="68" stroke="#378ADD" strokeWidth="1.5" markerEnd="url(#arr-back)"/>
                  <line x1="284" y1="68" x2="248" y2="68" stroke="#378ADD" strokeWidth="1.5" markerEnd="url(#arr-back)"/>
                  <line x1="372" y1="68" x2="336" y2="68" stroke="#378ADD" strokeWidth="1.5" markerEnd="url(#arr-back)"/>

                  <path d="M 424,42 Q 248,5 46,42" fill="none" stroke="#8B87E3" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arr-circ)"/>
                  <text x="235" y="12" textAnchor="middle" fontSize="10" fill="#534AB7" fontWeight="500">tail.right to head</text>

                  <path d="M 46,78 Q 248,116 424,78" fill="none" stroke="#EF9F27" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arr-circ)"/>
                  <text x="235" y="120" textAnchor="middle" fontSize="10" fill="#854F0B" fontWeight="500">head.left to tail</text>
                </svg>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Complexity</p>
              <p className="text-sm leading-7 text-slate-700">Time is O(n) because each node is visited once. Space is O(h) for recursion stack where h is tree height. Linking and circular close are O(1) per node and O(1) final step.</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Common Mistakes</p>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-7 text-slate-700">
                <li>Skipping circular close step and returning a linear DLL.</li>
                <li>Using non in-order traversal and losing sorted order.</li>
                <li>Not explaining why pointer overwrite is safe after subtree recursion returns.</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Interview Insights</p>
              <p className="text-sm leading-7 text-slate-700">
                Start by proving order (BST + in-order), then state invariant: prev is last linked node and head is smallest node. Mention iterative-stack alternative for deep trees to avoid recursion depth concerns.
              </p>
            </article>
          </div>
        )}

        <footer className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50/30 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[15px] font-medium text-slate-800">Ready to see it in action?</p>
              <p className="mt-0.5 text-[13px] text-slate-500">Step through the visualizer to observe each pointer rewiring action.</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/problems/binary-tree/convert-bst-to-sorted-doubly-linked-list"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25"
              >
                Open Visualizer
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
              </Link>
              <Link
                href="/problems"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back to Problems
              </Link>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">If you can explain why in-order yields sorted order and why overwrite is safe, you are interview-ready for LC 426.</p>
        </footer>
      </div>
    </section>
  );
}
