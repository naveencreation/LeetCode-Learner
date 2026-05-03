import type { ListNode, LinkedListNodeState } from "../shared/linked-list-types";
import type {
  ExecutionStep,
  PointerSnapshot,
  MergeOperationType,
  MergeStepMetadata,
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
  phase: string,
  severity: MergeStepMetadata["severity"],
  title: string,
  description: string,
  badge: string,
  insight: string,
): MergeStepMetadata {
  return { phase, severity, title, description, badge, insight };
}

function pushStep(
  steps: ExecutionStep[],
  type: MergeOperationType,
  operation: string,
  pointers: PointerSnapshot,
  nodeStates: Record<number, LinkedListNodeState>,
  links: Record<number, number | null>,
  mergedList: number[],
  metadata?: MergeStepMetadata,
): void {
  steps.push({
    type,
    operation,
    nodeStates: cloneNodeStates(nodeStates),
    pointers: snap(pointers),
    links: cloneLinks(links),
    mergedList: [...mergedList],
    metadata,
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

function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

export function generateMergeSteps(
  list1: ListNode | null,
  list2: ListNode | null,
): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, LinkedListNodeState>;
  originalValues1: number[];
  originalValues2: number[];
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, LinkedListNodeState> = {};
  const links: Record<number, number | null> = {};

  const originalValues1 = listToArray(list1);
  const originalValues2 = listToArray(list2);

  // Initialize states for both lists
  initializeNodeStates(list1, nodeStates);
  initializeNodeStates(list2, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  // Build initial links
  buildLinksMap(list1);
  buildLinksMap(list2);

  const pointers: PointerSnapshot = {
    list1: list1?.val ?? null,
    list2: list2?.val ?? null,
    current: null, // dummy node (not a real node)
  };

  const mergedList: number[] = [];

  // Step 0: initialization
  if (list1) nodeStates[list1.val] = "current";
  if (list2) nodeStates[list2.val] = "current";

  pushStep(
    executionSteps,
    "init",
    `Initialize: dummy node created, current = dummy, list1 head = ${list1?.val ?? "null"}, list2 head = ${list2?.val ?? "null"}`,
    pointers,
    nodeStates,
    links,
    mergedList,
    createMetadata(
      "Initialize",
      "info",
      "Setup",
      "Create dummy node and initialize pointers for merging.",
      "Start",
      "Dummy node simplifies edge cases by providing a consistent starting point.",
    ),
  );

  let currentList1 = list1;
  let currentList2 = list2;

  // Merge loop
  while (currentList1 !== null && currentList2 !== null) {
    // Compare step
    pushStep(
      executionSteps,
      "compare",
      `Compare: list1.val = ${currentList1.val}, list2.val = ${currentList2.val}`,
      pointers,
      nodeStates,
      links,
      mergedList,
      createMetadata(
        "Compare",
        "info",
        "Comparison",
        "Compare current nodes from both lists.",
        "Compare",
        "We compare values to determine which node to attach next.",
      ),
    );

    if (currentList1.val <= currentList2.val) {
      // Attach list1 node
      nodeStates[currentList1.val] = "current";
      mergedList.push(currentList1.val);

      pushStep(
        executionSteps,
        "attach_list1",
        `Attach list1 node: ${currentList1.val} <= ${currentList2.val}`,
        pointers,
        nodeStates,
        links,
        mergedList,
        createMetadata(
          "Attach",
          "success",
          "Attach List1",
          "List1 node is smaller or equal.",
          "Attach",
          "Attach the smaller node to maintain sorted order.",
        ),
      );

      // Mark as completed and advance
      nodeStates[currentList1.val] = "completed";
      currentList1 = currentList1.next;
      pointers.list1 = currentList1?.val ?? null;

      if (currentList1) {
        nodeStates[currentList1.val] = "current";
      }

      pushStep(
        executionSteps,
        "advance_current",
        `Advance list1: list1 = ${currentList1?.val ?? "null"}`,
        pointers,
        nodeStates,
        links,
        mergedList,
      );
    } else {
      // Attach list2 node
      nodeStates[currentList2.val] = "current";
      mergedList.push(currentList2.val);

      pushStep(
        executionSteps,
        "attach_list2",
        `Attach list2 node: ${currentList2.val} < ${currentList1.val}`,
        pointers,
        nodeStates,
        links,
        mergedList,
        createMetadata(
          "Attach",
          "success",
          "Attach List2",
          "List2 node is smaller.",
          "Attach",
          "Attach the smaller node to maintain sorted order.",
        ),
      );

      // Mark as completed and advance
      nodeStates[currentList2.val] = "completed";
      currentList2 = currentList2.next;
      pointers.list2 = currentList2?.val ?? null;

      if (currentList2) {
        nodeStates[currentList2.val] = "current";
      }

      pushStep(
        executionSteps,
        "advance_current",
        `Advance list2: list2 = ${currentList2?.val ?? "null"}`,
        pointers,
        nodeStates,
        links,
        mergedList,
      );
    }
  }

  // Append remaining nodes from list1
  while (currentList1 !== null) {
    nodeStates[currentList1.val] = "current";
    mergedList.push(currentList1.val);

    pushStep(
      executionSteps,
      "append_remaining_list1",
      `Append remaining list1 node: ${currentList1.val}`,
      pointers,
      nodeStates,
      links,
      mergedList,
      createMetadata(
        "Append",
        "info",
        "Append List1",
        "List1 still has nodes.",
        "Append",
        "Attach remaining nodes from the non-exhausted list.",
      ),
    );

    nodeStates[currentList1.val] = "completed";
    currentList1 = currentList1.next;
    pointers.list1 = currentList1?.val ?? null;

    if (currentList1) {
      nodeStates[currentList1.val] = "current";
    }
  }

  // Append remaining nodes from list2
  while (currentList2 !== null) {
    nodeStates[currentList2.val] = "current";
    mergedList.push(currentList2.val);

    pushStep(
      executionSteps,
      "append_remaining_list2",
      `Append remaining list2 node: ${currentList2.val}`,
      pointers,
      nodeStates,
      links,
      mergedList,
      createMetadata(
        "Append",
        "info",
        "Append List2",
        "List2 still has nodes.",
        "Append",
        "Attach remaining nodes from the non-exhausted list.",
      ),
    );

    nodeStates[currentList2.val] = "completed";
    currentList2 = currentList2.next;
    pointers.list2 = currentList2?.val ?? null;

    if (currentList2) {
      nodeStates[currentList2.val] = "current";
    }
  }

  // Complete
  pushStep(
    executionSteps,
    "complete",
    `Return dummy.next: merged list = [${mergedList.join(", ")}]`,
    pointers,
    nodeStates,
    links,
    mergedList,
    createMetadata(
      "Complete",
      "success",
      "Done",
      "Both lists merged successfully.",
      "Done ✓",
      "Return dummy.next as the head of the merged list.",
    ),
  );

  return { executionSteps, initialNodeStates, originalValues1, originalValues2 };
}
