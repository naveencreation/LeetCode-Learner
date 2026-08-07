import type { ListNode, LinkedListNodeState } from "../shared/linked-list-types";
import type {
  ExecutionStep,
  PointerSnapshot,
  ReorderOperationType,
  ReorderPhase,
  ReorderSeverity,
  ReorderStepMetadata,
} from "./types";

// ── Clone helpers ──────────────────────────────────────────────────────────

function cloneStates(
  s: Record<number, LinkedListNodeState>,
): Record<number, LinkedListNodeState> {
  return { ...s };
}

function cloneLinks(
  l: Record<number, number | null>,
): Record<number, number | null> {
  return { ...l };
}

function snap(p: PointerSnapshot): PointerSnapshot {
  return { ...p };
}

// ── Metadata factory ───────────────────────────────────────────────────────

function meta(
  phase: ReorderPhase,
  severity: ReorderSeverity,
  title: string,
  description: string,
  badge: string,
  tip?: string,
): ReorderStepMetadata {
  return { phase, severity, title, description, badge, tip };
}

// ── Push one step ──────────────────────────────────────────────────────────

function pushStep(
  steps: ExecutionStep[],
  type: ReorderOperationType,
  operation: string,
  metadata: ReorderStepMetadata,
  nodeStates: Record<number, LinkedListNodeState>,
  pointers: PointerSnapshot,
  links: Record<number, number | null>,
) {
  steps.push({
    type,
    operation,
    metadata,
    nodeStates: cloneStates(nodeStates),
    pointers: snap(pointers),
    links: cloneLinks(links),
  });
}

// ── Main engine ────────────────────────────────────────────────────────────

export function generateReorderSteps(head: ListNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, LinkedListNodeState>;
  originalValues: number[];
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, LinkedListNodeState> = {};
  const links: Record<number, number | null> = {};
  const originalValues: number[] = [];

  // Build initial state from the list
  let node = head;
  while (node) {
    originalValues.push(node.val);
    nodeStates[node.val] = "unvisited";
    links[node.val] = node.next?.val ?? null;
    node = node.next;
  }

  const initialNodeStates = cloneStates(nodeStates);

  if (!head) {
    return { executionSteps, initialNodeStates, originalValues };
  }

  // Null pointers at start
  const pointers: PointerSnapshot = {
    slow: null,
    fast: null,
    prev: null,
    curr: null,
    nextSaved: null,
  };

  // ── Init step ─────────────────────────────────────────────────────────

  pointers.slow = head.val;
  pointers.fast = head.val;
  nodeStates[head.val] = "current";

  pushStep(
    executionSteps,
    "init",
    `Initialize: slow = ${head.val}, fast = ${head.val}`,
    meta(
      "Find Middle",
      "info",
      "Initialize Pointers",
      "Set slow and fast pointers both to head. We'll use slow/fast to find the midpoint of the list.",
      "Start",
      "slow moves 1 step at a time; fast moves 2 — when fast hits the end, slow is at the middle.",
    ),
    nodeStates,
    pointers,
    links,
  );

  // ── Phase 1: Find Middle ───────────────────────────────────────────────

  let slow: ListNode = head;
  let fast: ListNode = head;

  // Mark fast differently from slow
  if (fast.val !== slow.val) {
    nodeStates[fast.val] = "next_saved";
  }

  while (fast.next && fast.next.next) {
    // Show the loop check
    pushStep(
      executionSteps,
      "find_middle_check",
      `Loop check: fast.next = ${fast.next.val}, fast.next.next = ${fast.next.next.val} → continue`,
      meta(
        "Find Middle",
        "info",
        "Check Loop Condition",
        `fast.next (${fast.next.val}) and fast.next.next (${fast.next.next.val}) are both valid — continue advancing.`,
        "Check",
        "When fast can no longer move 2 steps, slow is at the exact middle.",
      ),
      nodeStates,
      pointers,
      links,
    );

    // Advance
    const prevSlowVal = slow.val;
    const prevFastVal = fast.val;
    slow = slow.next!;
    fast = fast.next!.next!;

    // Update states: mark old slow as completed (visited)
    nodeStates[prevSlowVal] = "completed";
    // If slow and fast are the same node handle that
    nodeStates[slow.val] = "current";
    if (fast.val !== slow.val) {
      nodeStates[fast.val] = "next_saved";
    }
    // Clean up old fast if it moved
    if (prevFastVal !== slow.val && prevFastVal !== fast.val) {
      nodeStates[prevFastVal] = "completed";
    }

    pointers.slow = slow.val;
    pointers.fast = fast.val;

    pushStep(
      executionSteps,
      "find_middle_move",
      `Advance: slow → ${slow.val}, fast → ${fast.val}`,
      meta(
        "Find Middle",
        "critical",
        "Advance slow and fast",
        `slow moves to ${slow.val} (1 step). fast moves to ${fast.val} (2 steps). The gap between them widens each iteration.`,
        "Advance",
      ),
      nodeStates,
      pointers,
      links,
    );
  }

  // Loop exits — slow is at the middle
  pushStep(
    executionSteps,
    "find_middle_done",
    `Loop exits: slow is at middle node ${slow.val}`,
    meta(
      "Find Middle",
      "success",
      "Middle Found!",
      `slow = ${slow.val} is the midpoint. The list will be split at this node — everything from slow.next onwards is the second half.`,
      "Mid Found",
      "For odd-length lists the middle node is in the first half; for even lists it splits exactly.",
    ),
    nodeStates,
    pointers,
    links,
  );

  // ── Phase 2: Reverse second half ──────────────────────────────────────

  // Split: save second half head, then cut the link
  const secondHalfHead = slow.next;

  if (!secondHalfHead) {
    // Edge: only one node — already done
    return { executionSteps, initialNodeStates, originalValues };
  }

  // Mark second half nodes as unvisited again for visual clarity
  // (they'll get new states during reversal)
  // No state changes needed here yet.

  // snapshot of split
  pointers.prev = null;
  pointers.curr = secondHalfHead.val;
  pointers.slow = slow.val;
  pointers.fast = null;

  // Cut the list visually
  links[slow.val] = null;
  nodeStates[slow.val] = "completed"; // middle is placed, now part of first half

  pushStep(
    executionSteps,
    "split_halves",
    `Split: slow.next = None  (second half starts at ${secondHalfHead.val})`,
    meta(
      "Reverse",
      "warning",
      "Split the List",
      `Set slow.next = None to cut the list. The first half ends at ${slow.val}. The second half begins at ${secondHalfHead.val} and will now be reversed.`,
      "Split!",
      "This cut is essential — without it, the reversal would corrupt the first half.",
    ),
    nodeStates,
    pointers,
    links,
  );

  // Reverse init
  let revPrev: ListNode | null = null;
  let revCurr: ListNode | null = secondHalfHead;

  nodeStates[secondHalfHead.val] = "current";

  pushStep(
    executionSteps,
    "reverse_init",
    `Init reverse: prev = None, curr = ${secondHalfHead.val}`,
    meta(
      "Reverse",
      "info",
      "Initialize Reversal",
      "Set prev = None and curr = head of second half. This is the same iterative reversal pattern as Reverse a Linked List.",
      "Rev Init",
    ),
    nodeStates,
    pointers,
    links,
  );

  while (revCurr) {
    // Loop check
    pushStep(
      executionSteps,
      "reverse_loop_check",
      `Reverse loop: curr = ${revCurr.val} → continue`,
      meta(
        "Reverse",
        "info",
        `Reverse Loop — curr = ${revCurr.val}`,
        `curr (${revCurr.val}) is not None, so we execute another reversal iteration.`,
        "Rev Loop",
      ),
      nodeStates,
      pointers,
      links,
    );

    const nextNode: ListNode | null = revCurr.next;

    // Save next
    pointers.nextSaved = nextNode?.val ?? null;
    if (nextNode) {
      nodeStates[nextNode.val] = "next_saved";
    }

    pushStep(
      executionSteps,
      "reverse_save_next",
      `Save tmp = ${nextNode ? nextNode.val : "None"}`,
      meta(
        "Reverse",
        "critical",
        "Store tmp (next pointer)",
        `Save curr.next before overwriting it. Without this we'd lose the rest of the list. tmp = ${nextNode ? nextNode.val : "None"}.`,
        "Save tmp",
        "Always save next before reversing a link — this is the cardinal rule.",
      ),
      nodeStates,
      pointers,
      links,
    );

    // Reverse the link
    links[revCurr.val] = revPrev?.val ?? null;
    nodeStates[revCurr.val] = "reversed";

    pushStep(
      executionSteps,
      "reverse_link",
      `Flip: ${revCurr.val}.next = ${revPrev ? revPrev.val : "None"}`,
      meta(
        "Reverse",
        "warning",
        "Flip the Arrow",
        `Point curr.next backwards to prev. Node ${revCurr.val}'s arrow now points to ${revPrev ? revPrev.val : "None"}.`,
        "Flipped!",
        "Each iteration flips exactly one arrow.",
      ),
      nodeStates,
      pointers,
      links,
    );

    // Advance prev and curr
    revPrev = revCurr;
    revCurr = nextNode;

    pointers.prev = revPrev.val;
    pointers.curr = revCurr?.val ?? null;
    pointers.nextSaved = null;

    nodeStates[revPrev.val] = "completed";

    // Clean up next_saved highlight
    for (const key of Object.keys(nodeStates)) {
      if (nodeStates[Number(key)] === "next_saved") {
        nodeStates[Number(key)] = "unvisited";
      }
    }

    if (revCurr) {
      nodeStates[revCurr.val] = "current";
    }

    pushStep(
      executionSteps,
      "reverse_advance",
      `Advance: prev = ${revPrev.val}, curr = ${revCurr ? revCurr.val : "None"}`,
      meta(
        "Reverse",
        "info",
        "Advance prev and curr",
        `prev is now ${revPrev.val} (the last reversed node). curr moves to ${revCurr ? revCurr.val : "None"}.`,
        "Advance",
      ),
      nodeStates,
      pointers,
      links,
    );
  }

  // Reversal done — revPrev is the new head of the reversed second half
  const reversedHead = revPrev!;

  pushStep(
    executionSteps,
    "reverse_done",
    `Reversal complete: second half head = ${reversedHead.val}`,
    meta(
      "Reverse",
      "success",
      "Second Half Reversed!",
      `prev = ${reversedHead.val} is the new head of the reversed second half. Now we'll merge the two halves alternately.`,
      "Rev Done",
      "The two halves are now ready to be interleaved.",
    ),
    nodeStates,
    pointers,
    links,
  );

  // ── Phase 3: Merge / Interleave ────────────────────────────────────────

  // Reset all to unvisited for fresh merge view, except mark both heads
  for (const key of Object.keys(nodeStates)) {
    nodeStates[Number(key)] = "unvisited";
  }

  // Re-walk the first half through links to mark it
  // p1 starts at head of first half
  let p1: ListNode | null = head;
  // p2 starts at reversed second half head
  // We need to follow the reversed links to walk p2
  // Rebuild a simple list reference for walking — we use the links map
  // to track traversal. For the actual pointer objects we need to keep
  // a reference. Let's walk the original list to find node objects.
  
  // Build a value → node object map for walking
  const nodeMap: Record<number, ListNode> = {};
  {
    let n: ListNode | null = head;
    while (n) {
      nodeMap[n.val] = n;
      n = n.next;
    }
    // The second half nodes — they still exist but their .next pointers
    // were mutated during reversal. We follow the links map instead.
  }

  let p2Val: number | null = reversedHead.val;

  pointers.slow = null;
  pointers.fast = null;
  pointers.prev = null;
  pointers.curr = head.val;
  pointers.nextSaved = reversedHead.val;

  nodeStates[head.val] = "current";
  nodeStates[reversedHead.val] = "next_saved";

  pushStep(
    executionSteps,
    "merge_init",
    `Init merge: p1 = ${head.val}, p2 = ${reversedHead.val}`,
    meta(
      "Merge",
      "info",
      "Initialize Merge",
      `p1 points to the start of the first half (${head.val}). p2 points to the start of the reversed second half (${reversedHead.val}). We'll interleave them: p1 → p2 → p1.next → ...`,
      "Merge Init",
      "The merge phase is O(n) and in-place — no extra space needed.",
    ),
    nodeStates,
    pointers,
    links,
  );

  // Walk through merge using links map for p2
  while (p2Val !== null) {
    const p1Val: number = p1!.val;

    // Save p1_next (via the original list's .next, which we track via links for first half)
    const p1NextVal: number | null = links[p1Val] ?? null;
    // Save p2_next from links
    const p2NextVal: number | null = links[p2Val] ?? null;

    // Show loop check
    pushStep(
      executionSteps,
      "merge_loop_check",
      `Merge loop: p2 = ${p2Val} → continue`,
      meta(
        "Merge",
        "info",
        `Merge Loop — p2 = ${p2Val}`,
        `p2 (${p2Val}) is not None — execute another interleave iteration.`,
        "Merge",
      ),
      nodeStates,
      pointers,
      links,
    );

    // Save nexts
    pointers.nextSaved = p1NextVal;

    pushStep(
      executionSteps,
      "merge_save",
      `Save: p1_next = ${p1NextVal ?? "None"}, p2_next = ${p2NextVal ?? "None"}`,
      meta(
        "Merge",
        "critical",
        "Save Next Pointers",
        `Save both next pointers before rewiring. p1_next = ${p1NextVal ?? "None"}, p2_next = ${p2NextVal ?? "None"}.`,
        "Save Nxt",
        "If we don't save these, we'll lose both tails permanently.",
      ),
      nodeStates,
      pointers,
      links,
    );

    // Link p1 → p2
    links[p1Val] = p2Val;
    nodeStates[p1Val] = "completed";

    pushStep(
      executionSteps,
      "merge_link_p1",
      `Link: p1 (${p1Val}).next = p2 (${p2Val})`,
      meta(
        "Merge",
        "warning",
        `p1.next = p2`,
        `Connect p1 (${p1Val}) to p2 (${p2Val}). This places the tail element right after the current head element.`,
        "p1→p2",
      ),
      nodeStates,
      pointers,
      links,
    );

    // Link p2 → p1_next (if p1_next exists)
    if (p1NextVal !== null) {
      links[p2Val] = p1NextVal;
    }
    nodeStates[p2Val] = "completed";

    pushStep(
      executionSteps,
      "merge_link_p2",
      `Link: p2 (${p2Val}).next = p1_next (${p1NextVal ?? "None"})`,
      meta(
        "Merge",
        "warning",
        `p2.next = p1_next`,
        `Connect p2 (${p2Val}) to p1_next (${p1NextVal ?? "None"}). This rejoins the remaining first-half chain.`,
        "p2→nxt",
      ),
      nodeStates,
      pointers,
      links,
    );

    // Advance both pointers
    p1 = p1NextVal !== null ? nodeMap[p1NextVal] : null;
    p2Val = p2NextVal;

    pointers.prev = null;
    pointers.curr = p1?.val ?? null;
    pointers.nextSaved = p2Val;
    pointers.slow = null;
    pointers.fast = null;

    // Reset states for next iteration
    for (const key of Object.keys(nodeStates)) {
      if (nodeStates[Number(key)] === "current" || nodeStates[Number(key)] === "next_saved") {
        // keep completed nodes as completed
        nodeStates[Number(key)] = "unvisited";
      }
    }

    if (p1) {
      nodeStates[p1.val] = "current";
    }
    if (p2Val !== null) {
      nodeStates[p2Val] = "next_saved";
    }

    pushStep(
      executionSteps,
      "merge_advance",
      `Advance: p1 = ${p1?.val ?? "None"}, p2 = ${p2Val ?? "None"}`,
      meta(
        "Merge",
        "info",
        "Advance Both Pointers",
        `p1 moves to ${p1?.val ?? "None"} (next from first half). p2 moves to ${p2Val ?? "None"} (next from reversed second half).`,
        "Advance",
      ),
      nodeStates,
      pointers,
      links,
    );
  }

  // Final completed state
  for (const key of Object.keys(nodeStates)) {
    nodeStates[Number(key)] = "completed";
  }
  pointers.curr = null;
  pointers.nextSaved = null;

  pushStep(
    executionSteps,
    "complete",
    "Reorder complete! List is now reordered in-place.",
    meta(
      "Done",
      "success",
      "Reorder Complete!",
      "The list has been reordered in-place. The first half and reversed second half are now perfectly interleaved.",
      "Done ✓",
      "Time O(n), Space O(1) — three passes, no extra memory.",
    ),
    nodeStates,
    pointers,
    links,
  );

  return { executionSteps, initialNodeStates, originalValues };
}
