import type { LinkedListNodeState, ListNode } from "@/features/shared/linked-list-types";
import type { ExecutionStep, RotateOperationType, PointerSnapshot, RotatePhase, RotateSeverity } from "./types";

function makeStep(
  type: RotateOperationType,
  title: string,
  description: string,
  phase: RotatePhase,
  severity: RotateSeverity,
  pointers: PointerSnapshot,
  links: Record<number, number | null>,
  nodeValues: number[],
  highlightedIdxs: number[] = [],
  visitedIdxs: number[] = [],
  tip?: string
): ExecutionStep {
  const nodeStates: Record<number, LinkedListNodeState> = {};
  nodeValues.forEach((_, i) => {
    nodeStates[i] = highlightedIdxs.includes(i)
      ? "current"
      : visitedIdxs.includes(i)
        ? "completed"
        : "unvisited";
  });

  return {
    type,
    operation: type,
    metadata: {
      phase,
      severity,
      title,
      description,
      badge: type.toUpperCase().replace(/_/g, " "),
      tip,
    },
    nodeStates,
    pointers,
    links,
  };
}

function extractValues(head: ListNode | null): number[] {
  const values: number[] = [];
  let curr = head;
  while (curr !== null) {
    values.push(curr.val);
    curr = curr.next;
  }
  return values;
}

function buildLinks(values: number[]): Record<number, number | null> {
  const links: Record<number, number | null> = {};
  for (let i = 0; i < values.length; i++) {
    links[i] = i < values.length - 1 ? i + 1 : null;
  }
  return links;
}

function getNodeIndexByValue(values: number[], target: number): number | null {
  const idx = values.indexOf(target);
  return idx >= 0 ? idx : null;
}

export function generateRotateSteps(head: ListNode | null, kInput: number): { executionSteps: ExecutionStep[]; initialNodeStates: Record<number, LinkedListNodeState>; originalValues: number[] } {
  const steps: ExecutionStep[] = [];
  const nodeValues = extractValues(head);

  if (nodeValues.length === 0) {
    steps.push(
      makeStep(
        "init",
        "Empty List",
        "The linked list is empty. Nothing to rotate.",
        "Setup",
        "neutral",
        { head: null, tail: null, curr: null, newTail: null, newHead: null, length: 0, k: 0 },
        {},
        nodeValues,
        [],
        []
      )
    );
    const initialNodeStates: Record<number, LinkedListNodeState> = {};
    nodeValues.forEach((_, i) => { initialNodeStates[i] = "unvisited"; });
    return { executionSteps: steps, initialNodeStates, originalValues: nodeValues };
  }

  const baseLinks = buildLinks(nodeValues);
  const k = kInput;

  // init step
  steps.push(
    makeStep(
      "init",
      "Initialize",
      `Rotate list [${nodeValues.join(", ")}] right by ${k} places.`,
      "Setup",
      "neutral",
      { head: 0, tail: null, curr: null, newTail: null, newHead: null, length: nodeValues.length, k },
      baseLinks,
      nodeValues,
      [0],
      [],
      "Edge case: if list has 0 or 1 nodes, or k == 0, return as-is."
    )
  );

  if (nodeValues.length <= 1 || k === 0) {
    steps.push(
      makeStep(
        "done",
        "No Rotation Needed",
        "List is too short or k is zero. Returning original list.",
        "Result",
        "success",
        { head: 0, tail: null, curr: null, newTail: null, newHead: null, length: nodeValues.length, k: 0 },
        baseLinks,
        nodeValues,
        [],
        nodeValues.map((_, i) => i)
      )
    );
    const initialNodeStates: Record<number, LinkedListNodeState> = {};
    nodeValues.forEach((_, i) => { initialNodeStates[i] = "unvisited"; });
    return { executionSteps: steps, initialNodeStates, originalValues: nodeValues };
  }

  // count_length + find_tail
  let length = 1;
  let tailIdx = 0;
  const visited: number[] = [0];

  for (let i = 1; i < nodeValues.length; i++) {
    steps.push(
      makeStep(
        "count_length",
        `Counting Length (step ${i})`,
        `Traverse to node ${nodeValues[i]}. Current length: ${i}.`,
        "Count",
        "info",
        { head: 0, tail: tailIdx, curr: i, newTail: null, newHead: null, length: i, k },
        baseLinks,
        nodeValues,
        [i],
        [...visited]
      )
    );
    length = i + 1;
    tailIdx = i;
    visited.push(i);
  }

  steps.push(
    makeStep(
      "find_tail",
      "Tail Found",
      `Tail is node ${nodeValues[tailIdx]} at index ${tailIdx}. Total length = ${length}.`,
      "Count",
      "info",
      { head: 0, tail: tailIdx, curr: null, newTail: null, newHead: null, length, k },
      baseLinks,
      nodeValues,
      [tailIdx],
      [...visited]
    )
  );

  // compute_k
  const effectiveK = k % length;
  steps.push(
    makeStep(
      "compute_k",
      "Compute Effective Rotations",
      `k (${k}) % length (${length}) = ${effectiveK}. We only need to rotate ${effectiveK} times.`,
      "Find K",
      effectiveK === 0 ? "warning" : "info",
      { head: 0, tail: tailIdx, curr: null, newTail: null, newHead: null, length, k: effectiveK },
      baseLinks,
      nodeValues,
      [tailIdx],
      [...visited],
      effectiveK === 0 ? "Since effective k is 0, the list remains unchanged." : undefined
    )
  );

  if (effectiveK === 0) {
    steps.push(
      makeStep(
        "done",
        "No Rotation Needed",
        "Effective k is 0. The list remains unchanged.",
        "Result",
        "success",
        { head: 0, tail: tailIdx, curr: null, newTail: null, newHead: null, length, k: 0 },
        baseLinks,
        nodeValues,
        [],
        nodeValues.map((_, i) => i)
      )
    );
    const initialNodeStates: Record<number, LinkedListNodeState> = {};
    nodeValues.forEach((_, i) => { initialNodeStates[i] = "unvisited"; });
    return { executionSteps: steps, initialNodeStates, originalValues: nodeValues };
  }

  // find_new_tail: length - effectiveK - 1 steps from head
  const newTailIdx = length - effectiveK - 1;
  const newHeadIdx = length - effectiveK;
  const findPath: number[] = [];

  for (let i = 0; i <= newTailIdx; i++) {
    findPath.push(i);
    steps.push(
      makeStep(
        "find_new_tail",
        `Finding New Tail (step ${i + 1})`,
        `Walking to node at index ${i} (value ${nodeValues[i]}).`,
        "Break & Relink",
        "info",
        { head: 0, tail: tailIdx, curr: i, newTail: newTailIdx, newHead: newHeadIdx, length, k: effectiveK },
        baseLinks,
        nodeValues,
        [i, tailIdx],
        [...visited]
      )
    );
  }

  // break_and_relink
  const relinkedLinks: Record<number, number | null> = {};
  for (let i = 0; i < nodeValues.length; i++) {
    if (i === newTailIdx) {
      relinkedLinks[i] = null;
    } else if (i === tailIdx) {
      relinkedLinks[i] = 0;
    } else {
      relinkedLinks[i] = i + 1;
    }
  }

  steps.push(
    makeStep(
      "break_and_relink",
      "Break & Relink",
      `Break link after index ${newTailIdx} (value ${nodeValues[newTailIdx]}). Connect tail (index ${tailIdx}) to head (index 0). New head is index ${newHeadIdx} (value ${nodeValues[newHeadIdx]}).`,
      "Break & Relink",
      "info",
      { head: newHeadIdx, tail: tailIdx, curr: null, newTail: newTailIdx, newHead: newHeadIdx, length, k: effectiveK },
      relinkedLinks,
      nodeValues,
      [newHeadIdx, newTailIdx, tailIdx],
      [...visited]
    )
  );

  // done
  steps.push(
    makeStep(
      "done",
      "Rotation Complete",
      `Rotated list: [${nodeValues.slice(newHeadIdx).concat(nodeValues.slice(0, newHeadIdx)).join(", ")}].`,
      "Result",
      "success",
      { head: newHeadIdx, tail: newTailIdx, curr: null, newTail: newTailIdx, newHead: newHeadIdx, length, k: effectiveK },
      relinkedLinks,
      nodeValues,
      [],
      nodeValues.map((_, i) => i)
    )
  );

  const initialNodeStates: Record<number, LinkedListNodeState> = {};
  nodeValues.forEach((_, i) => { initialNodeStates[i] = "unvisited"; });
  return { executionSteps: steps, initialNodeStates, originalValues: nodeValues };
}
