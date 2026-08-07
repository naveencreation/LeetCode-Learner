import type { ListNode, LinkedListNodeState } from "../shared/linked-list-types";
import type {
  ExecutionStep,
  PointerSnapshot,
  ReverseOperationType,
  ReversePhase,
  ReverseSeverity,
  ReverseStepMetadata,
} from "./types";

function cloneStates(s: Record<number, LinkedListNodeState>): Record<number, LinkedListNodeState> {
  return { ...s };
}

function cloneLinks(l: Record<number, number | null>): Record<number, number | null> {
  return { ...l };
}

function snap(p: PointerSnapshot): PointerSnapshot {
  return { ...p };
}

function createMetadata(
  phase: ReversePhase,
  severity: ReverseSeverity,
  title: string,
  description: string,
  badge: string,
  tip?: string,
): ReverseStepMetadata {
  return {
    phase,
    severity,
    title,
    description,
    badge,
    tip,
  };
}

function pushStep(
  steps: ExecutionStep[],
  type: ReverseOperationType,
  operation: string,
  metadata: ReverseStepMetadata,
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

export function generateReverseSteps(head: ListNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, LinkedListNodeState>;
  originalValues: number[];
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, LinkedListNodeState> = {};
  const links: Record<number, number | null> = {};
  const originalValues: number[] = [];

  // Build initial state
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

  const pointers: PointerSnapshot = { prev: null, curr: head.val, nextSaved: null };

  // Step 0: initialization
  nodeStates[head.val] = "current";
  pushStep(
    executionSteps,
    "init",
    `Initialize pointers: prev = None, curr = ${head.val}`,
    createMetadata(
      "Setup",
      "info",
      "Function Called",
      "reverseList(head) starts. We set up prev and curr before touching any link.",
      "Start",
      "Think of prev as reversed-so-far and curr as node-in-hand.",
    ),
    nodeStates,
    pointers,
    links,
  );

  // Walk through the list
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;

  while (curr) {
    pushStep(
      executionSteps,
      "loop_check",
      `Check loop condition: curr = ${curr.val} (continue)`,
      createMetadata(
        "Loop",
        "info",
        `Check: curr = ${curr.val} != None`,
        "curr is valid, so we run another iteration.",
        "Loop",
        "The loop only stops when curr becomes None.",
      ),
      nodeStates,
      pointers,
      links,
    );

    const nextNode: ListNode | null = curr.next;

    // 1) save_next
    pointers.nextSaved = nextNode?.val ?? null;
    if (nextNode) {
      nodeStates[nextNode.val] = "next_saved";
    }
    pushStep(
      executionSteps,
      "save_next",
      `Store next_node: ${nextNode ? nextNode.val : "None"}`,
      createMetadata(
        "Loop",
        "critical",
        "Store next_node",
        "Save curr.next first. This is the safety step that prevents losing the remaining chain.",
        "nxt saved",
        "No saved next means broken traversal.",
      ),
      nodeStates,
      pointers,
      links,
    );

    // 2) reverse_link
    links[curr.val] = prev?.val ?? null;
    nodeStates[curr.val] = "reversed";
    pushStep(
      executionSteps,
      "reverse_link",
      `Reverse pointer: ${curr.val}.next = ${prev ? prev.val : "None"}`,
      createMetadata(
        "Loop",
        "warning",
        "Flip the arrow",
        "Point curr.next backward to prev. This is the core reversal move.",
        "Flipped!",
        "Each iteration flips exactly one next pointer.",
      ),
      nodeStates,
      pointers,
      links,
    );

    // 3) move_prev
    pointers.prev = curr.val;
    nodeStates[curr.val] = "completed";
    pushStep(
      executionSteps,
      "move_prev",
      `Advance prev: prev = ${curr.val}`,
      createMetadata(
        "Loop",
        "info",
        "Move prev",
        "Advance prev to the node we just reversed.",
        "prev -> curr",
      ),
      nodeStates,
      pointers,
      links,
    );

    // 4) move_curr
    prev = curr;
    curr = nextNode;
    pointers.curr = curr?.val ?? null;
    pointers.nextSaved = null;

    if (curr) {
      nodeStates[curr.val] = "current";
    }

    // Clean up next_saved highlight from old next if it wasn't already reversed
    for (const key of Object.keys(nodeStates)) {
      if (nodeStates[Number(key)] === "next_saved") {
        nodeStates[Number(key)] = "unvisited";
      }
    }

    pushStep(
      executionSteps,
      "move_curr",
      `Advance curr: curr = ${curr ? curr.val : "None"}`,
      createMetadata(
        "Loop",
        "info",
        "Move curr",
        "Advance curr to next_node so the next unreversed node becomes active.",
        "curr -> nxt",
      ),
      nodeStates,
      pointers,
      links,
    );
  }

  pushStep(
    executionSteps,
    "loop_exit",
    "Check loop condition: curr = None (stop)",
    createMetadata(
      "Exit",
      "success",
      "Loop exits",
      "curr is None, so all nodes are processed and the loop terminates.",
      "Done!",
    ),
    nodeStates,
    pointers,
    links,
  );

  // Final: complete
  pushStep(
    executionSteps,
    "complete",
    `Return prev as new head: ${prev?.val ?? "None"}`,
    createMetadata(
      "Return",
      "success",
      "Return new head",
      "prev now points to the reversed list head.",
      "Done ✓",
      "Time O(n), space O(1).",
    ),
    nodeStates,
    pointers,
    links,
  );

  return { executionSteps, initialNodeStates, originalValues };
}
