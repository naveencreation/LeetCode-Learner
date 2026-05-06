import type {
  ExecutionStep,
  LoopStartOperationType,
  PointerSnapshot,
  ListNode,
  LoopStartStepMetadata,
} from "./types";
import type { LinkedListNodeState } from "@/features/shared/linked-list-types";

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
  phase: "Setup" | "Detect" | "Find Start" | "Result",
  severity: "neutral" | "info" | "warning" | "critical" | "success",
  title: string,
  description: string,
  badge: string,
  tip?: string,
): LoopStartStepMetadata {
  return { phase, severity, title, description, badge, tip };
}

function pushStep(
  steps: ExecutionStep[],
  type: LoopStartOperationType,
  operation: string,
  metadata: LoopStartStepMetadata,
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

function initializeNodeStates(node: ListNode | null, states: Record<number, LinkedListNodeState>): void {
  if (node === null) return;
  if (states[node.val] !== undefined) return; // Cycle detected
  states[node.val] = "unvisited";
  initializeNodeStates(node.next, states);
}

function buildLinksMap(node: ListNode | null): Record<number, number | null> {
  const links: Record<number, number | null> = {};
  const visited = new Set<number>();
  let current = node;
  while (current !== null) {
    if (visited.has(current.val)) {
      links[current.val] = current.next?.val ?? null; // close the cycle
      break;
    }
    visited.add(current.val);
    links[current.val] = current.next?.val ?? null;
    current = current.next;
  }
  return links;
}

function listToArray(node: ListNode | null): number[] {
  const result: number[] = [];
  const visited = new Set<number>();
  let current = node;
  while (current !== null) {
    if (visited.has(current.val)) break;
    visited.add(current.val);
    result.push(current.val);
    current = current.next;
  }
  return result;
}

export function generateLoopStartSteps(
  head: ListNode | null,
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

  const originalValues = listToArray(head);
  initializeNodeStates(head, nodeStates);
  const initialNodeStates = cloneStates(nodeStates);
  const links = buildLinksMap(head);

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  const pointers: PointerSnapshot = {
    slow: slow?.val ?? null,
    fast: fast?.val ?? null,
    ptr1: null,
    ptr2: null,
    cycleStart: null,
  };

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
      "Phase 1: Detect if a cycle exists.",
    ),
    nodeStates,
    pointers,
    links,
  );

  // Phase 1: Detect cycle
  let cycleDetected = false;
  const maxIterations = 100;
  let iteration = 0;

  while (fast !== null && fast.next !== null && iteration < maxIterations) {
    iteration++;

    if (slow && slow.next) {
      nodeStates[slow.val] = "completed";
      slow = slow.next;
      nodeStates[slow.val] = "current";
    }

    if (fast.next) {
      nodeStates[fast.val] = fast.next.next ? "completed" : "current";
      fast = fast.next.next;
    }

    pointers.slow = slow?.val ?? null;
    pointers.fast = fast?.val ?? null;

    pushStep(
      executionSteps,
      "detect_cycle",
      `Advance: slow=${slow?.val}, fast=${fast?.val}`,
      createMetadata(
        "Detect",
        "info",
        "Cycle Detection",
        `Slow moves 1 step (now ${slow?.val}), Fast moves 2 steps (now ${fast?.val}).`,
        "Detect",
        "If they meet, a cycle exists.",
      ),
      nodeStates,
      pointers,
      links,
    );

    if (slow && fast && slow.val === fast.val) {
      cycleDetected = true;
      pushStep(
        executionSteps,
        "detect_cycle",
        `Cycle detected at node ${slow.val}!`,
        createMetadata(
          "Detect",
          "warning",
          "Cycle Detected!",
          `Slow and fast met at node ${slow.val}. A cycle exists in the list.`,
          "Met!",
          "The meeting point is NOT necessarily the start of the loop.",
        ),
        nodeStates,
        pointers,
        links,
      );
      break;
    }
  }

  if (!cycleDetected) {
    pushStep(
      executionSteps,
      "no_cycle",
      "No cycle found: fast reached the end",
      createMetadata(
        "Result",
        "neutral",
        "No Cycle",
        "The fast pointer reached the end. There is no cycle.",
        "None",
        "Time O(n), Space O(1).",
      ),
      nodeStates,
      pointers,
      links,
    );
    return { executionSteps, initialNodeStates, originalValues };
  }

  // Phase 2: Find start of loop
  let ptr1: ListNode | null = head;
  let ptr2: ListNode | null = slow;

  // Reset states for ptr1 and ptr2 visualization
  for (const key of Object.keys(nodeStates)) {
    if (nodeStates[Number(key)] === "completed") {
      nodeStates[Number(key)] = "unvisited";
    }
  }

  pointers.ptr1 = ptr1?.val ?? null;
  pointers.ptr2 = ptr2?.val ?? null;

  if (ptr1) nodeStates[ptr1.val] = "current";
  if (ptr2 && ptr1?.val !== ptr2.val) nodeStates[ptr2.val] = "current";

  pushStep(
    executionSteps,
    "move_to_head",
    "Move ptr1 to head, ptr2 stays at meeting point",
    createMetadata(
      "Find Start",
      "info",
      "Move ptr1 to Head",
      `ptr1 = head (${head.val}), ptr2 = meeting point (${slow?.val}).`,
      "Phase 2",
      "Both pointers are now the same distance from the cycle start.",
    ),
    nodeStates,
    pointers,
    links,
  );

  while (ptr1 !== null && ptr2 !== null && ptr1.val !== ptr2.val) {
    if (ptr1) {
      nodeStates[ptr1.val] = "completed";
      ptr1 = ptr1.next;
    }
    if (ptr2) {
      nodeStates[ptr2.val] = "completed";
      ptr2 = ptr2.next;
    }

    if (ptr1) nodeStates[ptr1.val] = "current";
    if (ptr2 && ptr1?.val !== ptr2.val) nodeStates[ptr2.val] = "current";

    pointers.ptr1 = ptr1?.val ?? null;
    pointers.ptr2 = ptr2?.val ?? null;

    pushStep(
      executionSteps,
      "find_start",
      `Advance both: ptr1=${ptr1?.val}, ptr2=${ptr2?.val}`,
      createMetadata(
        "Find Start",
        "info",
        "Finding Start",
        `ptr1=${ptr1?.val}, ptr2=${ptr2?.val}. Moving both 1 step at a time.`,
        "Step",
        "They will meet at the cycle's starting node.",
      ),
      nodeStates,
      pointers,
      links,
    );
  }

  // Found start
  if (ptr1) {
    nodeStates[ptr1.val] = "completed";
    pointers.cycleStart = ptr1.val;
  }

  pushStep(
    executionSteps,
    "found_start",
    `Cycle starts at node ${ptr1?.val}!`,
    createMetadata(
      "Result",
      "success",
      "Cycle Start Found!",
      `The cycle starts at node ${ptr1?.val}.`,
      "Found ✓",
      "Time O(n), Space O(1).",
    ),
    nodeStates,
    pointers,
    links,
  );

  return { executionSteps, initialNodeStates, originalValues };
}
