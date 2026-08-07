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
  level: number,
  operation: string,
  callStack: CallStackFrame[],
  nodeStates: Record<number, NodeVisualState>,
  metadata?: {
    width?: number;
    maxWidth?: number;
    levelStartIndex?: number;
    levelEndIndex?: number;
    levelNodes?: number[];
  },
): void {
  steps.push({
    type,
    node,
    value: node?.val,
    level,
    width: metadata?.width,
    maxWidth: metadata?.maxWidth,
    levelStartIndex: metadata?.levelStartIndex,
    levelEndIndex: metadata?.levelEndIndex,
    levelNodes: metadata?.levelNodes,
    operation,
    callStack,
    nodeStates: cloneNodeStates(nodeStates),
  });
}

export function generateLevelOrderExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const callStack: InternalFrame[] = [];
  let frameCounter = 0;
  let maxLevelSize = 0;

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  if (!root) {
    executionSteps.push({
      type: "finish",
      node: null,
      value: undefined,
      level: 0,
      width: 0,
      maxWidth: 0,
      operation: "Tree is empty; level order is []",
      callStack: [],
      nodeStates: cloneNodeStates(nodeStates),
    });

    return { executionSteps, initialNodeStates };
  }

  const queue: Array<{ node: TreeNode; level: number }> = [{ node: root, level: 0 }];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level = queue[0].level;
    const levelValues: number[] = [];
    maxLevelSize = Math.max(maxLevelSize, levelSize);

    pushStep(
      executionSteps,
      "level_start",
      queue[0].node,
      level,
      `Start level ${level} with ${levelSize} node(s) in queue`,
      [],
      nodeStates,
      {
        width: levelSize,
        maxWidth: maxLevelSize,
      },
    );

    for (let processed = 0; processed < levelSize; processed += 1) {
      const current = queue.shift() as { node: TreeNode; level: number };
      const { node } = current;
      const frameId = frameCounter++;

      callStack.push({ nodeVal: node.val, depth: level, id: frameId });
      nodeStates[node.val] = "current";

      pushStep(
        executionSteps,
        "enter_function",
        node,
        level,
        `Pop node ${node.val} from queue`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        {
          width: levelSize,
          maxWidth: maxLevelSize,
        },
      );

      levelValues.push(node.val);
      pushStep(
        executionSteps,
        "visit",
        node,
        level,
        `Append ${node.val} to current level list`,
        getCallStackSnapshot(callStack, "executing", frameId),
        nodeStates,
        {
          width: levelSize,
          maxWidth: maxLevelSize,
        },
      );

      if (node.left) {
        nodeStates[node.val] = "exploring_left";
        pushStep(
          executionSteps,
          "traverse_left",
          node,
          level,
          `Queue left child ${node.left.val}`,
          getCallStackSnapshot(callStack, "executing", frameId),
          nodeStates,
          {
            width: levelSize,
            maxWidth: maxLevelSize,
          },
        );
        queue.push({ node: node.left, level: level + 1 });
      }

      if (node.right) {
        nodeStates[node.val] = "exploring_right";
        pushStep(
          executionSteps,
          "traverse_right",
          node,
          level,
          `Queue right child ${node.right.val}`,
          getCallStackSnapshot(callStack, "executing", frameId),
          nodeStates,
          {
            width: levelSize,
            maxWidth: maxLevelSize,
          },
        );
        queue.push({ node: node.right, level: level + 1 });
      }

      nodeStates[node.val] = "completed";
      pushStep(
        executionSteps,
        "exit_function",
        node,
        level,
        `Done with node ${node.val}`,
        getCallStackSnapshot(callStack, "exiting", frameId),
        nodeStates,
        {
          width: levelSize,
          maxWidth: maxLevelSize,
        },
      );

      callStack.pop();
    }

    pushStep(
      executionSteps,
      "level_end",
      root,
      level,
      `Level ${level} complete -> [${levelValues.join(", ")}]`,
      [],
      nodeStates,
      {
        width: levelSize,
        maxWidth: maxLevelSize,
        levelNodes: [...levelValues],
      },
    );
  }

  executionSteps.push({
    type: "finish",
    node: root,
    value: root.val,
    level: 0,
    width: maxLevelSize,
    maxWidth: maxLevelSize,
    operation: "Traversal complete. Level order built successfully.",
    callStack: [],
    nodeStates: cloneNodeStates(nodeStates),
  });

  return { executionSteps, initialNodeStates };
}
