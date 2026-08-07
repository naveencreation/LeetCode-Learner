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
  hd: number,
  operation: string,
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>,
): void {
  steps.push({
    type,
    node,
    value: node.val,
    hd,
    operation,
    callStack,
    nodeStates: cloneNodeStates(nodeStates),
  });
}

export function generateTopViewExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  if (!root) {
    executionSteps.push({
      type: "finish",
      node: null,
      value: undefined,
      hd: 0,
      operation: "Tree is empty; top view is []",
      callStack: [],
      nodeStates: cloneNodeStates(nodeStates),
    });

    return {
      executionSteps,
      initialNodeStates,
    };
  }

  const queue: Array<{ node: TreeNode; hd: number; level: number }> = [
    { node: root, hd: 0, level: 0 },
  ];
  const topSeen = new Set<number>();

  while (queue.length > 0) {
    const current = queue.shift() as { node: TreeNode; hd: number; level: number };
    const { node, hd, level } = current;
    const frameId = frameCounter++;

    callStack.push({ nodeVal: node.val, depth: level, id: frameId });
    nodeStates[node.val] = "current";

    pushStep(
      executionSteps,
      "enter_function",
      node,
      hd,
      `Pop node ${node.val} (hd=${hd}) from queue`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    if (!topSeen.has(hd)) {
      topSeen.add(hd);
      pushStep(
        executionSteps,
        "visit",
        node,
        hd,
        `Capture top view node ${node.val} at hd ${hd}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );
    }

    if (node.left) {
      nodeStates[node.val] = "exploring_left";
      pushStep(
        executionSteps,
        "traverse_left",
        node,
        hd,
        `Queue left child ${node.left.val} with hd ${hd - 1}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );
      queue.push({ node: node.left, hd: hd - 1, level: level + 1 });
    }

    if (node.right) {
      nodeStates[node.val] = "exploring_right";
      pushStep(
        executionSteps,
        "traverse_right",
        node,
        hd,
        `Queue right child ${node.right.val} with hd ${hd + 1}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );
      queue.push({ node: node.right, hd: hd + 1, level: level + 1 });
    }

    nodeStates[node.val] = "completed";

    pushStep(
      executionSteps,
      "exit_function",
      node,
      hd,
      `Done processing node ${node.val}`,
      getCallStackSnapshot(callStack, "exiting", frameId),
      nodeStates,
    );

    callStack.pop();
  }

  return {
    executionSteps,
    initialNodeStates,
  };
}
