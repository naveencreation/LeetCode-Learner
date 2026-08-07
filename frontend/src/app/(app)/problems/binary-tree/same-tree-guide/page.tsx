"use client";

import { useState } from "react";
import Link from "next/link";

const QUICK_MODE_HTML = String.raw`
<hr class="divider" style="margin-top:0;">

<div class="section">
  <p class="section-label">Problem Statement</p>
  <div class="card">
    <p style="font-size:15px;color:var(--color-text-primary);line-height:1.75;margin:0 0 0.65rem;">Given roots <code>p</code> and <code>q</code>, return <code>true</code> if the two binary trees are exactly the same.</p>
    <p style="font-size:13px;color:var(--color-text-secondary);margin:0 0 0.75rem;">Exactly the same means both structure and values match at every corresponding node position.</p>
    <p style="font-family:var(--font-mono);font-size:12.5px;color:#0F6E56;margin:0;">Example: p=[1,2,3], q=[1,2,3] =&gt; true; p=[1,2], q=[1,null,2] =&gt; false</p>
  </div>
</div>

<div class="section">
  <p class="section-label">01 · The definition</p>
  <div class="rule-box" style="margin-bottom:0.75rem;">
    <p class="rule-text">Same structure AND same values at every corresponding node</p>
  </div>
  <p style="font-size:14px;color:var(--color-text-secondary);margin:0;">Both trees must be null at the same positions, and where they are not null, each pair of nodes must have equal values.</p>
</div>

<div class="section">
  <p class="section-label">02 · The key insight</p>
  <div class="card">
    <div class="step-row"><div class="step-num">1</div><div><div class="step-text">If both nodes are null, return True</div><div class="step-sub">Both branches ended at the same shape position.</div></div></div>
    <div class="step-row"><div class="step-num">2</div><div><div class="step-text">If only one is null, return False</div><div class="step-sub">This catches structure mismatch immediately.</div></div></div>
    <div class="step-row" style="margin-bottom:0;"><div class="step-num">3</div><div><div class="step-text">Compare values, then recurse left AND right</div><div class="step-sub">Both subtree comparisons must pass.</div></div></div>
  </div>
</div>

<div class="section">
  <p class="section-label">03 · Code (Python)</p>
  <div class="code-block">
    <div><span class="c-kw">class </span><span class="c-fn">Solution</span><span class="c-plain">:</span></div>
    <div><span class="c-plain">  </span><span class="c-kw">def </span><span class="c-fn">isSameTree</span><span class="c-plain">(self, p, q) -> bool:</span></div>
    <div><span class="c-plain">    </span><span class="c-kw">if not </span><span class="c-plain">p </span><span class="c-kw">and not </span><span class="c-plain">q: </span><span class="c-kw">return True</span></div>
    <div><span class="c-plain">    </span><span class="c-kw">if not </span><span class="c-plain">p </span><span class="c-kw">or not </span><span class="c-plain">q: </span><span class="c-kw">return False</span></div>
    <div><span class="c-plain">    </span><span class="c-kw">if </span><span class="c-plain">p.val != q.val: </span><span class="c-kw">return False</span></div>
    <div><span class="c-plain">    </span><span class="c-kw">return </span><span class="c-plain">self.</span><span class="c-fn">isSameTree</span><span class="c-plain">(p.left, q.left) </span><span class="c-kw">and </span><span class="c-plain">self.</span><span class="c-fn">isSameTree</span><span class="c-plain">(p.right, q.right)</span></div>
  </div>
</div>

<div class="section" style="margin-bottom:0;">
  <p class="section-label">04 · Complexity</p>
  <div class="complexity-grid">
    <div class="complexity-card" style="background:#E1F5EE;"><div class="complexity-label" style="color:#0F6E56;">Time</div><div class="complexity-value" style="color:#085041;">O(n)</div><div class="complexity-why" style="color:#0F6E56;">Worst case visits all corresponding nodes.</div></div>
    <div class="complexity-card" style="background:#EEEDFE;"><div class="complexity-label" style="color:#534AB7;">Space</div><div class="complexity-value" style="color:#3C3489;">O(h)</div><div class="complexity-why" style="color:#534AB7;">Recursion depth equals tree height.</div></div>
  </div>
</div>
`;

const DEEP_MODE_HTML = String.raw`
<hr class="divider" style="margin-top:0;">

<div class="deep-section">
  <p class="section-label">01 · Understanding the problem — what does "same" really mean?</p>
  <h2 class="section-title">Two conditions must both hold, everywhere</h2>
  <p class="deep-para">Two trees are considered the same only when they satisfy <em>both</em> of these at every position simultaneously:</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1rem;">
    <div style="background:#E1F5EE;border-radius:var(--border-radius-md);padding:14px 16px;">
      <p style="font-size:12px;font-weight:500;color:#0F6E56;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.07em;">Structural Identity</p>
      <p style="font-size:13px;color:#085041;margin:0;line-height:1.7;">Both trees have a node at every exact same position. They reach <code>null</code> at the same places — no node is missing on one side.</p>
    </div>
    <div style="background:#E6F1FB;border-radius:var(--border-radius-md);padding:14px 16px;">
      <p style="font-size:12px;font-weight:500;color:#185FA5;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.07em;">Value Identity</p>
      <p style="font-size:13px;color:#0C447C;margin:0;line-height:1.7;">At every matching position, the node values are equal. Same structure with different values (like Example 3) is still <em>not</em> the same tree.</p>
    </div>
  </div>
  <div class="callout callout-warn">
    <p><strong style="font-weight:500;">Common trap:</strong> Two trees with the same set of values but different shapes are <em>not</em> the same tree. The value <code>2</code> on the left in one tree vs the right in another counts as a mismatch.</p>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">02 · Why recursion fits perfectly here</p>
  <h2 class="section-title">The problem is self-similar by nature</h2>
  <p class="deep-para">A binary tree is defined recursively: a node with a left subtree and a right subtree. The "Same Tree" question is also inherently recursive — two trees are the same if their roots match <em>and</em> their left subtrees are the same <em>and</em> their right subtrees are the same. The problem definition <em>is</em> the recursive formula.</p>
  <div class="callout callout-info">
    <p><strong style="font-weight:500;">The recursive formula:</strong> isSameTree(p, q) = (p.val == q.val) AND isSameTree(p.left, q.left) AND isSameTree(p.right, q.right)</p>
  </div>
  <p class="deep-para">The base cases handle the stopping conditions: if both reach <code>null</code> simultaneously, the subtrees match. If only one reaches <code>null</code>, there is a structural mismatch and we immediately return <code>False</code>.</p>

  <div style="display:flex;justify-content:center;margin:1.5rem 0;">
    <svg viewBox="0 0 420 230" width="400" height="220" xmlns="http://www.w3.org/2000/svg">
      <text x="90" y="16" text-anchor="middle" font-size="11" font-weight="500" fill="var(--color-text-secondary)">Tree p</text>
      <line x1="90" y1="38" x2="50" y2="90" stroke="#9FE1CB" stroke-width="1.5"/>
      <line x1="90" y1="38" x2="130" y2="90" stroke="#9FE1CB" stroke-width="1.5"/>
      <line x1="50" y1="108" x2="30" y2="158" stroke="#9FE1CB" stroke-width="1.5"/>
      <line x1="50" y1="108" x2="70" y2="158" stroke="#9FE1CB" stroke-width="1.5"/>
      <circle cx="90" cy="34" r="22" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="90" y="39" text-anchor="middle" font-size="13" font-weight="500" fill="#085041">1</text>
      <circle cx="50" cy="104" r="22" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="50" y="109" text-anchor="middle" font-size="13" font-weight="500" fill="#085041">2</text>
      <circle cx="130" cy="104" r="22" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="130" y="109" text-anchor="middle" font-size="13" font-weight="500" fill="#085041">3</text>
      <circle cx="30" cy="163" r="18" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="30" y="168" text-anchor="middle" font-size="12" font-weight="500" fill="#085041">4</text>
      <circle cx="70" cy="163" r="18" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="70" y="168" text-anchor="middle" font-size="12" font-weight="500" fill="#085041">5</text>

      <line x1="170" y1="34" x2="250" y2="34" stroke="#1D9E75" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="210" y="29" text-anchor="middle" font-size="10" fill="#1D9E75">1=1 ✓</text>
      <line x1="170" y1="104" x2="250" y2="104" stroke="#1D9E75" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="210" y="99" text-anchor="middle" font-size="10" fill="#1D9E75">2=2 ✓</text>
      <line x1="155" y1="104" x2="245" y2="104" stroke="none"/>
      <line x1="155" y1="104" x2="245" y2="104" stroke="none"/>
      <text x="210" y="148" text-anchor="middle" font-size="10" fill="#1D9E75">3=3 ✓</text>
      <line x1="170" y1="163" x2="250" y2="163" stroke="#1D9E75" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="210" y="158" text-anchor="middle" font-size="10" fill="#1D9E75">4=4 ✓</text>
      <text x="210" y="188" text-anchor="middle" font-size="10" fill="#1D9E75">5=5 ✓</text>

      <text x="330" y="16" text-anchor="middle" font-size="11" font-weight="500" fill="var(--color-text-secondary)">Tree q</text>
      <line x1="330" y1="38" x2="290" y2="90" stroke="#9FE1CB" stroke-width="1.5"/>
      <line x1="330" y1="38" x2="370" y2="90" stroke="#9FE1CB" stroke-width="1.5"/>
      <line x1="290" y1="108" x2="270" y2="158" stroke="#9FE1CB" stroke-width="1.5"/>
      <line x1="290" y1="108" x2="310" y2="158" stroke="#9FE1CB" stroke-width="1.5"/>
      <circle cx="330" cy="34" r="22" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="330" y="39" text-anchor="middle" font-size="13" font-weight="500" fill="#085041">1</text>
      <circle cx="290" cy="104" r="22" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="290" y="109" text-anchor="middle" font-size="13" font-weight="500" fill="#085041">2</text>
      <circle cx="370" cy="104" r="22" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="370" y="109" text-anchor="middle" font-size="13" font-weight="500" fill="#085041">3</text>
      <circle cx="270" cy="163" r="18" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="270" y="168" text-anchor="middle" font-size="12" font-weight="500" fill="#085041">4</text>
      <circle cx="310" cy="163" r="18" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="310" y="168" text-anchor="middle" font-size="12" font-weight="500" fill="#085041">5</text>

      <text x="210" y="215" text-anchor="middle" font-size="12" font-weight="500" fill="#0F6E56">All nodes match → isSameTree = true ✓</text>
    </svg>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">03 · The real-world analogy</p>
  <h2 class="section-title">Think of it like comparing two identical blueprints</h2>
  <div class="analogy-box" style="margin-bottom:1rem;">
    <p class="analogy-text">Imagine two architectural blueprints. You place them on top of each other and check room by room. "Same Tree" is exactly that — you walk both trees in lockstep. At every node you ask: do both blueprints have a room here, and do the rooms have the same label? If you ever find a room in one but not the other, or two rooms with different labels, the blueprints are different. Only if every single room matches perfectly do you declare them identical.</p>
  </div>
  <div class="callout callout-success">
    <p><strong style="font-weight:500;">The key word is "lockstep":</strong> we traverse both trees simultaneously, always comparing the same relative position in each tree. The recursion naturally enforces this — each call handles one pair of corresponding nodes.</p>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">04 · Understanding the code — every line explained</p>
  <h2 class="section-title">Why each check is in the exact order it is</h2>
  <div class="code-block" style="margin-bottom:1.25rem;">
    <div><span class="c-kw">def </span><span class="c-fn">isSameTree</span><span class="c-plain">(self, p, q) -> </span><span class="c-fn">bool</span><span class="c-plain">:</span></div>
    <div><span class="c-plain">  </span><span class="c-kw">if not </span><span class="c-plain">p </span><span class="c-kw">and not </span><span class="c-plain">q: </span><span class="c-kw">return True</span>  <span class="c-cm"># ① both null</span></div>
    <div><span class="c-plain">  </span><span class="c-kw">if not </span><span class="c-plain">p </span><span class="c-kw">or not </span><span class="c-plain">q: </span><span class="c-kw">return False</span> <span class="c-cm"># ② exactly one null</span></div>
    <div><span class="c-plain">  </span><span class="c-kw">if </span><span class="c-plain">p.val != q.val: </span><span class="c-kw">return False</span>  <span class="c-cm"># ③ value mismatch</span></div>
    <div><span class="c-kw">  return </span><span class="c-plain">(self.</span><span class="c-fn">isSameTree</span><span class="c-plain">(p.left,  q.left)</span>  <span class="c-cm"># ④ left subtrees</span></div>
    <div><span class="c-plain">          </span><span class="c-kw">and </span><span class="c-plain">self.</span><span class="c-fn">isSameTree</span><span class="c-plain">(p.right, q.right))</span>  <span class="c-cm"># ⑤ right subtrees</span></div>
  </div>

  <div class="qa-block">
    <div class="qa-q">① Why does "both null → True" come first?</div>
    <div class="qa-a">This is the success base case. When both pointers reach <code>null</code> simultaneously, it means both trees ended at exactly the same depth on this branch — they matched all the way down. We must check this <em>before</em> accessing <code>.val</code>, because calling <code>p.val</code> on a null node would crash.</div>
  </div>
  <div class="qa-block">
    <div class="qa-q">② What does "exactly one null → False" catch?</div>
    <div class="qa-a">After check ①, we know they are <em>not</em> both null. So if either one is null now, the other must be non-null — a structural mismatch. One tree has a node where the other has a gap. This is the failure base case for structure. We return <code>False</code> immediately.</div>
  </div>
  <div class="qa-block">
    <div class="qa-q">③ After two null checks, why check values before recursing?</div>
    <div class="qa-a">After checks ① and ②, we know both <code>p</code> and <code>q</code> are non-null. It's now safe to access <code>.val</code>. We compare values here — before recursing — because it's a cheap O(1) check that might save us an entire subtree traversal. If the values already differ, there's no point descending further.</div>
  </div>
  <div class="qa-block">
    <div class="qa-q">④⑤ Why does Python's <code>and</code> give us short-circuit behavior?</div>
    <div class="qa-a">Python evaluates <code>A and B</code> lazily: if <code>A</code> is <code>False</code>, it never evaluates <code>B</code>. So if the left subtree comparison fails, the right subtree is never traversed. In the worst case (all nodes match) we visit every node; in the average case we terminate early as soon as the first mismatch is found.</div>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">05 · Structural mismatch — diagrams for all 3 fail cases</p>
  <h2 class="section-title">Seeing exactly what triggers each return False</h2>

  <p style="font-size:13px;font-weight:500;color:var(--color-text-primary);margin:0 0 8px;">Case A — Structural mismatch (p=[1,2], q=[1,null,2])</p>
  <div style="display:flex;justify-content:center;margin-bottom:1.5rem;">
    <svg viewBox="0 0 360 175" width="340" height="165" xmlns="http://www.w3.org/2000/svg">
      <text x="70" y="14" text-anchor="middle" font-size="10" fill="var(--color-text-tertiary)">p = [1, 2]</text>
      <line x1="70" y1="35" x2="40" y2="82" stroke="#9FE1CB" stroke-width="1.5"/>
      <circle cx="70" cy="31" r="20" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="70" y="36" text-anchor="middle" font-size="13" font-weight="500" fill="#085041">1</text>
      <circle cx="40" cy="86" r="20" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="40" y="91" text-anchor="middle" font-size="13" font-weight="500" fill="#085041">2</text>
      <text x="100" y="91" font-size="11" fill="var(--color-text-tertiary)" text-anchor="middle">∅</text>

      <text x="70" y="120" text-anchor="middle" font-size="10" fill="#0F6E56">p.left=2 ✓</text>
      <text x="70" y="135" text-anchor="middle" font-size="10" fill="#E24B4A">p.right=∅, q.right=2 ✗</text>

      <text x="180" y="80" text-anchor="middle" font-size="22" fill="#E24B4A">≠</text>

      <text x="290" y="14" text-anchor="middle" font-size="10" fill="var(--color-text-tertiary)">q = [1, null, 2]</text>
      <line x1="290" y1="35" x2="320" y2="82" stroke="#F7C1C1" stroke-width="1.5"/>
      <circle cx="290" cy="31" r="20" fill="#FCEBEB" stroke="#E24B4A" stroke-width="1.5"/>
      <text x="290" y="36" text-anchor="middle" font-size="13" font-weight="500" fill="#791F1F">1</text>
      <text x="260" y="91" font-size="11" fill="var(--color-text-tertiary)" text-anchor="middle">∅</text>
      <circle cx="320" cy="86" r="20" fill="#FCEBEB" stroke="#E24B4A" stroke-width="1.5"/>
      <text x="320" y="91" text-anchor="middle" font-size="13" font-weight="500" fill="#791F1F">2</text>

      <rect x="90" y="148" width="180" height="22" rx="4" fill="#FCEBEB"/>
      <text x="180" y="163" text-anchor="middle" font-size="11" fill="#A32D2D">check ② triggers: one null, one not</text>
    </svg>
  </div>

  <p style="font-size:13px;font-weight:500;color:var(--color-text-primary);margin:0 0 8px;">Case B — Value mismatch (p=[1,2,1], q=[1,1,2])</p>
  <div style="display:flex;justify-content:center;margin-bottom:1.5rem;">
    <svg viewBox="0 0 360 175" width="340" height="165" xmlns="http://www.w3.org/2000/svg">
      <text x="70" y="14" text-anchor="middle" font-size="10" fill="var(--color-text-tertiary)">p = [1, 2, 1]</text>
      <line x1="70" y1="35" x2="38" y2="82" stroke="#9FE1CB" stroke-width="1.5"/>
      <line x1="70" y1="35" x2="102" y2="82" stroke="#9FE1CB" stroke-width="1.5"/>
      <circle cx="70" cy="31" r="20" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="70" y="36" text-anchor="middle" font-size="13" font-weight="500" fill="#085041">1</text>
      <circle cx="38" cy="86" r="20" fill="#FCEBEB" stroke="#E24B4A" stroke-width="2"/>
      <text x="38" y="91" text-anchor="middle" font-size="13" font-weight="500" fill="#791F1F">2</text>
      <circle cx="102" cy="86" r="20" fill="#E1F5EE" stroke="#1D9E75" stroke-width="1.5"/>
      <text x="102" y="91" text-anchor="middle" font-size="13" font-weight="500" fill="#085041">1</text>
      <text x="38" y="116" text-anchor="middle" font-size="9" fill="#E24B4A">p.left=2</text>

      <text x="180" y="80" text-anchor="middle" font-size="22" fill="#E24B4A">≠</text>

      <text x="290" y="14" text-anchor="middle" font-size="10" fill="var(--color-text-tertiary)">q = [1, 1, 2]</text>
      <line x1="290" y1="35" x2="258" y2="82" stroke="#F7C1C1" stroke-width="1.5"/>
      <line x1="290" y1="35" x2="322" y2="82" stroke="#F7C1C1" stroke-width="1.5"/>
      <circle cx="290" cy="31" r="20" fill="#FCEBEB" stroke="#E24B4A" stroke-width="1.5"/>
      <text x="290" y="36" text-anchor="middle" font-size="13" font-weight="500" fill="#791F1F">1</text>
      <circle cx="258" cy="86" r="20" fill="#FCEBEB" stroke="#E24B4A" stroke-width="2"/>
      <text x="258" y="91" text-anchor="middle" font-size="13" font-weight="500" fill="#791F1F">1</text>
      <circle cx="322" cy="86" r="20" fill="#FCEBEB" stroke="#E24B4A" stroke-width="1.5"/>
      <text x="322" y="91" text-anchor="middle" font-size="13" font-weight="500" fill="#791F1F">2</text>
      <text x="258" y="116" text-anchor="middle" font-size="9" fill="#E24B4A">q.left=1</text>

      <rect x="90" y="140" width="180" height="22" rx="4" fill="#FCEBEB"/>
      <text x="180" y="155" text-anchor="middle" font-size="11" fill="#A32D2D">check ③ triggers: 2 ≠ 1 at left child</text>
    </svg>
  </div>

  <div class="callout callout-info">
    <p>Notice that in Case B, the root comparison (<code>1 == 1</code>) passes. The mismatch is found only when we recurse into the left children. This is why we must always recurse all the way down — a match at the root does not guarantee a match in the subtrees.</p>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">06 · Full trace — Example 1: p=[1,2,3], q=[1,2,3]</p>
  <h2 class="section-title">Walking through every recursive call</h2>
  <p class="deep-para" style="margin-bottom:1.5rem;">Both trees are identical: root=1, left=2, right=3. Let's trace every call and return value.</p>

  <div class="trace-step">
    <span class="trace-badge trace-going">Call</span>
    <div class="trace-content">
      <p class="trace-title">isSameTree(p=1, q=1)</p>
      <p class="trace-desc">Neither is null. Values match: 1 == 1. Recurse left.</p>
    </div>
  </div>
  <div class="trace-step">
    <span class="trace-badge trace-going">Call</span>
    <div class="trace-content">
      <p class="trace-title">isSameTree(p=2, q=2)</p>
      <p class="trace-desc">Neither is null. Values match: 2 == 2. Recurse left.</p>
    </div>
  </div>
  <div class="trace-step">
    <span class="trace-badge trace-base">Base ①</span>
    <div class="trace-content">
      <p class="trace-title">isSameTree(p=null, q=null) → True</p>
      <p class="trace-desc">p=2 has no left child, q=2 has no left child. Both null simultaneously. Returns True.</p>
    </div>
  </div>
  <div class="trace-step">
    <span class="trace-badge trace-going">Call</span>
    <div class="trace-content">
      <p class="trace-title">isSameTree(p=null, q=null) → True &nbsp;[right of 2]</p>
      <p class="trace-desc">p=2 has no right child, q=2 has no right child. Both null. Returns True.</p>
    </div>
  </div>
  <div class="trace-step">
    <span class="trace-badge trace-match">True</span>
    <div class="trace-content">
      <p class="trace-title">isSameTree(p=2, q=2) → True and True → True</p>
      <p class="trace-desc">Both left and right subtrees of node 2 match. Returns True up to the root call.</p>
    </div>
  </div>
  <div class="trace-step">
    <span class="trace-badge trace-going">Call</span>
    <div class="trace-content">
      <p class="trace-title">isSameTree(p=3, q=3) &nbsp;[right child of root]</p>
      <p class="trace-desc">Neither is null. Values match: 3 == 3. Node 3 is a leaf — both children are null.</p>
    </div>
  </div>
  <div class="trace-step">
    <span class="trace-badge trace-match">True</span>
    <div class="trace-content">
      <p class="trace-title">isSameTree(p=3, q=3) → True</p>
      <p class="trace-desc">Both null checks on children pass. Returns True.</p>
    </div>
  </div>
  <div class="trace-step" style="margin-bottom:0;">
    <span class="trace-badge trace-match">True ✓</span>
    <div class="trace-content">
      <p class="trace-title">isSameTree(p=1, q=1) → True and True → True</p>
      <p class="trace-desc">Left subtree (rooted at 2) matched. Right subtree (rooted at 3) matched. Final answer: <strong style="font-weight:500;">true</strong>.</p>
    </div>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">07 · Full trace — Example 2: p=[1,2], q=[1,null,2]  (early exit)</p>
  <h2 class="section-title">Watching the short-circuit fire</h2>
  <p class="deep-para" style="margin-bottom:1.5rem;">p has node 2 as its left child. q has <code>null</code> as its left child and 2 as its right child. We'll see check ② fire quickly.</p>

  <div class="trace-step">
    <span class="trace-badge trace-going">Call</span>
    <div class="trace-content">
      <p class="trace-title">isSameTree(p=1, q=1)</p>
      <p class="trace-desc">Both non-null. 1 == 1. Recurse into left children.</p>
    </div>
  </div>
  <div class="trace-step">
    <span class="trace-badge trace-mismatch">False ②</span>
    <div class="trace-content">
      <p class="trace-title">isSameTree(p=2, q=null) → False</p>
      <p class="trace-desc">p has a left child (node 2), q has no left child (null). Check ② fires: one is null, the other isn't. Returns False immediately.</p>
    </div>
  </div>
  <div class="trace-step" style="margin-bottom:0;">
    <span class="trace-badge trace-mismatch">False ✗</span>
    <div class="trace-content">
      <p class="trace-title">isSameTree(p=1, q=1) → False and [skipped] → False</p>
      <p class="trace-desc">Left returned False. Python's <code>and</code> short-circuits — the right subtree (q's node 2) is <strong style="font-weight:500;">never visited</strong>. Final answer: <strong style="font-weight:500;">false</strong>.</p>
    </div>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">08 · Common beginner mistakes</p>
  <h2 class="section-title">What trips people up</h2>
  <div class="card" style="padding:0.75rem 1.5rem;">
    <div class="mistake-row">
      <div class="mistake-x">✕</div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Checking values before null guards</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Writing <code>if p.val != q.val: return False</code> as the very first line crashes on null nodes because <code>None.val</code> doesn't exist. Always handle the null base cases before touching any node attribute.</p>
      </div>
    </div>
    <div class="mistake-row">
      <div class="mistake-x">✕</div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Merging the two null checks into one with <code>or</code></p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Writing <code>if not p or not q: return False</code> first incorrectly returns False when <em>both</em> are null — that's actually a success case. The both-null check must come first and return True.</p>
      </div>
    </div>
    <div class="mistake-row">
      <div class="mistake-x">✕</div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Only comparing root values</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Checking <code>p.val == q.val</code> at the root and declaring the trees the same ignores the entire rest of both trees. You must recurse into all children.</p>
      </div>
    </div>
    <div class="mistake-row" style="border:none;">
      <div class="mistake-x">✕</div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Using <code>or</code> instead of <code>and</code> for the recursive return</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;"><code>return left_match or right_match</code> would say the trees are identical even if only one side matches. Both subtrees must match — always use <code>and</code>.</p>
      </div>
    </div>
  </div>
</div>

<div class="deep-section">
  <p class="section-label">09 · Complexity — the full explanation</p>
  <h2 class="section-title">Why O(n) time and O(h) space?</h2>
  <div class="complexity-grid" style="margin-bottom:1rem;">
    <div class="complexity-card" style="background:#E1F5EE;">
      <div class="complexity-label" style="color:#0F6E56;">Time</div>
      <div class="complexity-value" style="color:#085041;">O(n)</div>
      <div class="complexity-why" style="color:#0F6E56;">In the worst case (both trees are identical) every node in both trees is visited once. The short-circuit means we may visit fewer nodes when trees differ — O(n) is the upper bound.</div>
    </div>
    <div class="complexity-card" style="background:#EEEDFE;">
      <div class="complexity-label" style="color:#534AB7;">Space</div>
      <div class="complexity-value" style="color:#3C3489;">O(h)</div>
      <div class="complexity-why" style="color:#534AB7;">The call stack holds one frame per level of tree depth. O(log n) for a balanced tree, O(n) for a skewed tree (like a linked list chain).</div>
    </div>
  </div>
  <div class="callout callout-warn">
    <p><strong style="font-weight:500;">Interview tip:</strong> Always mention the short-circuit: "In the best case, we exit after the very first node pair fails, making the average case much better than O(n). The worst case is when the trees are identical — we visit every node." This shows you understand both bounds.</p>
  </div>
</div>

<div class="deep-section" style="margin-bottom:0;">
  <p class="section-label">10 · Related problems</p>
  <h2 class="section-title">Where this pattern shows up</h2>
  <div class="card" style="padding:0.75rem 1.5rem;">
    <div class="interview-item">
      <div class="interview-dot"></div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Subtree of Another Tree (LeetCode 572)</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Calls <code>isSameTree</code> as a subroutine. For every node in the large tree, check if the subtree rooted there is the same as the small tree. This problem <em>is</em> Same Tree with an outer traversal wrapper.</p>
      </div>
    </div>
    <div class="interview-item">
      <div class="interview-dot"></div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Symmetric Tree (LeetCode 101)</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Structurally identical to Same Tree but the comparison is mirrored: check if <code>p.left</code> matches <code>q.right</code> and <code>p.right</code> matches <code>q.left</code>. Same 3-check pattern, different pairing.</p>
      </div>
    </div>
    <div class="interview-item">
      <div class="interview-dot"></div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Leaf-Similar Trees (LeetCode 872)</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">Collect the leaf-value sequences of both trees using DFS, then compare the two lists. It's a looser version of Same Tree — only the leaf layer must match, not the full structure.</p>
      </div>
    </div>
    <div class="interview-item" style="border:none;">
      <div class="interview-dot"></div>
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--color-text-primary);margin:0 0 3px;">Flip Equivalent Binary Trees (LeetCode 951)</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;line-height:1.6;">An extension where at each node you're allowed to swap children. The base cases are the same; the recursive step checks both the straight and flipped variants. Master Same Tree first to approach this comfortably.</p>
      </div>
    </div>
  </div>
</div>
`;

export default function SameTreeGuidePage() {
  const [mode, setMode] = useState<"quick" | "deep">("quick");

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/20">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#e0f2fe_0%,transparent_48%),radial-gradient(ellipse_at_bottom_left,#e2f6ef_0%,transparent_52%)]" />
      <div className="same-tree-readhere-wrapper relative z-[1]">
        <style jsx global>{`
          .same-tree-readhere-wrapper, .same-tree-readhere-wrapper * { box-sizing: border-box; margin: 0; padding: 0; }
          .same-tree-readhere-wrapper { --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; --color-text-primary: #1a1a2e; --color-text-secondary: #4a4a6a; --color-text-tertiary: #7a7a9a; --color-background-primary: #ffffff; --color-background-secondary: #f5f5fa; --color-border-tertiary: #e0e0ee; --border-radius-lg: 12px; --border-radius-md: 8px; background: transparent; font-family: var(--font-sans); color: var(--color-text-primary); }
          .same-tree-readhere-wrapper .page { max-width: 860px; margin: 0 auto; padding: 2rem 1.5rem; }
          .same-tree-readhere-wrapper .badge { display: inline-block; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px; }
          .same-tree-readhere-wrapper .badge-teal { background: #E1F5EE; color: #0F6E56; }
          .same-tree-readhere-wrapper .badge-amber { background: #FAEEDA; color: #854F0B; }
          .same-tree-readhere-wrapper .badge-purple { background: #EEEDFE; color: #3C3489; }
          .same-tree-readhere-wrapper .section { margin-bottom: 2.5rem; }
          .same-tree-readhere-wrapper .section-label { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-tertiary); margin-bottom: 0.5rem; }
          .same-tree-readhere-wrapper .section-title { font-size: 18px; font-weight: 500; color: var(--color-text-primary); margin: 0 0 1rem; }
          .same-tree-readhere-wrapper .card { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.25rem 1.5rem; }
          .same-tree-readhere-wrapper .rule-box { background: #E1F5EE; padding: 1rem 1.25rem; border-left: 3px solid #1D9E75; }
          .same-tree-readhere-wrapper .rule-text { font-size: 18px; font-weight: 500; color: #085041; line-height: 1.6; }
          .same-tree-readhere-wrapper .step-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 0.85rem; }
          .same-tree-readhere-wrapper .step-num { width: 26px; height: 26px; border-radius: 50%; background: #E1F5EE; color: #0F6E56; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .same-tree-readhere-wrapper .step-text { font-size: 15px; color: var(--color-text-primary); line-height: 1.6; padding-top: 3px; }
          .same-tree-readhere-wrapper .step-sub { font-size: 13px; color: var(--color-text-secondary); margin-top: 2px; }
          .same-tree-readhere-wrapper .code-block { background: #1e1e2e; border-radius: var(--border-radius-md); padding: 1.25rem 1.5rem; font-family: var(--font-mono); font-size: 13.5px; line-height: 2; overflow-x: auto; }
          .same-tree-readhere-wrapper .c-kw { color: #cba6f7; } .same-tree-readhere-wrapper .c-fn { color: #89b4fa; } .same-tree-readhere-wrapper .c-cm { color: #6c7086; font-style: italic; } .same-tree-readhere-wrapper .c-plain { color: #cdd6f4; }
          .same-tree-readhere-wrapper .complexity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .same-tree-readhere-wrapper .complexity-card { border-radius: var(--border-radius-md); padding: 1rem 1.25rem; }
          .same-tree-readhere-wrapper .complexity-label { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
          .same-tree-readhere-wrapper .complexity-value { font-size: 28px; font-weight: 500; font-family: var(--font-mono); }
          .same-tree-readhere-wrapper .complexity-why { font-size: 13px; margin-top: 6px; }
          .same-tree-readhere-wrapper .hero-title { font-size: 28px; font-weight: 500; color: var(--color-text-primary); margin: 0 0 6px; }
          .same-tree-readhere-wrapper .hero-sub { font-size: 15px; color: var(--color-text-secondary); margin: 0 0 1.5rem; }
          .same-tree-readhere-wrapper .hero-tags { display: flex; gap: 8px; flex-wrap: wrap; }
          .same-tree-readhere-wrapper .divider { border: none; border-top: 0.5px solid var(--color-border-tertiary); margin: 2rem 0; }
          .same-tree-readhere-wrapper .mode-toggle { display: flex; background: var(--color-background-secondary); border-radius: 10px; padding: 4px; gap: 4px; width: fit-content; margin-bottom: 2rem; border: 0.5px solid var(--color-border-tertiary); }
          .same-tree-readhere-wrapper .mode-btn { padding: 7px 20px; border-radius: 8px; border: none; background: transparent; font-size: 13px; font-weight: 500; color: var(--color-text-secondary); cursor: pointer; transition: all 0.18s ease; }
          .same-tree-readhere-wrapper .mode-btn.active { background: var(--color-background-primary); color: var(--color-text-primary); border: 0.5px solid var(--color-border-tertiary); }
          .same-tree-readhere-wrapper .mode-desc { font-size: 12px; color: var(--color-text-tertiary); margin-bottom: 2rem; }
          .same-tree-readhere-wrapper .deep-section { margin-bottom: 3rem; }
          .same-tree-readhere-wrapper .callout { border-radius: var(--border-radius-md); padding: 1rem 1.25rem; margin: 1rem 0; }
          .same-tree-readhere-wrapper .callout-info { background: #E6F1FB; border-left: 3px solid #378ADD; border-radius: 0; }
          .same-tree-readhere-wrapper .callout-info p { color: #0C447C; font-size: 14px; line-height: 1.7; margin: 0; }
          .same-tree-readhere-wrapper .callout-warn { background: #FAEEDA; border-left: 3px solid #EF9F27; border-radius: 0; }
          .same-tree-readhere-wrapper .callout-warn p { color: #633806; font-size: 14px; line-height: 1.7; margin: 0; }
          .same-tree-readhere-wrapper .analogy-box { background: #FAEEDA; border-radius: var(--border-radius-md); padding: 1rem 1.25rem; }
          .same-tree-readhere-wrapper .analogy-text { font-size: 15px; color: #633806; line-height: 1.7; margin: 0; }
          .same-tree-readhere-wrapper .deep-para { font-size: 15px; color: var(--color-text-primary); line-height: 1.8; margin: 0 0 1rem; }
          .same-tree-readhere-wrapper .qa-block { border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); overflow: hidden; margin-bottom: 12px; }
          .same-tree-readhere-wrapper .qa-q { background: var(--color-background-secondary); padding: 0.9rem 1.25rem; font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
          .same-tree-readhere-wrapper .qa-a { padding: 0.9rem 1.25rem; font-size: 14px; color: var(--color-text-primary); line-height: 1.7; border-top: 0.5px solid var(--color-border-tertiary); }
          .same-tree-readhere-wrapper .trace-step { display: flex; gap: 14px; margin-bottom: 1.25rem; align-items: flex-start; }
          .same-tree-readhere-wrapper .trace-badge { min-width: 72px; font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 20px; text-align: center; }
          .same-tree-readhere-wrapper .trace-going { background: #E6F1FB; color: #185FA5; }
          .same-tree-readhere-wrapper .trace-base { background: #EEEDFE; color: #534AB7; }
          .same-tree-readhere-wrapper .trace-match { background: #E1F5EE; color: #0F6E56; }
          .same-tree-readhere-wrapper .trace-mismatch { background: #FCEBEB; color: #A32D2D; }
          .same-tree-readhere-wrapper .trace-back { background: #FAEEDA; color: #854F0B; }
          .same-tree-readhere-wrapper .trace-title { font-size: 14px; font-weight: 500; color: var(--color-text-primary); margin: 0 0 3px; }
          .same-tree-readhere-wrapper .trace-desc { font-size: 13px; color: var(--color-text-secondary); line-height: 1.6; margin: 0; }
          .same-tree-readhere-wrapper .mistake-row { display: flex; gap: 12px; padding: 12px 0; border-bottom: 0.5px solid var(--color-border-tertiary); align-items: flex-start; }
          .same-tree-readhere-wrapper .mistake-x { width: 20px; height: 20px; border-radius: 50%; background: #FCEBEB; color: #A32D2D; font-size: 12px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
          .same-tree-readhere-wrapper .interview-item { display: flex; gap: 10px; padding: 10px 0; border-bottom: 0.5px solid var(--color-border-tertiary); }
          .same-tree-readhere-wrapper .interview-item:last-child { border-bottom: none; }
          .same-tree-readhere-wrapper .interview-dot { width: 8px; height: 8px; border-radius: 50%; background: #1D9E75; flex-shrink: 0; margin-top: 7px; }
        `}</style>

        <div className="page">
          <div className="section">
            <div className="flex items-center justify-between mb-3" style={{ marginBottom: "12px" }}>
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-emerald-500" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Binary Tree · DFS</span>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/problems/binary-tree/same-tree" className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  Visual Editor
                </Link>
                <Link href="/problems/topics/trees" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                  Tree Problems
                </Link>
              </div>
            </div>

            <p className="section-label">Binary Tree · Recursion · DFS</p>
            <h1 className="hero-title">Same Tree</h1>
            <p className="hero-sub">Given roots p and q, decide whether the two trees are structurally identical and have the same values at corresponding nodes.</p>
            <div className="hero-tags" style={{ marginBottom: "1.5rem" }}>
              <span className="badge badge-teal">DFS · Recursion</span>
              <span className="badge badge-purple">Tree Comparison</span>
              <span className="badge badge-amber">LeetCode #100 · Easy</span>
            </div>

            <div className="mode-toggle">
              <button className={`mode-btn ${mode === "quick" ? "active" : ""}`} onClick={() => setMode("quick")}>Quick Recap</button>
              <button className={`mode-btn ${mode === "deep" ? "active" : ""}`} onClick={() => setMode("deep")}>Deep Explain</button>
            </div>
            <p className="mode-desc">{mode === "quick" ? "Key concepts at a glance — for those who already know the basics." : "A full beginner-friendly walkthrough — understand it from scratch."}</p>
          </div>

          {mode === "quick" ? <div dangerouslySetInnerHTML={{ __html: QUICK_MODE_HTML }} /> : <div dangerouslySetInnerHTML={{ __html: DEEP_MODE_HTML }} />}

          <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 3px" }}>Practice on LeetCode</p>
              <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: 0 }}>Try #572 (Subtree of Another Tree) next — it uses isSameTree as a direct helper.</p>
            </div>
            <a href="https://leetcode.com/problems/same-tree/" target="_blank" rel="noreferrer" style={{ fontSize: "13px", padding: "8px 18px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-primary)", cursor: "pointer", fontFamily: "var(--font-sans)", color: "inherit", textDecoration: "none" }}>Open on LeetCode ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}
