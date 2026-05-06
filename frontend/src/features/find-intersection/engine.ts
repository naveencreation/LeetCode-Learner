import type {
  ExecutionStep,
  FindIntersectionOperationType,
  PointerSnapshot,
  ListNode,
  FindIntersectionStepMetadata,
  ListData,
} from "./types";
import type { LinkedListNodeState } from "@/features/shared/linked-list-types";

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

function cloneListData(listData: ListData): ListData {
  return {
    values: [...listData.values],
    nodeStates: cloneNodeStates(listData.nodeStates),
    links: cloneLinks(listData.links),
  };
}

function snap(pointers: PointerSnapshot): PointerSnapshot {
  return { ...pointers };
}

function createMetadata(
  phase: "Setup" | "Calculate" | "Align" | "Search" | "Complete",
  severity: "neutral" | "info" | "warning" | "critical" | "success",
  title: string,
  description: string,
  badge: string,
  tip?: string,
): FindIntersectionStepMetadata {
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
  type: FindIntersectionOperationType,
  operation: string,
  metadata: FindIntersectionStepMetadata,
  listA: ListData,
  listB: ListData,
  pointers: PointerSnapshot,
): void {
  steps.push({
    type,
    operation,
    metadata,
    listA: cloneListData(listA),
    listB: cloneListData(listB),
    pointers: snap(pointers),
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

function linkedListToArray(node: ListNode | null): number[] {
  const result: number[] = [];
  let current = node;
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

function calculateLength(node: ListNode | null): number {
  let count = 0;
  let current = node;
  while (current !== null) {
    count++;
    current = current.next;
  }
  return count;
}

export function generateFindIntersectionSteps(headA: ListNode | null, headB: ListNode | null): {
  executionSteps: ExecutionStep[];
  listA: ListData;
  listB: ListData;
} {
  const executionSteps: ExecutionStep[] = [];

  if (headA === null || headB === null) {
    return {
      executionSteps,
      listA: { values: [], nodeStates: {}, links: {} },
      listB: { values: [], nodeStates: {}, links: {} },
    };
  }

  // Initialize listA data
  const listAValues = linkedListToArray(headA);
  const listANodeStates: Record<number, LinkedListNodeState> = {};
  initializeNodeStates(headA, listANodeStates);
  const listALinks = buildLinksMap(headA);
  const listA: ListData = { values: listAValues, nodeStates: listANodeStates, links: listALinks };

  // Initialize listB data
  const listBValues = linkedListToArray(headB);
  const listBNodeStates: Record<number, LinkedListNodeState> = {};
  initializeNodeStates(headB, listBNodeStates);
  const listBLinks = buildLinksMap(headB);
  const listB: ListData = { values: listBValues, nodeStates: listBNodeStates, links: listBLinks };

  // Initialize pointers
  const pointers: PointerSnapshot = {
    pointerA: headA?.val ?? null,
    pointerB: headB?.val ?? null,
    lengthA: 0,
    lengthB: 0,
  };

  // Mark initial positions
  if (headA) listANodeStates[headA.val] = "current";
  if (headB) listBNodeStates[headB.val] = "current";

  pushStep(
    executionSteps,
    "init_lists",
    "Initialize: pointerA and pointerB",
    createMetadata(
      "Setup",
      "info",
      "Initialize Pointers",
      "Set up pointers for both linked lists.",
      "Init",
    ),
    listA,
    listB,
    pointers,
  );

  // Calculate lengths
  const lengthA = calculateLength(headA);
  const lengthB = calculateLength(headB);

  pushStep(
    executionSteps,
    "calculate_lengths",
    `Calculate: lengthA=${lengthA}, lengthB=${lengthB}`,
    createMetadata(
      "Calculate",
      "info",
      "Calculate Lengths",
      `Calculate the length of both lists: A = ${lengthA}, B = ${lengthB}.`,
      "Calculate",
    ),
    listA,
    listB,
    { ...pointers, lengthA, lengthB },
  );

  // Align pointers
  let ptrA: ListNode | null = headA;
  let ptrB: ListNode | null = headB;
  let diff = Math.abs(lengthA - lengthB);

  if (lengthA > lengthB) {
    for (let i = 0; i < diff; i++) {
      if (ptrA) {
        listANodeStates[ptrA.val] = "completed";
        ptrA = ptrA.next;
      }
    }
    pushStep(
      executionSteps,
      "align_pointers",
      `Align: Move pointerA ahead by ${diff} steps`,
      createMetadata(
        "Align",
        "info",
        "Align Pointers",
        `Move pointerA ahead by ${diff} steps to align with pointerB.`,
        "Align",
      ),
      listA,
      listB,
      { ...pointers, pointerA: ptrA?.val ?? null, pointerB: ptrB?.val ?? null, lengthA, lengthB },
    );
  } else if (lengthB > lengthA) {
    for (let i = 0; i < diff; i++) {
      if (ptrB) {
        listBNodeStates[ptrB.val] = "completed";
        ptrB = ptrB.next;
      }
    }
    pushStep(
      executionSteps,
      "align_pointers",
      `Align: Move pointerB ahead by ${diff} steps`,
      createMetadata(
        "Align",
        "info",
        "Align Pointers",
        `Move pointerB ahead by ${diff} steps to align with pointerA.`,
        "Align",
      ),
      listA,
      listB,
      { ...pointers, pointerA: ptrA?.val ?? null, pointerB: ptrB?.val ?? null, lengthA, lengthB },
    );
  }

  // Search for intersection
  while (ptrA !== null && ptrB !== null) {
    if (ptrA) listANodeStates[ptrA.val] = "current";
    if (ptrB) listBNodeStates[ptrB.val] = "current";

    pushStep(
      executionSteps,
      "check_intersection",
      `Check: pointerA=${ptrA.val}, pointerB=${ptrB.val}`,
      createMetadata(
        "Search",
        "info",
        "Check Intersection",
        `Check if both pointers point to the same node.`,
        "Check",
      ),
      listA,
      listB,
      { ...pointers, pointerA: ptrA.val, pointerB: ptrB.val, lengthA, lengthB },
    );

    if (ptrA === ptrB) {
      // Found intersection
      listANodeStates[ptrA.val] = "completed";
      listBNodeStates[ptrB.val] = "completed";

      pushStep(
        executionSteps,
        "found_intersection",
        `Found: intersection at node ${ptrA.val}`,
        createMetadata(
          "Complete",
          "success",
          "Intersection Found!",
          `Both pointers meet at node with value ${ptrA.val}.`,
          "Found ✓",
          "Time O(n + m), space O(1).",
        ),
        listA,
        listB,
        { ...pointers, pointerA: ptrA.val, pointerB: ptrB.val, lengthA, lengthB },
      );

      return { executionSteps, listA, listB };
    }

    // Advance both
    if (ptrA) listANodeStates[ptrA.val] = "completed";
    if (ptrB) listBNodeStates[ptrB.val] = "completed";
    ptrA = ptrA.next;
    ptrB = ptrB.next;

    pushStep(
      executionSteps,
      "advance_both",
      `Advance: pointerA=${ptrA?.val ?? "null"}, pointerB=${ptrB?.val ?? "null"}`,
      createMetadata(
        "Search",
        "info",
        "Advance Both",
        "Move both pointers forward by one step.",
        "Advance",
      ),
      listA,
      listB,
      { ...pointers, pointerA: ptrA?.val ?? null, pointerB: ptrB?.val ?? null, lengthA, lengthB },
    );
  }

  // No intersection
  pushStep(
    executionSteps,
    "check_intersection",
    "Complete: No intersection found",
    createMetadata(
      "Complete",
      "neutral",
      "No Intersection",
      "Both lists reached the end without intersecting.",
      "Done",
      "Time O(n + m), space O(1).",
    ),
    listA,
    listB,
    { ...pointers, pointerA: null, pointerB: null, lengthA, lengthB },
  );

  return { executionSteps, listA, listB };
}
