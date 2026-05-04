import type { ListNode, LinkedListNodeState } from "../shared/linked-list-types";
import type {
  ExecutionStep,
  PointerSnapshot,
  RemoveNthOperationType,
  RemoveNthStepMetadata,
} from "./types";

function cloneNodeStates(
  states: Record<number, LinkedListNodeState>,
): Record<number, LinkedListNodeState> {
  return { ...states };
}

function cloneLinks(
  links: Record<number, number | null>,
): Record<number, number | null> {
  return { ...links };
}

function snap(pointers: PointerSnapshot): PointerSnapshot {
  return { ...pointers };
}

function createMetadata(
  phase: "Setup" | "Advance Fast" | "Movement" | "Remove" | "Complete",
  severity: "neutral" | "info" | "warning" | "critical" | "success",
  title: string,
  description: string,
  badge: string,
  tip?: string,
): RemoveNthStepMetadata {
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
  type: RemoveNthOperationType,
  operation: string,
  metadata: RemoveNthStepMetadata,
  pointers: PointerSnapshot,
  nodeStates: Record<number, LinkedListNodeState>,
  links: Record<number, number | null>,
): void {
  steps.push({
    type,
    operation,
    metadata,
    nodeStates: cloneNodeStates(nodeStates),
    pointers: snap(pointers),
    links: cloneLinks(links),
  });
}

function initializeNodeStates(
  node: ListNode | null,
  states: Record<number, LinkedListNodeState>,
): void {
  if (node === null) return;
  states[node.val] = "unvisited";
  initializeNodeStates(node.next, states);
}

function buildLinksMap(node: ListNode | null): Record<number, number | null> {
  const links: Record<number, number | null> = {};
  let current = node;
  while (current !== null) {
    links[current.val] = current.next?.val ?? null;
    current = current.next;
  }
  return links;
}

function getListNodeLength(head: ListNode | null): number {
  let count = 0;
  let current = head;
  while (current !== null) {
    count++;
    current = current.next;
  }
  return count;
}

export function generateRemoveNthSteps(
  head: ListNode | null,
  n: number = 2,
): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, LinkedListNodeState>;
  originalValues: number[];
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, LinkedListNodeState> = {};

  if (head === null) {
    return { executionSteps, initialNodeStates: nodeStates, originalValues: [] };
  }

  // Build original values array and initialize states
  const originalValues: number[] = [];
  let temp: ListNode | null = head;
  while (temp !== null) {
    originalValues.push(temp.val);
    temp = temp.next;
  }

  initializeNodeStates(head, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);
  const links = buildLinksMap(head);

  const listLength = getListNodeLength(head);
  
  // Validate n
  if (n < 1 || n > listLength) {
    n = Math.min(Math.max(n, 1), listLength);
  }

  // STANDARD DUMMY NODE APPROACH:
  // dummy -> 1 -> 2 -> 3 -> 4 -> 5
  // slow starts at dummy, fast starts at head
  // fast moves n steps ahead, then both move until fast is null
  // slow ends up at node BEFORE target (works for all cases including head)

  // Initialize pointers
  let fast: ListNode | null = head;
  let slow: ListNode | null = head; // Will track position, dummy is conceptual

  // Dummy node value - we use 0 or special indicator for visualization
  const DUMMY_VAL = 0;
  
  const pointers: PointerSnapshot = {
    fast: fast?.val ?? null,
    slow: null, // dummy position - not a real node
    target: null,
    n,
  };

  // Mark initial fast position
  if (fast) nodeStates[fast.val] = "current";

  pushStep(
    executionSteps,
    "init",
    `Initialize: dummy created, fast = head (${fast?.val}), slow = dummy, n = ${n}`,
    createMetadata(
      "Setup",
      "info",
      "Initialize Pointers",
      "Create dummy node (0) pointing to head. Fast starts at head, slow at dummy.",
      "Setup",
      "Dummy node ensures we can remove head without special case.",
    ),
    pointers,
    nodeStates,
    links,
  );

  // Move fast n steps ahead (individual steps for visualization)
  for (let i = 0; i < n; i++) {
    if (fast) {
      fast = fast.next;
      pointers.fast = fast?.val ?? null;

      pushStep(
        executionSteps,
        "advance_fast_n",
        `Advance fast: step ${i + 1} of ${n}, fast = ${fast?.val ?? "null"}`,
        createMetadata(
          "Advance Fast",
          "info",
          "Advance Fast Pointer",
          "Move the fast pointer n steps ahead to create an n-node gap.",
          "Fast +n",
          "Slow stays at dummy while fast moves ahead.",
        ),
        pointers,
        nodeStates,
        links,
      );
    }
  }

  // Move both pointers until fast is null
  // Each iteration: slow moves one, fast moves one
  let iteration = 0;
  while (fast !== null) {
    iteration++;
    
    // Advance slow (from dummy or previous position)
    if (iteration === 1) {
      // First move: slow goes from dummy to head
      slow = head;
      pointers.slow = slow?.val ?? null;
      if (slow) {
        nodeStates[slow.val] = "current";
      }
    } else {
      // Subsequent moves: slow advances
      if (slow && slow.next) {
        // Mark previous slow as completed
        nodeStates[slow.val] = "completed";
        slow = slow.next;
        pointers.slow = slow.val;
        nodeStates[slow.val] = "current";
      }
    }

    // Advance fast
    if (fast) {
      fast = fast.next;
      pointers.fast = fast?.val ?? null;
    }

    pushStep(
      executionSteps,
      "advance_together",
      `Move together #${iteration}: slow = ${slow?.val}, fast = ${fast?.val ?? "null"}`,
      createMetadata(
        "Movement",
        "info",
        "Move Together",
        "Move both fast and slow pointers one step forward until fast reaches end.",
        "Both +1",
        "Maintains the n-node gap between pointers.",
      ),
      pointers,
      nodeStates,
      links,
    );
  }

  // Now slow is at the node BEFORE the target
  // Target is slow.next
  const targetVal = slow?.next?.val ?? null;
  pointers.target = targetVal;

  if (targetVal !== null) {
    nodeStates[targetVal] = "current";
  }

  // Remove: skip the target node
  if (slow && slow.next) {
    const removedVal = slow.next.val;
    links[slow.val] = slow.next.next?.val ?? null;
    
    pushStep(
      executionSteps,
      "remove_node",
      `Remove: ${slow.val}.next = ${slow.next.next?.val ?? "null"} (skipped ${removedVal})`,
      createMetadata(
        "Remove",
        "warning",
        "Remove Target Node",
        "Skip the target node by setting slow.next to slow.next.next.",
        "Remove",
        "Works for all cases: head, middle, or tail.",
      ),
      pointers,
      nodeStates,
      links,
    );

    // Mark removed as completed
    if (removedVal !== null) {
      nodeStates[removedVal] = "completed";
    }
  }

  // Complete - return dummy.next which is the new head
  pushStep(
    executionSteps,
    "complete",
    `Return dummy.next: ${slow === head && targetVal === head?.val ? (head?.next?.val ?? "null") : head?.val}`,
    createMetadata(
      "Complete",
      "success",
      "Removal Complete!",
      "Return dummy.next as the new head of the modified list.",
      "Done ✓",
      "Time O(n), space O(1).",
    ),
    pointers,
    nodeStates,
    links,
  );

  return { executionSteps, initialNodeStates, originalValues };
}
