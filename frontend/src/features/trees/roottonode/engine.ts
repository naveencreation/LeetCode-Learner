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
  target: number,
  pathSnapshot: number[],
  found: boolean,
  operation: string,
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>,
): void {
  steps.push({
    type,
    node,
    value: node.val,
    target,
    pathSnapshot: [...pathSnapshot],
    found,
    operation,
    callStack,
    nodeStates: cloneNodeStates(nodeStates),
  });
}

export function generateRootToNodeExecutionSteps(
  root: TreeNode,
  target: number,
): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  const path: number[] = [];
  let found = false;
  let frameCounter = 0;

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  function traverse(node: TreeNode | null, depth: number): boolean {
    if (node === null) {
      return false;
    }

    const frameId = frameCounter++;
    callStack.push({ nodeVal: node.val, depth, id: frameId });

    nodeStates[node.val] = "current";
    pushStep(
      executionSteps,
      "enter_function",
      node,
      target,
      path,
      found,
      `Enter dfs(node=${node.val}, target=${target})`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    path.push(node.val);
    pushStep(
      executionSteps,
      "visit",
      node,
      target,
      path,
      found,
      `Add ${node.val} to current path`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    if (node.val === target) {
      found = true;
      nodeStates[node.val] = "completed";
      pushStep(
        executionSteps,
        "found_target",
        node,
        target,
        path,
        found,
        `Target ${target} found at node ${node.val}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );

      pushStep(
        executionSteps,
        "exit_function",
        node,
        target,
        path,
        found,
        `Return True from dfs(node=${node.val})`,
        getCallStackSnapshot(callStack, "exiting", frameId),
        nodeStates,
      );

      callStack.pop();
      return true;
    }

    nodeStates[node.val] = "exploring_left";

    if (node.left) {
      pushStep(
        executionSteps,
        "traverse_left",
        node,
        target,
        path,
        found,
        `Move to left child from node ${node.val}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );
      if (traverse(node.left, depth + 1)) {
        nodeStates[node.val] = "completed";
        pushStep(
          executionSteps,
          "exit_function",
          node,
          target,
          path,
          found,
          `Return True from dfs(node=${node.val})`,
          getCallStackSnapshot(callStack, "exiting", frameId),
          nodeStates,
        );
        callStack.pop();
        return true;
      }
    }

    nodeStates[node.val] = "exploring_right";

    if (node.right) {
      pushStep(
        executionSteps,
        "traverse_right",
        node,
        target,
        path,
        found,
        `Move to right child from node ${node.val}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );
      if (traverse(node.right, depth + 1)) {
        nodeStates[node.val] = "completed";
        pushStep(
          executionSteps,
          "exit_function",
          node,
          target,
          path,
          found,
          `Return True from dfs(node=${node.val})`,
          getCallStackSnapshot(callStack, "exiting", frameId),
          nodeStates,
        );
        callStack.pop();
        return true;
      }
    }

    path.pop();
    pushStep(
      executionSteps,
      "backtrack",
      node,
      target,
      path,
      found,
      `Backtrack: remove node ${node.val} from path`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    nodeStates[node.val] = "completed";
    pushStep(
      executionSteps,
      "exit_function",
      node,
      target,
      path,
      found,
      `Return False from dfs(node=${node.val})`,
      getCallStackSnapshot(callStack, "exiting", frameId),
      nodeStates,
    );

    callStack.pop();
    return false;
  }

  const isFound = traverse(root, 0);
  if (!isFound) {
    executionSteps.push({
      type: "finish",
      node: root,
      value: root.val,
      target,
      pathSnapshot: [],
      found: false,
      operation: `Target ${target} not found in tree`,
      callStack: [],
      nodeStates: cloneNodeStates(nodeStates),
    });
  }

  return {
    executionSteps,
    initialNodeStates,
  };
}
