import type {
  ExecutionStep,
  DeleteNodeOperationType,
  PointerSnapshot,
  ListNode,
  DeleteNodeStepMetadata,
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

function createMetadata(
  phase: "Setup" | "Check" | "Copy" | "Skip" | "Complete",
  severity: "neutral" | "info" | "warning" | "critical" | "success",
  title: string,
  description: string,
  badge: string,
  tip?: string,
): DeleteNodeStepMetadata {
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
  type: DeleteNodeOperationType,
  operation: string,
  metadata: DeleteNodeStepMetadata,
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

function findNodeByValue(head: ListNode | null, value: number): ListNode | null {
  let current = head;
  while (current !== null) {
    if (current.val === value) return current;
    current = current.next;
  }
  return null;
}

export function generateDeleteNodeSteps(head: ListNode | null, nodeToDeleteValue: number = 2): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, LinkedListNodeState>;
  originalValues: number[];
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, LinkedListNodeState> = {};

  if (head === null || head.next === null) {
    return { executionSteps, initialNodeStates: nodeStates, originalValues: [] };
  }

  // Build original values array
  const originalValues: number[] = [];
  let temp: ListNode | null = head;
  while (temp !== null) {
    originalValues.push(temp.val);
    temp = temp.next;
  }

  initializeNodeStates(head, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);
  const links = buildLinksMap(head);

  // Find the node to delete (default to second node for visualization)
  const nodeToDelete = findNodeByValue(head, nodeToDeleteValue);
  if (!nodeToDelete || !nodeToDelete.next) {
    return { executionSteps, initialNodeStates, originalValues };
  }

  // Initialize pointers
  const pointers: PointerSnapshot = {
    current: nodeToDelete.val,
    next: nodeToDelete.next.val,
    nextNext: nodeToDelete.next.next?.val ?? null,
  };

  // Mark current node as the target
  nodeStates[nodeToDelete.val] = "current";
  nodeStates[nodeToDelete.next.val] = "next_saved";

  pushStep(
    executionSteps,
    "init",
    `Initialize: delete node with value ${nodeToDelete.val}`,
    createMetadata(
      "Setup",
      "info",
      "Initialize Delete",
      `Node with value ${nodeToDelete.val} is marked for deletion.`,
      "Init",
      "We only have access to this node, not the head.",
    ),
    pointers,
    nodeStates,
    links,
  );

  // Check if next node exists
  pushStep(
    executionSteps,
    "check_next",
    `Check: next node exists with value ${nodeToDelete.next.val}`,
    createMetadata(
      "Check",
      "info",
      "Check Next Node",
      "Verify that the next node exists (it's not the tail).",
      "Check",
    ),
    pointers,
    nodeStates,
    links,
  );

  // Copy next node's value to current node
  const nextValue = nodeToDelete.next.val;
  nodeStates[nodeToDelete.val] = "completed";
  nodeStates[nodeToDelete.next.val] = "current";

  pushStep(
    executionSteps,
    "copy_value",
    `Copy: node.val = next.val (${nextValue})`,
    createMetadata(
      "Copy",
      "info",
      "Copy Next Value",
      `Copy the value ${nextValue} from the next node to the current node.`,
      "Copy",
      "This effectively 'deletes' the current node by overwriting it.",
    ),
    { ...pointers },
    nodeStates,
    links,
  );

  // Skip over the next node
  const nextNextValue = nodeToDelete.next.next?.val ?? null;
  links[nodeToDelete.val] = nextNextValue;
  nodeStates[nodeToDelete.next.val] = "completed";

  pushStep(
    executionSteps,
    "skip_next",
    `Skip: node.next = node.next.next (${nextNextValue ?? "null"})`,
    createMetadata(
      "Skip",
      "info",
      "Skip Next Node",
      "Point current node's next pointer to skip over the next node.",
      "Skip",
      "The next node is now orphaned and will be garbage collected.",
    ),
    {
      current: nodeToDelete.val,
      next: nextValue,
      nextNext: nextNextValue,
    },
    nodeStates,
    links,
  );

  // Complete
  pushStep(
    executionSteps,
    "complete",
    "Complete: node deleted successfully",
    createMetadata(
      "Complete",
      "success",
      "Deletion Complete",
      `Node with original value ${nodeToDelete.val} has been deleted.`,
      "Done ✓",
      "Time O(1), space O(1).",
    ),
    {
      current: nodeToDelete.val,
      next: null,
      nextNext: null,
    },
    nodeStates,
    links,
  );

  return { executionSteps, initialNodeStates, originalValues };
}
