import type { LinkedListNodeState } from "@/features/shared/linked-list-types";
import type { ExecutionStep, CloneOperationType, PointerSnapshot, ClonePhase, CloneSeverity, RandomListNode } from "./types";

function makeStep(
  type: CloneOperationType,
  title: string,
  description: string,
  phase: ClonePhase,
  severity: CloneSeverity,
  pointers: PointerSnapshot,
  links: Record<number, { next: number | null; random: number | null }>,
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

function buildLinks(values: number[], randomMap: Record<number, number | null>): Record<number, { next: number | null; random: number | null }> {
  const links: Record<number, { next: number | null; random: number | null }> = {};
  for (let i = 0; i < values.length; i++) {
    links[i] = {
      next: i < values.length - 1 ? i + 1 : null,
      random: randomMap[i] ?? null,
    };
  }
  return links;
}

export function generateCloneSteps(
  values: number[],
  randomMap: Record<number, number | null>
): { executionSteps: ExecutionStep[]; initialNodeStates: Record<number, LinkedListNodeState>; originalValues: number[] } {
  const steps: ExecutionStep[] = [];

  if (values.length === 0) {
    const initialNodeStates: Record<number, LinkedListNodeState> = {};
    steps.push(
      makeStep(
        "init",
        "Empty List",
        "The linked list is empty. Nothing to clone.",
        "Setup",
        "neutral",
        { curr: null, copy: null, originalHead: null, copyHead: null },
        {},
        values,
        [],
        []
      )
    );
    return { executionSteps: steps, initialNodeStates, originalValues: values };
  }

  const baseLinks = buildLinks(values, randomMap);
  const visited: number[] = [];

  // init step
  steps.push(
    makeStep(
      "init",
      "Initialize",
      `Clone list [${values.join(", ")}] with random pointers.`,
      "Setup",
      "neutral",
      { curr: 0, copy: null, originalHead: 0, copyHead: null },
      baseLinks,
      values,
      [0],
      [],
      "O(n) approach: weave copy nodes in, set randoms, then separate."
    )
  );
  visited.push(0);

  // Step 1: Create copy nodes and weave them in
  // We'll simulate showing each node getting a copy inserted after it
  for (let i = 0; i < values.length; i++) {
    const copyIdx = i; // visualizing copy being placed at same position for simplicity
    steps.push(
      makeStep(
        "create_copy_nodes",
        `Weave Copy Node (step ${i + 1})`,
        `Insert copy of node ${values[i]} after original.`,
        "Copy Nodes",
        "info",
        { curr: i, copy: copyIdx, originalHead: 0, copyHead: null },
        baseLinks,
        values,
        [i],
        [...visited]
      )
    );
    if (!visited.includes(i)) visited.push(i);
  }

  // Step 2: Set random pointers for copies
  for (let i = 0; i < values.length; i++) {
    const randTarget = randomMap[i];
    steps.push(
      makeStep(
        "set_copy_randoms",
        `Set Random Pointer (step ${i + 1})`,
        randTarget !== null && randTarget !== undefined
          ? `Node ${values[i]}'s copy gets random pointing to node at index ${randTarget}.`
          : `Node ${values[i]}'s copy has no random pointer (null).`,
        "Set Randoms",
        "info",
        { curr: i, copy: i, originalHead: 0, copyHead: null },
        baseLinks,
        values,
        [i, ...(randTarget !== null && randTarget !== undefined ? [randTarget] : [])],
        [...visited]
      )
    );
  }

  // Step 3: Separate lists
  steps.push(
    makeStep(
      "separate_lists",
      "Separate Original and Copy",
      "Restore original list next pointers and extract the cloned list.",
      "Separate",
      "info",
      { curr: null, copy: null, originalHead: 0, copyHead: 0 },
      baseLinks,
      values,
      [],
      [...visited]
    )
  );

  // done
  steps.push(
    makeStep(
      "done",
      "Clone Complete",
      "Deep copy of the list with random pointers has been created.",
      "Result",
      "success",
      { curr: null, copy: null, originalHead: 0, copyHead: 0 },
      baseLinks,
      values,
      [],
      values.map((_, i) => i)
    )
  );

  const initialNodeStates: Record<number, LinkedListNodeState> = {};
  values.forEach((_, i) => { initialNodeStates[i] = "unvisited"; });

  return { executionSteps: steps, initialNodeStates, originalValues: values };
}
