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
  leftHeight: number | null;
  rightHeight: number | null;
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
    leftHeight: frame.leftHeight,
    rightHeight: frame.rightHeight,
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

export function generateBalancedBinaryTreeExecutionSteps(
  root: TreeNode | null,
): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};

  if (root === null) {
    executionSteps.push({
      type: "enter_function",
      node: null,
      value: undefined,
      operation: "Check if empty tree is balanced",
      callStack: [],
      nodeStates: {},
      isBalanced: true,
      currentHeight: 0,
    });
    return { executionSteps, initialNodeStates: {} };
  }

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  const stack: InternalFrame[] = [];
  let frameId = 0;
  let isBalanced = true;

  function check(node: TreeNode | null, depth: number): number {
    if (node === null) {
      return 0; // Null has height 0
    }

    const currentId = frameId++;
    const frame: InternalFrame = {
      nodeVal: node.val,
      depth,
      id: currentId,
      leftHeight: null,
      rightHeight: null,
    };

    stack.push(frame);
    nodeStates[node.val] = "current";

    executionSteps.push({
      type: "enter_function",
      node,
      value: node.val,
      operation: `Entered check(${node.val})`,
      callStack: getCallStackSnapshot(stack, "executing", currentId),
      nodeStates: cloneNodeStates(nodeStates),
      isBalanced: null,
      currentHeight: null,
    });

    // Check left subtree
    let leftHeight = 0;
    if (node.left !== null) {
      nodeStates[node.val] = "exploring_left";
      executionSteps.push({
        type: "check_left",
        node,
        value: node.val,
        operation: `Checking left subtree of ${node.val}`,
        callStack: getCallStackSnapshot(stack, "executing", currentId),
        nodeStates: cloneNodeStates(nodeStates),
        isBalanced: null,
        currentHeight: null,
      });

      leftHeight = check(node.left, depth + 1);

      if (leftHeight === -1) {
        isBalanced = false;
        frame.leftHeight = -1;
        nodeStates[node.val] = "current";
        executionSteps.push({
          type: "return_unbalanced",
          node,
          value: node.val,
          operation: `Left subtree of ${node.val} is unbalanced, early exit`,
          callStack: getCallStackSnapshot(stack, "exiting", currentId),
          nodeStates: cloneNodeStates(nodeStates),
          isBalanced: false,
          currentHeight: -1,
        });

        stack.pop();
        return -1;
      }

      frame.leftHeight = leftHeight;
    }

    // Check right subtree
    let rightHeight = 0;
    if (node.right !== null) {
      nodeStates[node.val] = "exploring_right";
      executionSteps.push({
        type: "check_right",
        node,
        value: node.val,
        operation: `Checking right subtree of ${node.val}`,
        callStack: getCallStackSnapshot(stack, "executing", currentId),
        nodeStates: cloneNodeStates(nodeStates),
        isBalanced: null,
        currentHeight: null,
      });

      rightHeight = check(node.right, depth + 1);

      if (rightHeight === -1) {
        isBalanced = false;
        frame.rightHeight = -1;
        nodeStates[node.val] = "current";
        executionSteps.push({
          type: "return_unbalanced",
          node,
          value: node.val,
          operation: `Right subtree of ${node.val} is unbalanced, early exit`,
          callStack: getCallStackSnapshot(stack, "exiting", currentId),
          nodeStates: cloneNodeStates(nodeStates),
          isBalanced: false,
          currentHeight: -1,
        });

        stack.pop();
        return -1;
      }

      frame.rightHeight = rightHeight;
    }

    nodeStates[node.val] = "processing";
    executionSteps.push({
      type: "check_balance",
      node,
      value: node.val,
      operation: `Checking balance: |${leftHeight} - ${rightHeight}| = ${Math.abs(leftHeight - rightHeight)} ≤ 1?`,
      callStack: getCallStackSnapshot(stack, "executing", currentId),
      nodeStates: cloneNodeStates(nodeStates),
      isBalanced: null,
      currentHeight: null,
    });

    const heightDiff = Math.abs(leftHeight - rightHeight);
    if (heightDiff > 1) {
      isBalanced = false;
      nodeStates[node.val] = "current";
      executionSteps.push({
        type: "return_unbalanced",
        node,
        value: node.val,
        operation: `Node ${node.val} is unbalanced: height diff ${heightDiff} > 1`,
        callStack: getCallStackSnapshot(stack, "exiting", currentId),
        nodeStates: cloneNodeStates(nodeStates),
        isBalanced: false,
        currentHeight: -1,
      });

      stack.pop();
      return -1;
    }

    const height = 1 + Math.max(leftHeight, rightHeight);
    nodeStates[node.val] = "completed";

    executionSteps.push({
      type: "return_height",
      node,
      value: height,
      operation: `Node ${node.val} is balanced, return height ${height}`,
      callStack: getCallStackSnapshot(stack, "exiting", currentId),
      nodeStates: cloneNodeStates(nodeStates),
      isBalanced: true,
      currentHeight: height,
    });

    stack.pop();
    return height;
  }

  check(root, 0);

  executionSteps.push({
    type: "exit_function",
    node: root,
    value: isBalanced ? 1 : 0,
    operation: isBalanced
      ? "Tree is balanced"
      : "Tree is unbalanced",
    callStack: [],
    nodeStates: cloneNodeStates(nodeStates),
    isBalanced,
    currentHeight: null,
  });

  return { executionSteps, initialNodeStates };
}
