import type {
  CallStackFrame,
  ExecutionStep,
  NodeVisualState,
  TreeNode,
} from "./types";

interface InternalFrame {
  nodeVal: number;
  depth: number;
  id: number;
}

function cloneNodeStates(
  states: Record<number, NodeVisualState>,
): Record<number, NodeVisualState> {
  return { ...states };
}

function getCallStackSnapshot(
  stack: InternalFrame[],
  stage: "executing" | "exiting",
  activeId: number,
): CallStackFrame[] {
  return stack.map((frame) => ({
    nodeVal: frame.nodeVal,
    depth: frame.depth,
    id: frame.id,
    state:
      frame.id === activeId
        ? "executing"
        : stage === "exiting"
          ? "returned"
          : "pending",
  }));
}

function initializeNodeStates(
  node: TreeNode | null,
  states: Record<number, NodeVisualState>,
): void {
  if (node === null) {
    return;
  }

  states[node.val] = "unvisited";
  initializeNodeStates(node.left, states);
  initializeNodeStates(node.right, states);
}

function pushStep(
  steps: ExecutionStep[],
  type: ExecutionStep["type"],
  node: TreeNode,
  operation: string,
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>,
): void {
  steps.push({
    type,
    node,
    value: node.val,
    operation,
    callStack,
    nodeStates: cloneNodeStates(nodeStates),
  });
}

export function generateBstdllExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;
  let headValue: number | null = null;
  let tailValue: number | null = null;

  if (root === null) {
    return { executionSteps, initialNodeStates: nodeStates };
  }

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  let head: TreeNode | null = null;
  let prev: TreeNode | null = null;

  function traverse(node: TreeNode | null, depth: number): void {
    if (node === null) {
      return;
    }

    const frameId = frameCounter++;
    callStack.push({ nodeVal: node.val, depth, id: frameId });

    nodeStates[node.val] = "exploring_left";
    pushStep(
      executionSteps,
      "enter_function",
      node,
      `Enter: inorder(node=${node.val})`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    if (node.left) {
      pushStep(
        executionSteps,
        "traverse_left",
        node,
        `Traverse left from node ${node.val}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );
      traverse(node.left, depth + 1);
    }

    nodeStates[node.val] = "current";

    if (prev === null) {
      pushStep(
        executionSteps,
        "set_head",
        node,
        `Set head = ${node.val} (first node in inorder)`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );
      head = node;
      headValue = node.val;
    } else {
      pushStep(
        executionSteps,
        "link_prev_curr",
        node,
        `Link ${prev.val} <-> ${node.val}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );
    }

    pushStep(
      executionSteps,
      "visit",
      node,
      `Visit ${node.val} and move prev pointer`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    prev = node;
    tailValue = node.val;

    nodeStates[node.val] = "exploring_right";

    if (node.right) {
      pushStep(
        executionSteps,
        "traverse_right",
        node,
        `Traverse right from node ${node.val}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );
      traverse(node.right, depth + 1);
    }

    nodeStates[node.val] = "completed";
    pushStep(
      executionSteps,
      "exit_function",
      node,
      `Return from inorder(node=${node.val})`,
      getCallStackSnapshot(callStack, "exiting", frameId),
      nodeStates,
    );

    callStack.pop();
  }

  traverse(root, 0);

  const finalHead = head;
  const finalPrev = prev;

  if (finalHead !== null && finalPrev !== null && headValue !== null && tailValue !== null) {
    pushStep(
      executionSteps,
      "close_cycle",
      finalHead,
      `Close cycle: ${tailValue}.right -> ${headValue} and ${headValue}.left -> ${tailValue}`,
      [],
      nodeStates,
    );
  }

  return {
    executionSteps,
    initialNodeStates,
  };
}

