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

export function generateLeftViewExecutionSteps(root: TreeNode): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  const queue: TreeNode[] = [root];
  let level = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    const leftmost = queue[0];
    const frameId = frameCounter++;

    callStack.push({ nodeVal: leftmost.val, depth: level, id: frameId });
    nodeStates[leftmost.val] = "current";

    pushStep(
      executionSteps,
      "enter_function",
      leftmost,
      `Enter level ${level} (leftmost=${leftmost.val})`,
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    for (let index = 0; index < levelSize; index += 1) {
      const node = queue.shift() as TreeNode;

      if (index === 0) {
        nodeStates[node.val] = "current";
        pushStep(
          executionSteps,
          "visit",
          node,
          `Add node ${node.val} to left view`,
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
          `Queue left child ${node.left.val} from node ${node.val}`,
          getCallStackSnapshot(callStack, "executing", frameId),
          nodeStates,
        );
        queue.push(node.left);
      }

      if (node.right) {
        nodeStates[node.val] = "exploring_right";
        pushStep(
          executionSteps,
          "traverse_right",
          node,
          `Queue right child ${node.right.val} from node ${node.val}`,
          getCallStackSnapshot(callStack, "executing", frameId),
          nodeStates,
        );
        queue.push(node.right);
      }

      nodeStates[node.val] = "completed";
    }

    pushStep(
      executionSteps,
      "exit_function",
      leftmost,
      `Complete level ${level}`,
      getCallStackSnapshot(callStack, "exiting", frameId),
      nodeStates,
    );

    callStack.pop();
    level += 1;
  }

  return {
    executionSteps,
    initialNodeStates,
  };
}
