import type {
  ExecutionStep,
  AddTwoNumbersOperationType,
  PointerSnapshot,
  ListNode,
  AddTwoNumbersStepMetadata,
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
  phase: "Setup" | "Extraction" | "Calculation" | "Node Creation" | "Carry Check" | "Complete",
  severity: "neutral" | "info" | "warning" | "critical" | "success",
  title: string,
  description: string,
  badge: string,
  tip?: string,
): AddTwoNumbersStepMetadata {
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
  type: AddTwoNumbersOperationType,
  operation: string,
  metadata: AddTwoNumbersStepMetadata,
  list1: ListData,
  list2: ListData,
  result: ListData,
  pointers: PointerSnapshot,
): void {
  steps.push({
    type,
    operation,
    metadata,
    list1: cloneListData(list1),
    list2: cloneListData(list2),
    result: cloneListData(result),
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

export function generateAddTwoNumbersSteps(head1: ListNode | null, head2: ListNode | null): {
  executionSteps: ExecutionStep[];
  list1: ListData;
  list2: ListData;
} {
  const executionSteps: ExecutionStep[] = [];

  if (head1 === null && head2 === null) {
    return {
      executionSteps,
      list1: { values: [], nodeStates: {}, links: {} },
      list2: { values: [], nodeStates: {}, links: {} },
    };
  }

  // Initialize list1 data
  const list1Values = linkedListToArray(head1);
  const list1NodeStates: Record<number, LinkedListNodeState> = {};
  initializeNodeStates(head1, list1NodeStates);
  const list1Links = buildLinksMap(head1);
  const list1: ListData = { values: list1Values, nodeStates: list1NodeStates, links: list1Links };

  // Initialize list2 data
  const list2Values = linkedListToArray(head2);
  const list2NodeStates: Record<number, LinkedListNodeState> = {};
  initializeNodeStates(head2, list2NodeStates);
  const list2Links = buildLinksMap(head2);
  const list2: ListData = { values: list2Values, nodeStates: list2NodeStates, links: list2Links };

  // Result list (starts empty)
  const resultNodeStates: Record<number, LinkedListNodeState> = {};
  const resultLinks: Record<number, number | null> = {};
  const resultValues: number[] = [];
  const result: ListData = { values: resultValues, nodeStates: resultNodeStates, links: resultLinks };

  // Initialize pointers
  const pointers: PointerSnapshot = {
    l1: head1?.val ?? null,
    l2: head2?.val ?? null,
    current: null,
    carry: 0,
  };

  // Mark initial positions
  if (head1) list1NodeStates[head1.val] = "current";
  if (head2) list2NodeStates[head2.val] = "current";

  pushStep(
    executionSteps,
    "init_l1",
    "Initialize: l1 and l2 pointers",
    createMetadata(
      "Setup",
      "info",
      "Initialize Pointers",
      "Set up pointers for both input lists and the result list.",
      "Init",
      "We'll traverse both lists simultaneously.",
    ),
    list1,
    list2,
    result,
    pointers,
  );

  // Initialize result dummy head
  const dummyValue = 0;
  resultNodeStates[dummyValue] = "current";
  resultValues.push(dummyValue);
  resultLinks[dummyValue] = null;

  pushStep(
    executionSteps,
    "init_result",
    "Initialize: dummy head for result list",
    createMetadata(
      "Setup",
      "info",
      "Initialize Result",
      "Create a dummy head for the result list to simplify insertion.",
      "Init",
      "The dummy head will be removed at the end.",
    ),
    list1,
    list2,
    result,
    { ...pointers, current: dummyValue },
  );

  // Main loop
  let l1: ListNode | null = head1;
  let l2: ListNode | null = head2;
  let carry = 0;
  let currentResultVal = dummyValue;
  let stepCount = 0;

  while (l1 !== null || l2 !== null) {
    stepCount++;

    // Check both lists
    pushStep(
      executionSteps,
      "check_both",
      `Check: l1=${l1?.val ?? "null"}, l2=${l2?.val ?? "null"}`,
      createMetadata(
        "Extraction",
        "info",
        "Check Lists",
        "Check if there are more nodes in either list.",
        "Check",
      ),
      list1,
    list2,
    result,
      { ...pointers, l1: l1?.val ?? null, l2: l2?.val ?? null, current: currentResultVal, carry },
    );

    // Extract digits
    const val1 = l1?.val ?? 0;
    const val2 = l2?.val ?? 0;

    if (l1) list1NodeStates[l1.val] = "current";
    if (l2) list2NodeStates[l2.val] = "current";

    pushStep(
      executionSteps,
      "extract_digits",
      `Extract: val1=${val1}, val2=${val2}`,
      createMetadata(
        "Extraction",
        "info",
        "Extract Digits",
        `Extract digits from both lists (use 0 if list is exhausted).`,
        "Extract",
      ),
      list1,
      list2,
      result,
      { ...pointers, l1: val1, l2: val2, current: currentResultVal, carry },
    );

    // Calculate sum
    const total = val1 + val2 + carry;
    const newCarry = Math.floor(total / 10);
    const digit = total % 10;

    carry = newCarry;

    pushStep(
      executionSteps,
      "calculate_sum",
      `Calculate: ${val1} + ${val2} + ${carry - newCarry} = ${total}, carry=${newCarry}, digit=${digit}`,
      createMetadata(
        "Calculation",
        "info",
        "Calculate Sum",
        `Add digits along with carry. Sum = ${total}, New carry = ${newCarry}, Digit = ${digit}.`,
        "Calculate",
      ),
      list1,
      list2,
      result,
      { ...pointers, l1: val1, l2: val2, current: currentResultVal, carry: newCarry },
    );

    // Create new node
    resultNodeStates[digit] = "current";
    resultValues.push(digit);
    resultLinks[currentResultVal] = digit;

    pushStep(
      executionSteps,
      "create_node",
      `Create: new node with value ${digit}`,
      createMetadata(
        "Node Creation",
        "info",
        "Create Node",
        `Create a new node with digit ${digit} and link it to the result list.`,
        "Create",
      ),
      list1,
      list2,
      result,
      { ...pointers, l1: val1, l2: val2, current: digit, carry: newCarry },
    );

    // Advance pointers
    if (l1) {
      list1NodeStates[l1.val] = "completed";
      l1 = l1.next;
    }
    if (l2) {
      list2NodeStates[l2.val] = "completed";
      l2 = l2.next;
    }
    resultNodeStates[currentResultVal] = "completed";
    currentResultVal = digit;

    pushStep(
      executionSteps,
      "advance_pointers",
      `Advance: l1=${l1?.val ?? "null"}, l2=${l2?.val ?? "null"}, current=${currentResultVal}`,
      createMetadata(
        "Node Creation",
        "info",
        "Advance Pointers",
        "Move to the next nodes in both input lists and the result list.",
        "Advance",
      ),
      list1,
      list2,
      result,
      { ...pointers, l1: l1?.val ?? null, l2: l2?.val ?? null, current: currentResultVal, carry: newCarry },
    );
  }

  // Check for remaining carry
  if (carry > 0) {
    pushStep(
      executionSteps,
      "check_carry",
      `Check: carry=${carry} > 0`,
      createMetadata(
        "Carry Check",
        "info",
        "Check Carry",
        "Check if there's a remaining carry to add.",
        "Check",
      ),
      list1,
      list2,
      result,
      { ...pointers, l1: null, l2: null, current: currentResultVal, carry },
    );

    // Add carry node
    resultNodeStates[carry] = "current";
    resultValues.push(carry);
    resultLinks[currentResultVal] = carry;

    pushStep(
      executionSteps,
      "add_carry_node",
      `Add: carry node with value ${carry}`,
      createMetadata(
        "Carry Check",
        "info",
        "Add Carry Node",
        `Add a final node for the remaining carry value ${carry}.`,
        "Add Carry",
      ),
      list1,
      list2,
      result,
      { ...pointers, l1: null, l2: null, current: carry, carry },
    );
  }

  // Complete
  resultNodeStates[currentResultVal] = "completed";

  pushStep(
    executionSteps,
    "check_carry",
    "Complete: result list built successfully",
    createMetadata(
      "Complete",
      "success",
      "Addition Complete",
      "Both lists have been processed and the result list is ready.",
      "Done ✓",
      "Time O(max(n, m)), space O(max(n, m) + 1).",
    ),
    list1,
    list2,
    result,
    { ...pointers, l1: null, l2: null, current: null, carry: 0 },
  );

  return { executionSteps, list1, list2 };
}
