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
  value: number = node.val,
): void {
  steps.push({
    type,
    node,
    value,
    operation,
    callStack,
    nodeStates: cloneNodeStates(nodeStates),
  });
}

export function generateDiameterExecutionSteps(root: TreeNode | null) {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;
  let maxDiameter = 0;

  if (root === null) {
    return { executionSteps, initialNodeStates: nodeStates };
  }

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  function traverse(node: TreeNode | null, depth: number): number {
    if (node === null) {
      return 0;
    }

    const frameId = frameCounter++;
    callStack.push({ nodeVal: node.val, depth, id: frameId });

    nodeStates[node.val] = "exploring_left";
    pushStep(
      executionSteps,
      "enter_function",
      node,
      `Enter: heights(node=${node.val})`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    // compute left
    pushStep(
      executionSteps,
      "compute_left",
      node,
      `Compute left height of node ${node.val}`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );
    const L = traverse(node.left, depth + 1);

    nodeStates[node.val] = "exploring_right";
    // compute right
    pushStep(
      executionSteps,
      "compute_right",
      node,
      `Compute right height of node ${node.val}`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );
    const R = traverse(node.right, depth + 1);

    const candidate = L + R;
    maxDiameter = Math.max(maxDiameter, candidate);
    nodeStates[node.val] = "processing";
    pushStep(
      executionSteps,
      "update_diameter",
      node,
      `Candidate ${candidate}, best diameter ${maxDiameter}`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
      maxDiameter,
    );

    nodeStates[node.val] = "completed";
    pushStep(
      executionSteps,
      "return_height",
      node,
      `Return height ${Math.max(L, R) + 1} from node ${node.val}`,
      getCallStackSnapshot(callStack, "exiting", frameId),
      nodeStates,
    );

    callStack.pop();
    return Math.max(L, R) + 1;
  }

  traverse(root, 0);

  return {
    executionSteps,
    initialNodeStates,
  };
}
