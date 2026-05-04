import type { ListNode, LinkedListNodeState } from "@/features/shared/linked-list-types";
import type {
  ExecutionStep,
  PointerSnapshot,
  ReverseKGroupOperationType,
  ReverseKGroupStepMetadata,
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
  phase: "Setup" | "Check" | "Reverse" | "Connect" | "Complete",
  severity: "neutral" | "info" | "warning" | "critical" | "success",
  title: string,
  description: string,
  badge: string,
  tip?: string,
): ReverseKGroupStepMetadata {
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
  type: ReverseKGroupOperationType,
  operation: string,
  metadata: ReverseKGroupStepMetadata,
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

export function generateReverseKGroupSteps(
  head: ListNode | null,
  k: number = 3,
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

  // Validate k
  k = Math.max(2, Math.min(k, originalValues.length));

  // Initialize pointers
  let current: ListNode | null = head;
  let prevGroupEnd: ListNode | null = null; // Will be dummy initially
  let groupStart: ListNode | null = head;
  let groupEnd: ListNode | null = null;
  let groupNumber = 1;

  const pointers: PointerSnapshot = {
    current: current?.val ?? null,
    groupStart: groupStart?.val ?? null,
    groupEnd: (groupEnd as ListNode | null)?.val ?? null,
    prevGroupEnd: (prevGroupEnd as ListNode | null | undefined)?.val ?? null,
    k,
  };

  // Mark initial state
  if (current) nodeStates[current.val] = "current";

  pushStep(
    executionSteps,
    "init",
    `Initialize: k = ${k}, current = ${current?.val}, head = ${head?.val}`,
    createMetadata(
      "Setup",
      "info",
      "Initialize Pointers",
      `Set k = ${k} to reverse nodes in groups of size ${k}. Start from head.`,
      "Setup",
      "Dummy node will be used to simplify edge cases.",
    ),
    pointers,
    nodeStates,
    links,
  );

  // Process groups
  while (current !== null) {
    // Check if we have k nodes
    groupStart = current;
    let count = 0;
    let checkCurrent = current;

    while (checkCurrent !== null && count < k) {
      count++;
      checkCurrent = checkCurrent.next!;
    }

    pointers.current = current?.val ?? null;
    pointers.groupStart = groupStart?.val ?? null;

    pushStep(
      executionSteps,
      "check_group",
      `Check group: found ${count} nodes, need ${k} nodes`,
      createMetadata(
        "Check",
        "info",
        "Check Group Size",
        `Count nodes from current position. Have ${count}, need ${k}.`,
        `Check ${count}/${k}`,
      ),
      pointers,
      nodeStates,
      links,
    );

    if (count < k) {
      // Incomplete group - keep as is
      pushStep(
        executionSteps,
        "incomplete",
        `Incomplete group: only ${count} nodes (< ${k}), keep unchanged`,
        createMetadata(
          "Complete",
          "neutral",
          "Incomplete Group",
          "Remaining nodes are less than k, so they stay in original order.",
          "Done",
          "Time O(n), space O(1).",
        ),
        pointers,
        nodeStates,
        links,
      );
      break;
    }

    // Reverse the group of k nodes
    let prev: ListNode | null = null;
    let curr: ListNode | null = groupStart;
    const groupNodes: number[] = [];

    for (let i = 0; i < k && curr !== null; i++) {
      groupNodes.push(curr.val);
      const next: ListNode | null = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }

    // Update links
    if (prevGroupEnd !== null) {
      links[prevGroupEnd.val] = prev?.val ?? null;
    }
    if (groupStart !== null) {
      links[groupStart.val] = curr?.val ?? null;
    }

    // Mark nodes as reversed
    groupNodes.forEach((val) => {
      nodeStates[val] = "reversed";
    });

    groupEnd = groupStart;
    pointers.groupEnd = groupEnd?.val ?? null;
    pointers.current = curr?.val ?? null;

    pushStep(
      executionSteps,
      "reverse_group",
      `Reverse group #${groupNumber}: ${groupNodes.join(" → ")} → ${groupNodes.reverse().join(" ← ")}`,
      createMetadata(
        "Reverse",
        "warning",
        "Reverse Group",
        `Reverse ${k} nodes in the current group using three-pointer technique.`,
        `Reverse ${k}`,
        "Each node's next pointer is reversed.",
      ),
      pointers,
      nodeStates,
      links,
    );

    // Connect reversed group to previous
    if (prevGroupEnd !== null) {
      prevGroupEnd.next = prev;
    }
    if (groupStart !== null) {
      groupStart.next = curr;
      prevGroupEnd = groupStart;
    }

    pointers.prevGroupEnd = prevGroupEnd?.val ?? null;

    pushStep(
      executionSteps,
      "connect_groups",
      `Connect group #${groupNumber}: prev_group_end.next = ${prev?.val}, group_start.next = ${curr?.val ?? "null"}`,
      createMetadata(
        "Connect",
        "info",
        "Connect Groups",
        "Connect the reversed group to the previous group's end.",
        "Connect",
        "Maintains the linked list structure.",
      ),
      pointers,
      nodeStates,
      links,
    );

    // Mark group as completed
    groupNodes.forEach((val) => {
      nodeStates[val] = "completed";
    });

    current = curr;
    groupNumber++;
  }

  // Complete
  pushStep(
    executionSteps,
    "complete",
    `Complete: reversed ${groupNumber - 1} group(s) of size ${k}`,
    createMetadata(
      "Complete",
      "success",
      "Reversal Complete!",
      `Successfully reversed nodes in groups of size ${k}.`,
      "Done ✓",
      "Time O(n), space O(1).",
    ),
    pointers,
    nodeStates,
    links,
  );

  return { executionSteps, initialNodeStates, originalValues };
}
