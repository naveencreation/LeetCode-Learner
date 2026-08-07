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
  index: number,
  level: number,
  operation: string,
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>,
  metadata?: {
    levelStartIndex?: number;
    levelEndIndex?: number;
    width?: number;
    maxWidth?: number;
  },
): void {
  steps.push({
    type,
    node,
    value: node?.val,
    index,
    level,
    levelStartIndex: metadata?.levelStartIndex,
    levelEndIndex: metadata?.levelEndIndex,
    width: metadata?.width,
    maxWidth: metadata?.maxWidth,
    operation,
    callStack,
    nodeStates: cloneNodeStates(nodeStates),
  });
}

export function generateMaxWidthExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  if (!root) {
    executionSteps.push({
      type: "finish",
      node: null,
      value: undefined,
      index: 0,
      level: 0,
      width: 0,
      maxWidth: 0,
      operation: "Tree is empty; maximum width is 0",
      callStack: [],
      nodeStates: cloneNodeStates(nodeStates),
    });

    return {
      executionSteps,
      initialNodeStates,
    };
  }

  const queue: Array<{ node: TreeNode; index: number; level: number }> = [
    { node: root, index: 0, level: 0 },
  ];
  let maxWidth = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    const levelStartIndex = queue[0].index;
    const levelEndIndex = queue[levelSize - 1].index;
    const level = queue[0].level;
    const currentWidth = levelEndIndex - levelStartIndex + 1;
    maxWidth = Math.max(maxWidth, currentWidth);

    pushStep(
      executionSteps,
      "level_start",
      queue[0].node,
      levelStartIndex,
      level,
      `Level ${level}: index span ${levelStartIndex} to ${levelEndIndex}`,
      [],
      nodeStates,
      {
        levelStartIndex,
        levelEndIndex,
        width: currentWidth,
        maxWidth,
      },
    );

    for (let processed = 0; processed < levelSize; processed += 1) {
      const current = queue.shift() as { node: TreeNode; index: number; level: number };
      const { node, index } = current;
      const normalizedIndex = index - levelStartIndex;
      const frameId = frameCounter++;

      callStack.push({ nodeVal: node.val, depth: level, id: frameId });
      nodeStates[node.val] = "current";

      pushStep(
        executionSteps,
        "enter_function",
        node,
        normalizedIndex,
        level,
        `Pop node ${node.val} at normalized index ${normalizedIndex}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        {
          levelStartIndex,
          levelEndIndex,
          width: currentWidth,
          maxWidth,
        },
      );

      pushStep(
        executionSteps,
        "visit",
        node,
        normalizedIndex,
        level,
        `Width at level ${level} is ${currentWidth}; max width so far is ${maxWidth}`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        {
          levelStartIndex,
          levelEndIndex,
          width: currentWidth,
          maxWidth,
        },
      );

      if (node.left) {
        nodeStates[node.val] = "exploring_left";
        pushStep(
          executionSteps,
          "traverse_left",
          node,
          normalizedIndex,
          level,
          `Queue left child ${node.left.val} with index ${2 * normalizedIndex + 1}`,
          getCallStackSnapshot(callStack, "executing", frameId),
          nodeStates,
          {
            levelStartIndex,
            levelEndIndex,
            width: currentWidth,
            maxWidth,
          },
        );
        queue.push({ node: node.left, index: 2 * normalizedIndex + 1, level: level + 1 });
      }

      if (node.right) {
        nodeStates[node.val] = "exploring_right";
        pushStep(
          executionSteps,
          "traverse_right",
          node,
          normalizedIndex,
          level,
          `Queue right child ${node.right.val} with index ${2 * normalizedIndex + 2}`,
          getCallStackSnapshot(callStack, "executing", frameId),
          nodeStates,
          {
            levelStartIndex,
            levelEndIndex,
            width: currentWidth,
            maxWidth,
          },
        );
        queue.push({ node: node.right, index: 2 * normalizedIndex + 2, level: level + 1 });
      }

      nodeStates[node.val] = "completed";
      pushStep(
        executionSteps,
        "exit_function",
        node,
        normalizedIndex,
        level,
        `Done processing node ${node.val}`,
        getCallStackSnapshot(callStack, "exiting", frameId),
        nodeStates,
        {
          levelStartIndex,
          levelEndIndex,
          width: currentWidth,
          maxWidth,
        },
      );

      callStack.pop();
    }

    pushStep(
      executionSteps,
      "level_end",
      queue[0]?.node ?? root,
      levelEndIndex,
      level,
      `Level ${level} complete. Width = ${currentWidth}, max width = ${maxWidth}`,
      [],
      nodeStates,
      {
        levelStartIndex,
        levelEndIndex,
        width: currentWidth,
        maxWidth,
      },
    );
  }

  executionSteps.push({
    type: "finish",
    node: root,
    value: root.val,
    index: 0,
    level: 0,
    width: maxWidth,
    maxWidth,
    operation: `Traversal complete. Maximum width is ${maxWidth}`,
    callStack: [],
    nodeStates: cloneNodeStates(nodeStates),
  });

  return {
    executionSteps,
    initialNodeStates,
  };
}
