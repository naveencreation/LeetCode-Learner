import type {
  ExecutionStep,
  MiddleOperationType,
  PointerSnapshot,
  ListNode,
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

function snap(pointers: PointerSnapshot): PointerSnapshot {
  return { ...pointers };
}

function pushStep(
  steps: ExecutionStep[],
  type: MiddleOperationType,
  operation: string,
  pointers: PointerSnapshot,
  nodeStates: Record<number, LinkedListNodeState>,
  links: Record<number, number | null>,
): void {
  steps.push({
    type,
    operation,
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

export function generateMiddleOfLinkedListSteps(head: ListNode | null): {
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

  // Initialize pointers
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  const pointers: PointerSnapshot = {
    slow: slow?.val ?? null,
    fast: fast?.val ?? null,
  };

  // Mark initial positions
  if (slow) nodeStates[slow.val] = "current";

  pushStep(
    executionSteps,
    "init",
    "Initialize: slow = head, fast = head",
    pointers,
    nodeStates,
    links,
  );

  // Main loop: while fast and fast.next exist
  while (fast !== null && fast.next !== null) {
    // Check loop condition
    pointers.slow = slow?.val ?? null;
    pointers.fast = fast?.val ?? null;

    pushStep(
      executionSteps,
      "check_loop",
      `Check: fast (${fast.val}) and fast.next (${fast.next.val}) exist`,
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
        pointers,
        nodeStates,
        links,
      );
    }
  }

  // Loop exit - found middle
  if (slow) {
    nodeStates[slow.val] = "completed";

    pushStep(
      executionSteps,
      "found_middle",
      `Found middle: return slow (${slow.val})`,
      { slow: slow.val, fast: fast?.val ?? null },
      nodeStates,
      links,
    );
  }

  return { executionSteps, initialNodeStates, originalValues };
}
