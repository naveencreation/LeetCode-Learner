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
  operation: string,
  level: number,
  indexInLevel: number,
  queueBefore: number[],
  queueAfter: number[],
  extras: Pick<ExecutionStep, "dequeued" | "enqueued" | "captured">,
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>,
): void {
  steps.push({
    type,
    node,
    value: node?.val,
    operation,
    level,
    indexInLevel,
    queueBefore,
    queueAfter,
    dequeued: extras.dequeued,
    enqueued: extras.enqueued,
    captured: extras.captured,
    callStack,
    nodeStates: cloneNodeStates(nodeStates),
  });
}

function queueValues(queue: TreeNode[]): number[] {
  return queue.map((item) => item.val);
}

export function generateLeftViewExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  if (root === null) {
    pushStep(
      executionSteps,
      "finish",
      null,
      "Tree is empty; left view is []",
      0,
      0,
      [],
      [],
      {},
      [],
      nodeStates,
    );

    return {
      executionSteps,
      initialNodeStates,
    };
  }

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
      "start_level",
      leftmost,
      `Enter level ${level} (leftmost=${leftmost.val})`,
      level,
      0,
      queueValues(queue),
      queueValues(queue),
      {},
      getCallStackSnapshot(callStack, "executing", frameId),
      nodeStates,
    );

    for (let index = 0; index < levelSize; index += 1) {
      const queueBeforeDequeue = queueValues(queue);
      const node = queue.shift() as TreeNode;
      const queueAfterDequeue = queueValues(queue);

      pushStep(
        executionSteps,
        "dequeue",
        node,
        `Dequeue node ${node.val} from level ${level}`,
        level,
        index,
        queueBeforeDequeue,
        queueAfterDequeue,
        { dequeued: node.val },
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );

      if (index === 0) {
        nodeStates[node.val] = "current";
        pushStep(
          executionSteps,
          "capture_left_view",
          node,
          `Add node ${node.val} to left view`,
          level,
          index,
          queueAfterDequeue,
          queueAfterDequeue,
          { captured: true },
          getCallStackSnapshot(callStack, "executing", frameId),
          nodeStates,
        );
      }

      if (node.left) {
        nodeStates[node.val] = "exploring_left";
        const queueBeforeEnqueue = queueValues(queue);
        queue.push(node.left);
        const queueAfterEnqueue = queueValues(queue);
        pushStep(
          executionSteps,
          "enqueue_left",
          node,
          `Queue left child ${node.left.val} from node ${node.val}`,
          level,
          index,
          queueBeforeEnqueue,
          queueAfterEnqueue,
          { enqueued: [node.left.val] },
          getCallStackSnapshot(callStack, "executing", frameId),
          nodeStates,
        );
      }

      if (node.right) {
        nodeStates[node.val] = "exploring_right";
        const queueBeforeEnqueue = queueValues(queue);
        queue.push(node.right);
        const queueAfterEnqueue = queueValues(queue);
        pushStep(
          executionSteps,
          "enqueue_right",
          node,
          `Queue right child ${node.right.val} from node ${node.val}`,
          level,
          index,
          queueBeforeEnqueue,
          queueAfterEnqueue,
          { enqueued: [node.right.val] },
          getCallStackSnapshot(callStack, "executing", frameId),
          nodeStates,
        );
      }

      nodeStates[node.val] = "completed";
    }

    pushStep(
      executionSteps,
      "end_level",
      leftmost,
      `Complete level ${level}`,
      level,
      levelSize - 1,
      queueValues(queue),
      queueValues(queue),
      {},
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
