import type {
  CallStackFrame,
  ExecutionStep,
  NodeVisualState,
  TreeNode,
} from "./types";

interface InternalFrame {
  nodeValP: number | null;
  nodeValQ: number | null;
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
    nodeValP: frame.nodeValP,
    nodeValQ: frame.nodeValQ,
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
  states: Record<string, NodeVisualState>,
  prefix: string,
): void {
  if (node === null) {
    return;
  }

  states[prefix + node.val] = "unvisited";
  initializeNodeStates(node.left, states, prefix);
  initializeNodeStates(node.right, states, prefix);
}

function pushStep(
  steps: ExecutionStep[],
  type: ExecutionStep["type"],
  nodeP: TreeNode | null,
  nodeQ: TreeNode | null,
  operation: string,
  callStack: CallStackFrame[],
  nodeStatesP: Record<string, NodeVisualState>,
  nodeStatesQ: Record<string, NodeVisualState>,
  isMatch: boolean | null,
): void {
  steps.push({
    type,
    nodeP,
    nodeQ,
    valueP: nodeP?.val,
    valueQ: nodeQ?.val,
    operation,
    callStack,
    nodeStatesP: cloneNodeStates(nodeStatesP),
    nodeStatesQ: cloneNodeStates(nodeStatesQ),
    isMatch,
  });
}

export function generateSameTreeExecutionSteps(
  rootP: TreeNode | null,
  rootQ: TreeNode | null
): {
  executionSteps: ExecutionStep[];
  initialNodeStatesP: Record<string, NodeVisualState>;
  initialNodeStatesQ: Record<string, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStatesP: Record<string, NodeVisualState> = {};
  const nodeStatesQ: Record<string, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;

  // Initialize states with prefix to distinguish between trees
  initializeNodeStates(rootP, nodeStatesP, "p_");
  initializeNodeStates(rootQ, nodeStatesQ, "q_");
  
  const initialNodeStatesP = cloneNodeStates(nodeStatesP);
  const initialNodeStatesQ = cloneNodeStates(nodeStatesQ);

  function compare(
    nodeP: TreeNode | null,
    nodeQ: TreeNode | null,
    depth: number
  ): boolean {
    const frameId = frameCounter++;
    callStack.push({ nodeValP: nodeP?.val ?? null, nodeValQ: nodeQ?.val ?? null, depth, id: frameId });

    // Mark nodes as being compared
    if (nodeP) nodeStatesP["p_" + nodeP.val] = "current";
    if (nodeQ) nodeStatesQ["q_" + nodeQ.val] = "current";

    pushStep(
      executionSteps,
      "enter_function",
      nodeP,
      nodeQ,
      `Compare: p=${nodeP?.val ?? 'null'}, q=${nodeQ?.val ?? 'null'}`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStatesP,
      nodeStatesQ,
      null,
    );

    // Both null - match
    if (nodeP === null && nodeQ === null) {
      pushStep(
        executionSteps,
        "match_found",
        nodeP,
        nodeQ,
        "Both null - match found",
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStatesP,
        nodeStatesQ,
        true,
      );
      
      callStack.pop();
      return true;
    }

    // One null, one not - mismatch
    if (nodeP === null || nodeQ === null) {
      if (nodeP) nodeStatesP["p_" + nodeP.val] = "completed";
      if (nodeQ) nodeStatesQ["q_" + nodeQ.val] = "completed";
      
      pushStep(
        executionSteps,
        "mismatch_found",
        nodeP,
        nodeQ,
        "Structure mismatch - one null, one not",
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStatesP,
        nodeStatesQ,
        false,
      );
      
      callStack.pop();
      return false;
    }

    // Values differ
    if (nodeP.val !== nodeQ.val) {
      nodeStatesP["p_" + nodeP.val] = "completed";
      nodeStatesQ["q_" + nodeQ.val] = "completed";
      
      pushStep(
        executionSteps,
        "mismatch_found",
        nodeP,
        nodeQ,
        `Value mismatch: ${nodeP.val} != ${nodeQ.val}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStatesP,
        nodeStatesQ,
        false,
      );
      
      callStack.pop();
      return false;
    }

    // Values match - mark as exploring
    nodeStatesP["p_" + nodeP.val] = "exploring_left";
    nodeStatesQ["q_" + nodeQ.val] = "exploring_left";

    pushStep(
      executionSteps,
      "compare_values",
      nodeP,
      nodeQ,
      `Values match: ${nodeP.val} == ${nodeQ.val}`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStatesP,
      nodeStatesQ,
      null,
    );

    // Recurse on left
    if (nodeP.left || nodeQ.left) {
      pushStep(
        executionSteps,
        "recurse_left",
        nodeP,
        nodeQ,
        "Compare left children",
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStatesP,
        nodeStatesQ,
        null,
      );
    }

    const leftSame = compare(nodeP.left, nodeQ.left, depth + 1);
    
    if (!leftSame) {
      nodeStatesP["p_" + nodeP.val] = "completed";
      nodeStatesQ["q_" + nodeQ.val] = "completed";
      pushStep(
        executionSteps,
        "exit_function",
        nodeP,
        nodeQ,
        "Left mismatch - returning False",
        getCallStackSnapshot(callStack, "exiting", frameId),
        nodeStatesP,
        nodeStatesQ,
        false,
      );
      callStack.pop();
      return false;
    }

    // Mark as exploring right
    nodeStatesP["p_" + nodeP.val] = "exploring_right";
    nodeStatesQ["q_" + nodeQ.val] = "exploring_right";

    // Recurse on right
    if (nodeP.right || nodeQ.right) {
      pushStep(
        executionSteps,
        "recurse_right",
        nodeP,
        nodeQ,
        "Compare right children",
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStatesP,
        nodeStatesQ,
        null,
      );
    }

    const rightSame = compare(nodeP.right, nodeQ.right, depth + 1);

    if (!rightSame) {
      nodeStatesP["p_" + nodeP.val] = "completed";
      nodeStatesQ["q_" + nodeQ.val] = "completed";
      pushStep(
        executionSteps,
        "exit_function",
        nodeP,
        nodeQ,
        "Right mismatch - returning False",
        getCallStackSnapshot(callStack, "exiting", frameId),
        nodeStatesP,
        nodeStatesQ,
        false,
      );
      callStack.pop();
      return false;
    }

    // Both match
    nodeStatesP["p_" + nodeP.val] = "completed";
    nodeStatesQ["q_" + nodeQ.val] = "completed";

    pushStep(
      executionSteps,
      "match_found",
      nodeP,
      nodeQ,
      `Subtrees match at ${nodeP.val}`,
      getCallStackSnapshot(callStack, "exiting", frameId),
      nodeStatesP,
      nodeStatesQ,
      true,
    );

    callStack.pop();
    return true;
  }

  compare(rootP, rootQ, 0);

  return {
    executionSteps,
    initialNodeStatesP,
    initialNodeStatesQ,
  };
}
