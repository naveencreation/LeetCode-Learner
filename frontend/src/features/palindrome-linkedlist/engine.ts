import type {
  ExecutionStep,
  PalindromeOperationType,
  PointerSnapshot,
  ListNode,
  PalindromeStepMetadata,
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
  phase: "Setup" | "Find Middle" | "Reverse" | "Compare" | "Result",
  severity: "neutral" | "info" | "warning" | "critical" | "success",
  title: string,
  description: string,
  badge: string,
  tip?: string,
): PalindromeStepMetadata {
  return { phase, severity, title, description, badge, tip };
}

function pushStep(
  steps: ExecutionStep[],
  type: PalindromeOperationType,
  operation: string,
  metadata: PalindromeStepMetadata,
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

function listToArray(node: ListNode | null): number[] {
  const result: number[] = [];
  let current = node;
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

export function generatePalindromeSteps(head: ListNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, LinkedListNodeState>;
  originalValues: number[];
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, LinkedListNodeState> = {};
  const links: Record<number, number | null> = {};
  const originalValues: number[] = [];

  if (head === null) {
    return { executionSteps, initialNodeStates: nodeStates, originalValues: [] };
  }

  let temp: ListNode | null = head;
  while (temp !== null) {
    originalValues.push(temp.val);
    temp = temp.next;
  }

  initializeNodeStates(head, nodeStates);
  const initialNodeStates = cloneStates(nodeStates);

  // Build initial links
  let linkTemp: ListNode | null = head;
  while (linkTemp !== null) {
    links[linkTemp.val] = linkTemp.next?.val ?? null;
    linkTemp = linkTemp.next;
  }

  const pointers: PointerSnapshot = {
    slow: head?.val ?? null,
    fast: head?.val ?? null,
    prev: null,
    curr: null,
    nextSaved: null,
    left: null,
    right: null,
  };

  // Mark head as current
  if (head) nodeStates[head.val] = "current";

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
      "Slow moves 1 step, fast moves 2 steps per iteration.",
    ),
    nodeStates,
    pointers,
    links,
  );

  // Edge case: 0 or 1 node
  if (!head.next) {
    pushStep(
      executionSteps,
      "palindrome_confirmed",
      "Single node: always a palindrome",
      createMetadata(
        "Result",
        "success",
        "Palindrome Confirmed!",
        "A single-node list is always a palindrome.",
        "Yes ✓",
        "Time O(1), Space O(1).",
      ),
      nodeStates,
      pointers,
      links,
    );
    return { executionSteps, initialNodeStates, originalValues };
  }

  // Step 1: Find middle
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  while (fast !== null && fast.next !== null) {
    if (slow) {
      nodeStates[slow.val] = "completed";
      slow = slow.next;
    }
    if (fast.next) {
      nodeStates[fast.val] = "completed";
      fast = fast.next.next;
    }

    if (slow) nodeStates[slow.val] = "current";
    if (fast) nodeStates[fast.val] = "current";

    pointers.slow = slow?.val ?? null;
    pointers.fast = fast?.val ?? null;

    pushStep(
      executionSteps,
      "find_middle",
      `Find middle: slow = ${slow?.val}, fast = ${fast?.val ?? "null"}`,
      createMetadata(
        "Find Middle",
        "info",
        "Finding Middle",
        `Slow pointer: ${slow?.val}, Fast pointer: ${fast?.val ?? "null"}. Fast reaches the end when slow is at middle.`,
        "Middle",
        "When fast reaches null, slow is at the middle node.",
      ),
      nodeStates,
      pointers,
      links,
    );
  }

  // Step 2: Reverse second half
  let prev: ListNode | null = null;
  let curr: ListNode | null = slow;

  pointers.prev = null;
  pointers.curr = curr?.val ?? null;

  if (curr) nodeStates[curr.val] = "current";

  pushStep(
    executionSteps,
    "reverse_second_half",
    "Reverse second half starting from slow pointer",
    createMetadata(
      "Reverse",
      "info",
      "Reverse Second Half",
      "Reverse the second half of the list (starting from middle).",
      "Reverse",
      "This allows us to compare from both ends simultaneously.",
    ),
    nodeStates,
    pointers,
    links,
  );

  while (curr !== null) {
    const nextNode: ListNode | null = curr.next;
    links[curr.val] = prev?.val ?? null;
    nodeStates[curr.val] = "reversed";

    prev = curr;
    curr = nextNode;

    pointers.prev = prev?.val ?? null;
    pointers.curr = curr?.val ?? null;

    if (curr) nodeStates[curr.val] = "current";

    pushStep(
      executionSteps,
      "reverse_second_half",
      `Reverse: ${prev.val}.next = ${prev?.val ?? "null"}`,
      createMetadata(
        "Reverse",
        "warning",
        "Reverse Link",
        `Node ${prev.val} now points to ${prev?.val ?? "null"}.`,
        "Flip",
      ),
      nodeStates,
      pointers,
      links,
    );
  }

  // Step 3: Compare halves
  let left: ListNode | null = head;
  let right: ListNode | null = prev;

  pointers.left = left?.val ?? null;
  pointers.right = right?.val ?? null;

  if (left) nodeStates[left.val] = "current";
  if (right) nodeStates[right.val] = "current";

  pushStep(
    executionSteps,
    "compare_halves",
    "Compare first half with reversed second half",
    createMetadata(
      "Compare",
      "info",
      "Compare Halves",
      "Compare nodes from both ends moving towards center.",
      "Compare",
      "If all pairs match, the list is a palindrome.",
    ),
    nodeStates,
    pointers,
    links,
  );

  while (right !== null) {
    if (left!.val !== right.val) {
      pushStep(
        executionSteps,
        "mismatch_found",
        `Mismatch: ${left!.val} != ${right.val}`,
        createMetadata(
          "Result",
          "critical",
          "Mismatch Found!",
          `Values don't match: ${left!.val} ≠ ${right.val}. Not a palindrome.`,
          "No ✗",
          "Time O(n), Space O(1).",
        ),
        nodeStates,
        pointers,
        links,
      );
      return { executionSteps, initialNodeStates, originalValues };
    }

    pushStep(
      executionSteps,
      "compare_halves",
      `Match: ${left!.val} == ${right.val}`,
      createMetadata(
        "Compare",
        "info",
        "Values Match",
        `Node ${left!.val} matches node ${right.val}. Continue checking.`,
        "Match",
      ),
      nodeStates,
      pointers,
      links,
    );

    if (left) {
      nodeStates[left.val] = "completed";
      left = left.next;
    }
    if (right) {
      nodeStates[right.val] = "completed";
      right = right.next;
    }

    pointers.left = left?.val ?? null;
    pointers.right = right?.val ?? null;

    if (left) nodeStates[left.val] = "current";
    if (right) nodeStates[right.val] = "current";
  }

  // Palindrome confirmed
  pushStep(
    executionSteps,
    "palindrome_confirmed",
    "All pairs matched: list is a palindrome!",
    createMetadata(
      "Result",
      "success",
      "Palindrome Confirmed!",
      "All corresponding node pairs have equal values.",
      "Yes ✓",
      "Time O(n), Space O(1).",
    ),
    nodeStates,
    pointers,
    links,
  );

  return { executionSteps, initialNodeStates, originalValues };
}
