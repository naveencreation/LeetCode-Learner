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
  if (stage === "exiting") {
    return stack
      .filter((frame) => frame.id !== activeId)
      .map((frame, idx, arr) => ({
        nodeVal: frame.nodeVal,
        depth: frame.depth,
        id: frame.id,
        state: idx === arr.length - 1 ? "executing" : "pending",
      }));
  }

  return stack.map((frame) => ({
    nodeVal: frame.nodeVal,
    depth: frame.depth,
    id: frame.id,
    state: frame.id === activeId ? "executing" : "pending",
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


export function generateInorderExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;

  if (root === null) {
    return { executionSteps, initialNodeStates: nodeStates };
  }

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  function traverse(node: TreeNode | null, depth: number, parentNode?: TreeNode, direction?: "left" | "right"): void {
    // When inorder(None) is called — base case fires immediately and returns.
    // The traverse_left / traverse_right step already describes this; no extra
    // standalone base_case step is emitted (it was redundant without a visual).
    if (node === null) {
      return;
    }

    const frameId = frameCounter++;
    callStack.push({ nodeVal: node.val, depth, id: frameId });

    // Mark node as ENTERING (distinct warm color) while the enter_function frame is pushed
    nodeStates[node.val] = "entering";
    pushStep(
      executionSteps,
      "enter_function",
      node,
      `Enter: inorder(node=${node.val})`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    // Transition to exploring_left BEFORE emitting traverse_left
    nodeStates[node.val] = "exploring_left";
    pushStep(
      executionSteps,
      "traverse_left",
      node,
      node.left
        ? `Call inorder(node.left=${node.left.val})  ← go left`
        : `Call inorder(node.left=None) → base case`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );
    traverse(node.left, depth + 1, node, "left");

    nodeStates[node.val] = "current";
    pushStep(
      executionSteps,
      "visit",
      node,
      `Process node ${node.val} → append ${node.val} to result`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    nodeStates[node.val] = "exploring_right";

    // ── Fix #1: Always emit traverse_right step (even when right child is null) ──
    pushStep(
      executionSteps,
      "traverse_right",
      node,
      node.right
        ? `Call inorder(node.right=${node.right.val})  ← go right`
        : `Call inorder(node.right=None) → base case`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );
    traverse(node.right, depth + 1, node, "right");

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

  return {
    executionSteps,
    initialNodeStates,
  };
}
