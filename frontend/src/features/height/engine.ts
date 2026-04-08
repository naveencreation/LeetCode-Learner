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
  node: TreeNode | null,
  depth: number,
  operation: string,
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>,
  metadata?: {
    leftHeight?: number;
    rightHeight?: number;
    computedHeight?: number;
    maxHeight?: number;
  },
): void {
  steps.push({
    type,
    node,
    value: node?.val,
    depth,
    leftHeight: metadata?.leftHeight,
    rightHeight: metadata?.rightHeight,
    computedHeight: metadata?.computedHeight,
    maxHeight: metadata?.maxHeight,
    operation,
    callStack,
    nodeStates: cloneNodeStates(nodeStates),
  });
}

export function generateHeightExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;
  let maxDepthFound = 0;

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  if (!root) {
    executionSteps.push({
      type: "finish",
      node: null,
      value: undefined,
      depth: 0,
      computedHeight: 0,
      maxHeight: 0,
      operation: "Tree is empty; maximum depth is 0",
      callStack: [],
      nodeStates: cloneNodeStates(nodeStates),
    });

    return { executionSteps, initialNodeStates };
  }

  function dfs(node: TreeNode | null, depth: number): number {
    if (!node) {
      return 0;
    }

    const frameId = frameCounter++;
    callStack.push({ nodeVal: node.val, depth, id: frameId });

    nodeStates[node.val] = "current";
    pushStep(
      executionSteps,
      "enter_function",
      node,
      depth,
      `Enter maxDepth(node=${node.val})`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    let leftHeight = 0;
    let rightHeight = 0;

    if (node.left) {
      nodeStates[node.val] = "exploring_left";
      pushStep(
        executionSteps,
        "traverse_left",
        node,
        depth,
        `Recurse left from node ${node.val}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );
      leftHeight = dfs(node.left, depth + 1);
    }

    if (node.right) {
      nodeStates[node.val] = "exploring_right";
      pushStep(
        executionSteps,
        "traverse_right",
        node,
        depth,
        `Recurse right from node ${node.val}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );
      rightHeight = dfs(node.right, depth + 1);
    }

    const currentHeight = 1 + Math.max(leftHeight, rightHeight);
    maxDepthFound = Math.max(maxDepthFound, currentHeight);
    nodeStates[node.val] = "completed";

    pushStep(
      executionSteps,
      "compute_height",
      node,
      depth,
      `height(${node.val}) = 1 + max(${leftHeight}, ${rightHeight}) = ${currentHeight}`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
      {
        leftHeight,
        rightHeight,
        computedHeight: currentHeight,
        maxHeight: maxDepthFound,
      },
    );

    pushStep(
      executionSteps,
      "exit_function",
      node,
      depth,
      `Return ${currentHeight} from maxDepth(node=${node.val})`,
      getCallStackSnapshot(callStack, "exiting", frameId),
      nodeStates,
      {
        computedHeight: currentHeight,
        maxHeight: maxDepthFound,
      },
    );

    callStack.pop();
    return currentHeight;
  }

  const treeHeight = dfs(root, 0);

  executionSteps.push({
    type: "finish",
    node: root,
    value: root.val,
    depth: 0,
    computedHeight: treeHeight,
    maxHeight: maxDepthFound,
    operation: `Traversal complete. Maximum depth is ${treeHeight}.`,
    callStack: [],
    nodeStates: cloneNodeStates(nodeStates),
  });

  return { executionSteps, initialNodeStates };
}
