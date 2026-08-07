import type {
  BoundaryPhase,
  CallStackFrame,
  ExecutionStep,
  NodeVisualState,
  TreeNode,
} from "./types";

interface InternalFrame {
  nodeVal: number | null;
  phase: BoundaryPhase;
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
    phase: frame.phase,
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

function isLeaf(node: TreeNode | null): boolean {
  return node !== null && node.left === null && node.right === null;
}

function pushStep(
  steps: ExecutionStep[],
  type: ExecutionStep["type"],
  node: TreeNode | null,
  operation: string,
  phase: BoundaryPhase,
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>,
  boundaryResult: number[],
): void {
  steps.push({
    type,
    node,
    value: node?.val,
    operation,
    phase,
    callStack,
    nodeStates: cloneNodeStates(nodeStates),
    boundaryResult: [...boundaryResult],
    isLeaf: isLeaf(node),
  });
}

export function generateBoundaryTreeExecutionSteps(
  root: TreeNode | null,
): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  const boundaryResult: number[] = [];
  let frameCounter = 0;

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  if (!root) {
    pushStep(
      executionSteps,
      "exit_function",
      null,
      "Empty tree - no boundary",
      "complete",
      [],
      nodeStates,
      boundaryResult,
    );
    return { executionSteps, initialNodeStates };
  }

  // Entry step
  pushStep(
    executionSteps,
    "enter_function",
    root,
    "Start boundary traversal",
    "left",
    [],
    nodeStates,
    boundaryResult,
  );

  // Add root if not leaf
  if (!isLeaf(root)) {
    nodeStates[root.val] = "current";
    boundaryResult.push(root.val);
    pushStep(
      executionSteps,
      "add_root",
      root,
      `Add root ${root.val} to boundary`,
      "left",
      [],
      nodeStates,
      boundaryResult,
    );
    nodeStates[root.val] = "completed";
  }

  // Collect left boundary (top-down, excluding leaves)
  let current = root.left;
  while (current) {
    const frameId = frameCounter++;
    callStack.push({ nodeVal: current.val, phase: "left", depth: frameCounter, id: frameId });

    if (!isLeaf(current)) {
      nodeStates[current.val] = "current";
      boundaryResult.push(current.val);
      pushStep(
        executionSteps,
        "visit_left_node",
        current,
        `Add left boundary node ${current.val}`,
        "left",
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        boundaryResult,
      );
      nodeStates[current.val] = "completed";
    }

    callStack.pop();
    current = current.left ? current.left : current.right;
  }

  pushStep(
    executionSteps,
    "collect_leaves",
    root,
    "Start collecting leaves",
    "leaves",
    [],
    nodeStates,
    boundaryResult,
  );

  // Collect leaves (DFS, left-to-right)
  function collectLeaves(node: TreeNode | null): void {
    if (!node) return;

    if (isLeaf(node)) {
      const frameId = frameCounter++;
      callStack.push({ nodeVal: node.val, phase: "leaves", depth: frameCounter, id: frameId });

      nodeStates[node.val] = "current";
      boundaryResult.push(node.val);
      pushStep(
        executionSteps,
        "visit_leaf",
        node,
        `Add leaf ${node.val}`,
        "leaves",
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        boundaryResult,
      );
      nodeStates[node.val] = "completed";

      callStack.pop();
      return;
    }

    collectLeaves(node.left);
    collectLeaves(node.right);
  }

  collectLeaves(root);

  pushStep(
    executionSteps,
    "collect_right_boundary",
    root,
    "Start collecting right boundary",
    "right",
    [],
    nodeStates,
    boundaryResult,
  );

  // Collect right boundary (bottom-up using stack)
  const rightStack: number[] = [];
  current = root.right;
  while (current) {
    const frameId = frameCounter++;
    callStack.push({ nodeVal: current.val, phase: "right", depth: frameCounter, id: frameId });

    if (!isLeaf(current)) {
      nodeStates[current.val] = "exploring_right";
      rightStack.push(current.val);
      pushStep(
        executionSteps,
        "visit_right_node",
        current,
        `Stack right boundary node ${current.val}`,
        "right",
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        boundaryResult,
      );
      nodeStates[current.val] = "completed";
    }

    callStack.pop();
    current = current.right ? current.right : current.left;
  }

  // Reverse and add right boundary
  while (rightStack.length > 0) {
    const val = rightStack.pop()!;
    boundaryResult.push(val);
    pushStep(
      executionSteps,
      "reverse_right",
      null,
      `Pop and add ${val} (bottom-up)`,
      "right",
      [],
      nodeStates,
      boundaryResult,
    );
  }

  // Complete
  pushStep(
    executionSteps,
    "complete",
    root,
    `Boundary complete: [${boundaryResult.join(", ")}]`,
    "complete",
    [],
    nodeStates,
    boundaryResult,
  );

  return {
    executionSteps,
    initialNodeStates,
  };
}
