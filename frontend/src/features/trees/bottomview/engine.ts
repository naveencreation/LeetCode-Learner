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
  hd: number,
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
    hd,
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

function queueValues(queue: Array<{ node: TreeNode; hd: number }>): number[] {
  return queue.map((item) => item.node.val);
}

export function generateBottomViewExecutionSteps(root: TreeNode | null): {
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
      0,
      "Tree is empty; bottom view is []",
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

  const queue: Array<{ node: TreeNode; hd: number }> = [{ node: root, hd: 0 }];
  let level = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    const levelStart = queue[0].node;
    const frameId = frameCounter++;

    callStack.push({ nodeVal: levelStart.val, depth: level, id: frameId });
    nodeStates[levelStart.val] = "current";

    pushStep(
      executionSteps,
      "start_level",
      levelStart,
      queue[0].hd,
      `Enter level ${level}`,
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
      const { node, hd } = queue.shift() as { node: TreeNode; hd: number };
      const queueAfterDequeue = queueValues(queue);

      pushStep(
        executionSteps,
        "dequeue",
        node,
        hd,
        `Dequeue node ${node.val} at hd ${hd}`,
        level,
        index,
        queueBeforeDequeue,
        queueAfterDequeue,
        { dequeued: node.val },
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );

      nodeStates[node.val] = "current";
      pushStep(
        executionSteps,
        "capture_bottom_view",
        node,
        hd,
        `Set bottom candidate at hd ${hd} to node ${node.val}`,
        level,
        index,
        queueAfterDequeue,
        queueAfterDequeue,
        { captured: true },
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
      );

      if (node.left) {
        nodeStates[node.val] = "exploring_left";
        const queueBeforeEnqueue = queueValues(queue);
        queue.push({ node: node.left, hd: hd - 1 });
        const queueAfterEnqueue = queueValues(queue);
        pushStep(
          executionSteps,
          "enqueue_left",
          node,
          hd,
          `Queue left child ${node.left.val} with hd ${hd - 1}`,
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
        queue.push({ node: node.right, hd: hd + 1 });
        const queueAfterEnqueue = queueValues(queue);
        pushStep(
          executionSteps,
          "enqueue_right",
          node,
          hd,
          `Queue right child ${node.right.val} with hd ${hd + 1}`,
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
      levelStart,
      queue[0]?.hd ?? 0,
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
