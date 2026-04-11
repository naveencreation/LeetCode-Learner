import type {
  CallStackFrame,
  ExecutionStep,
  NodeVisualState,
  TreeNode,
} from "./types";

interface InternalFrame {
  leftVal: number | null;
  rightVal: number | null;
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
    leftVal: frame.leftVal,
    rightVal: frame.rightVal,
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
  leftNode: TreeNode | null,
  rightNode: TreeNode | null,
  operation: string,
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>,
  isMatch: boolean | null,
): void {
  steps.push({
    type,
    leftNode,
    rightNode,
    valueLeft: leftNode?.val,
    valueRight: rightNode?.val,
    operation,
    callStack,
    nodeStates: cloneNodeStates(nodeStates),
    isMatch,
  });
}

export function generateSymmetricTreeExecutionSteps(
  root: TreeNode | null,
): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  // Entry step for isSymmetric
  if (root) {
    nodeStates[root.val] = "current";
    pushStep(
      executionSteps,
      "enter_function",
      root,
      root,
      "Check if tree is symmetric",
      [],
      nodeStates,
      null,
    );
    nodeStates[root.val] = "completed";
  }

  if (!root) {
    pushStep(
      executionSteps,
      "match_found",
      null,
      null,
      "Empty tree is symmetric",
      [],
      nodeStates,
      true,
    );
    return { executionSteps, initialNodeStates };
  }

  function isMirror(
    left: TreeNode | null,
    right: TreeNode | null,
    depth: number,
  ): boolean {
    const frameId = frameCounter++;
    callStack.push({ leftVal: left?.val ?? null, rightVal: right?.val ?? null, depth, id: frameId });

    // Mark nodes as being compared
    if (left) nodeStates[left.val] = "current";
    if (right) nodeStates[right.val] = "current";

    pushStep(
      executionSteps,
      "check_mirror",
      left,
      right,
      `Compare: left=${left?.val ?? 'null'}, right=${right?.val ?? 'null'}`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
      null,
    );

    // Both null - symmetric
    if (left === null && right === null) {
      pushStep(
        executionSteps,
        "match_found",
        left,
        right,
        "Both null - symmetric at this position",
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        true,
      );
      callStack.pop();
      return true;
    }

    // One null, one not - asymmetric
    if (left === null || right === null) {
      if (left) nodeStates[left.val] = "completed";
      if (right) nodeStates[right.val] = "completed";
      
      pushStep(
        executionSteps,
        "mismatch_found",
        left,
        right,
        "Structure mismatch - asymmetric",
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        false,
      );
      callStack.pop();
      return false;
    }

    // Values differ
    if (left.val !== right.val) {
      nodeStates[left.val] = "completed";
      nodeStates[right.val] = "completed";
      
      pushStep(
        executionSteps,
        "mismatch_found",
        left,
        right,
        `Value mismatch: ${left.val} != ${right.val}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        false,
      );
      callStack.pop();
      return false;
    }

    // Values match - mark as exploring
    nodeStates[left.val] = "exploring_left";
    nodeStates[right.val] = "exploring_left";

    pushStep(
      executionSteps,
      "compare_values",
      left,
      right,
      `Values match: ${left.val} == ${right.val}`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
      null,
    );

    // Check outer pair: left.left vs right.right
    if (left.left || right.right) {
      pushStep(
        executionSteps,
        "recurse_outer",
        left,
        right,
        "Check outer pair (left.left vs right.right)",
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        null,
      );
    }

    const outerMatch = isMirror(left.left, right.right, depth + 1);
    
    if (!outerMatch) {
      nodeStates[left.val] = "completed";
      nodeStates[right.val] = "completed";
      pushStep(
        executionSteps,
        "exit_function",
        left,
        right,
        "Outer check failed - asymmetric",
        getCallStackSnapshot(callStack, "exiting", frameId),
        nodeStates,
        false,
      );
      callStack.pop();
      return false;
    }

    // Mark as exploring inner
    nodeStates[left.val] = "exploring_right";
    nodeStates[right.val] = "exploring_right";

    // Check inner pair: left.right vs right.left
    if (left.right || right.left) {
      pushStep(
        executionSteps,
        "recurse_inner",
        left,
        right,
        "Check inner pair (left.right vs right.left)",
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        null,
      );
    }

    const innerMatch = isMirror(left.right, right.left, depth + 1);

    if (!innerMatch) {
      nodeStates[left.val] = "completed";
      nodeStates[right.val] = "completed";
      pushStep(
        executionSteps,
        "exit_function",
        left,
        right,
        "Inner check failed - asymmetric",
        getCallStackSnapshot(callStack, "exiting", frameId),
        nodeStates,
        false,
      );
      callStack.pop();
      return false;
    }

    // Both match
    nodeStates[left.val] = "completed";
    nodeStates[right.val] = "completed";

    pushStep(
      executionSteps,
      "match_found",
      left,
      right,
      `Subtrees mirror at ${left.val}`,
      getCallStackSnapshot(callStack, "exiting", frameId),
      nodeStates,
      true,
    );

    callStack.pop();
    return true;
  }

  const result = isMirror(root.left, root.right, 0);

  // Final result step
  pushStep(
    executionSteps,
    result ? "match_found" : "mismatch_found",
    root,
    root,
    result ? "Tree is symmetric!" : "Tree is not symmetric",
    [],
    nodeStates,
    result,
  );

  return {
    executionSteps,
    initialNodeStates,
  };
}
