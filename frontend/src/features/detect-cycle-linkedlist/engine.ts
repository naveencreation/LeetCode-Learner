import type { ListNode, LinkedListNodeState } from "@/features/shared/linked-list-types";
import type {
  ExecutionStep,
  PointerSnapshot,
  DetectCycleOperationType,
  DetectCycleStepMetadata,
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
  phase: "Setup" | "Check" | "Movement" | "Result",
  severity: "neutral" | "info" | "warning" | "critical" | "success",
  title: string,
  description: string,
  badge: string,
  tip?: string,
): DetectCycleStepMetadata {
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
  type: DetectCycleOperationType,
  operation: string,
  metadata: DetectCycleStepMetadata,
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
  if (states[node.val] !== undefined) return; // Already visited (cycle)
  states[node.val] = "unvisited";
  initializeNodeStates(node.next, states);
}

function buildLinksMap(node: ListNode | null): Record<number, number | null> {
  const links: Record<number, number | null> = {};
  const visited = new Set<number>();
  let current = node;
  while (current !== null) {
    if (visited.has(current.val)) break; // Stop at cycle
    visited.add(current.val);
    links[current.val] = current.next?.val ?? null;
    current = current.next;
  }
  return links;
}

export function generateDetectCycleSteps(
  head: ListNode | null,
  cyclePosition: number | null = null,
): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, LinkedListNodeState>;
  originalValues: number[];
  hasCycle: boolean;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, LinkedListNodeState> = {};

  if (head === null) {
    return { executionSteps, initialNodeStates: nodeStates, originalValues: [], hasCycle: false };
  }

  // Build original values array
  const originalValues: number[] = [];
  let temp: ListNode | null = head;
  const visited = new Set<number>();
  while (temp !== null) {
    if (visited.has(temp.val)) break;
    visited.add(temp.val);
    originalValues.push(temp.val);
    temp = temp.next;
  }

  initializeNodeStates(head, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);
  const links = buildLinksMap(head);

  // Detect if cycle exists
  const hasCycle = cyclePosition !== null;

  // Initialize pointers
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  const pointers: PointerSnapshot = {
    slow: slow?.val ?? null,
    fast: fast?.val ?? null,
    hasCycle: null,
  };

  // Mark initial positions
  if (slow) nodeStates[slow.val] = "current";

  pushStep(
    executionSteps,
    "init",
    "Initialize: slow = head, fast = head",
    createMetadata(
      "Setup",
      "info",
      "Initialize Pointers",
      "Set both slow and fast pointers to the head of the list.",
      "Setup",
      "Both pointers start at the same position.",
    ),
    pointers,
    nodeStates,
    links,
  );

  // Main loop: while fast and fast.next exist
  const maxIterations = 100; // Prevent infinite loops
  let iteration = 0;
  while (fast !== null && fast.next !== null && iteration < maxIterations) {
    iteration++;

    // Check loop condition
    pointers.slow = slow?.val ?? null;
    pointers.fast = fast?.val ?? null;

    pushStep(
      executionSteps,
      "check_loop",
      `Check: fast (${fast.val}) and fast.next (${fast.next.val}) exist`,
      createMetadata(
        "Check",
        "info",
        "Check Loop Condition",
        "Verify that fast pointer can advance (fast and fast.next exist).",
        "Check",
      ),
      pointers,
      nodeStates,
      links,
    );

    // Advance slow by 1
    if (slow && slow.next) {
      // Mark previous slow as visited
      nodeStates[slow.val] = "completed";
      slow = slow.next;
      nodeStates[slow.val] = "current";

      pointers.slow = slow.val;

      pushStep(
        executionSteps,
        "advance_slow",
        `Advance slow: slow = slow.next (${slow.val})`,
        createMetadata(
          "Movement",
          "info",
          "Advance Slow Pointer",
          "Move the slow pointer one step forward.",
          "Slow +1",
          "Tortoise moves steadily forward.",
        ),
        pointers,
        nodeStates,
        links,
      );
    }

    // Advance fast by 2
    if (fast && fast.next) {
      fast = fast.next.next;

      pointers.fast = fast?.val ?? null;

      const fastMsg = fast
        ? `Advance fast: fast = fast.next.next (${fast.val})`
        : "Advance fast: fast = fast.next.next (null)";

      pushStep(
        executionSteps,
        "advance_fast",
        fastMsg,
        createMetadata(
          "Movement",
          "info",
          "Advance Fast Pointer",
          "Move the fast pointer two steps forward.",
          "Fast +2",
          "Hare moves twice as fast.",
        ),
        pointers,
        nodeStates,
        links,
      );

      // Check if they meet (cycle detected)
      if (fast && slow && fast.val === slow.val) {
        pointers.hasCycle = true;

        pushStep(
          executionSteps,
          "cycle_detected",
          `Cycle detected: slow (${slow.val}) == fast (${fast.val})`,
          createMetadata(
            "Result",
            "success",
            "Cycle Found!",
            "The slow and fast pointers met, confirming a cycle exists.",
            "Cycle ✓",
            "Time O(n), space O(1).",
          ),
          pointers,
          nodeStates,
          links,
        );

        return { executionSteps, initialNodeStates, originalValues, hasCycle: true };
      }
    }
  }

  // Loop exit - no cycle
  pointers.hasCycle = false;

  pushStep(
    executionSteps,
    "no_cycle",
    "No cycle found: fast reached end of list",
    createMetadata(
      "Result",
      "neutral",
      "No Cycle",
      "The fast pointer reached the end without meeting slow pointer.",
      "No Cycle",
      "Time O(n), space O(1).",
    ),
    pointers,
    nodeStates,
    links,
  );

  return { executionSteps, initialNodeStates, originalValues, hasCycle: false };
}
