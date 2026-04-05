import type { CallStackFrame, ExecutionStep, NodeVisualState, TreeNode } from "./types";

interface InternalFrame {
  node: TreeNode;
  state: 1 | 2 | 3;
  depth: number;
  id: number;
}

interface TraversalCount {
  pre: number;
  in: number;
  post: number;
}

function cloneNodeStates(states: Record<number, NodeVisualState>): Record<number, NodeVisualState> {
  return { ...states };
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

function initializeTraversalCounts(
  node: TreeNode | null,
  counts: Record<number, TraversalCount>,
): void {
  if (node === null) {
    return;
  }

  counts[node.val] = { pre: 0, in: 0, post: 0 };
  initializeTraversalCounts(node.left, counts);
  initializeTraversalCounts(node.right, counts);
}

function countNodes(node: TreeNode | null): number {
  if (node === null) {
    return 0;
  }

  return 1 + countNodes(node.left) + countNodes(node.right);
}

function assertTraversalCoverage(
  counts: Record<number, TraversalCount>,
  totalNodes: number,
  preResult: number[],
  inResult: number[],
  postResult: number[],
): void {
  if (preResult.length !== totalNodes || inResult.length !== totalNodes || postResult.length !== totalNodes) {
    throw new Error(
      `Traversal length mismatch. Expected ${totalNodes} entries in each result, got Pre=${preResult.length}, In=${inResult.length}, Post=${postResult.length}.`,
    );
  }

  for (const [nodeVal, count] of Object.entries(counts)) {
    if (count.pre !== 1 || count.in !== 1 || count.post !== 1) {
      throw new Error(
        `Traversal coverage violation at node ${nodeVal}. Expected exactly one PRE/IN/POST, got PRE=${count.pre}, IN=${count.in}, POST=${count.post}.`,
      );
    }
  }
}

function getCallStackSnapshot(stack: InternalFrame[], active: InternalFrame): CallStackFrame[] {
  return [...stack, active].map((frame) => ({
    nodeVal: frame.node.val,
    depth: frame.depth,
    id: frame.id,
    state: frame.id === active.id ? "executing" : "pending",
    traversalState: frame.state,
  }));
}

function pushStep(
  steps: ExecutionStep[],
  type: ExecutionStep["type"],
  frame: InternalFrame,
  operation: string,
  stack: InternalFrame[],
  nodeStates: Record<number, NodeVisualState>,
  preResult: number[],
  inResult: number[],
  postResult: number[],
): void {
  steps.push({
    type,
    node: frame.node,
    value: frame.node.val,
    operation,
    callStack: getCallStackSnapshot(stack, frame),
    nodeStates: cloneNodeStates(nodeStates),
    preResult: [...preResult],
    inResult: [...inResult],
    postResult: [...postResult],
  });
}

export function generatePreInPostExecutionSteps(root: TreeNode): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const stack: InternalFrame[] = [];
  const traversalCounts: Record<number, TraversalCount> = {};
  const preResult: number[] = [];
  const inResult: number[] = [];
  const postResult: number[] = [];
  let frameCounter = 0;

  initializeNodeStates(root, nodeStates);
  initializeTraversalCounts(root, traversalCounts);
  const totalNodes = countNodes(root);
  const initialNodeStates = cloneNodeStates(nodeStates);

  stack.push({ node: root, state: 1, depth: 0, id: frameCounter++ });

  while (stack.length > 0) {
    const frame = stack.pop();
    if (!frame) {
      continue;
    }

    const node = frame.node;

    if (frame.state === 1) {
      preResult.push(node.val);
      traversalCounts[node.val].pre += 1;
      nodeStates[node.val] = "exploring_left";
      pushStep(
        executionSteps,
        "pre_visit",
        frame,
        `PRE: append ${node.val}`,
        stack,
        nodeStates,
        preResult,
        inResult,
        postResult,
      );

      stack.push({ node, state: 2, depth: frame.depth, id: frameCounter++ });
      pushStep(
        executionSteps,
        "schedule_in",
        frame,
        `Schedule IN stage for node ${node.val}`,
        stack,
        nodeStates,
        preResult,
        inResult,
        postResult,
      );

      if (node.left) {
        stack.push({ node: node.left, state: 1, depth: frame.depth + 1, id: frameCounter++ });
        pushStep(
          executionSteps,
          "traverse_left",
          frame,
          `Push left child ${node.left.val} from node ${node.val}`,
          stack,
          nodeStates,
          preResult,
          inResult,
          postResult,
        );
      }
    } else if (frame.state === 2) {
      inResult.push(node.val);
      traversalCounts[node.val].in += 1;
      nodeStates[node.val] = "current";
      pushStep(
        executionSteps,
        "in_visit",
        frame,
        `IN: append ${node.val}`,
        stack,
        nodeStates,
        preResult,
        inResult,
        postResult,
      );

      nodeStates[node.val] = "exploring_right";
      stack.push({ node, state: 3, depth: frame.depth, id: frameCounter++ });
      pushStep(
        executionSteps,
        "schedule_post",
        frame,
        `Schedule POST stage for node ${node.val}`,
        stack,
        nodeStates,
        preResult,
        inResult,
        postResult,
      );

      if (node.right) {
        stack.push({ node: node.right, state: 1, depth: frame.depth + 1, id: frameCounter++ });
        pushStep(
          executionSteps,
          "traverse_right",
          frame,
          `Push right child ${node.right.val} from node ${node.val}`,
          stack,
          nodeStates,
          preResult,
          inResult,
          postResult,
        );
      }
    } else {
      postResult.push(node.val);
      traversalCounts[node.val].post += 1;
      nodeStates[node.val] = "completed";
      pushStep(
        executionSteps,
        "post_visit",
        frame,
        `POST: append ${node.val}`,
        stack,
        nodeStates,
        preResult,
        inResult,
        postResult,
      );
    }
  }

  assertTraversalCoverage(traversalCounts, totalNodes, preResult, inResult, postResult);

  return {
    executionSteps,
    initialNodeStates,
  };
}
