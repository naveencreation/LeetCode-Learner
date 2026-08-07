import type {
  TreeNode,
  BalancedTreeExecutionStep,
  BalancedTreeOperationType,
  BalancedTreeCallStackFrame,
  NodeVisualState,
} from "./types";

interface EngineContext {
  steps: BalancedTreeExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
  callStack: BalancedTreeCallStackFrame[];
  isBalanced: boolean;
}

function pushStep(
  ctx: EngineContext,
  type: BalancedTreeOperationType,
  lineNumber: number,
  node: TreeNode | null,
  explanation: string,
  extra: Partial<BalancedTreeExecutionStep> = {}
) {
  if (node) {
    if (type === "unbalanced") {
      ctx.nodeStates[node.val] = "current"; // Using "current" to indicate problem node
    } else if (type === "exit_function" || type === "calculate_height") {
      ctx.nodeStates[node.val] = "completed";
    } else if (type === "enter_function" || type.startsWith("recurse")) {
      ctx.nodeStates[node.val] = "exploring_left";
    } else {
      ctx.nodeStates[node.val] = "processing";
    }
  }

  ctx.steps.push({
    type,
    lineNumber,
    callStack: [...ctx.callStack],
    nodeStates: { ...ctx.nodeStates },
    currentNode: node,
    explanation,
    isBalanced: ctx.isBalanced,
    ...extra,
  });
}

function checkBalanced(
  node: TreeNode | null,
  ctx: EngineContext
): number {
  // Line 8-9: Check null
  pushStep(
    ctx,
    "enter_function",
    7,
    node,
    node ? `Entering check for node ${node.val}` : "Entering check for null node"
  );

  if (!node) {
    pushStep(
      ctx,
      "check_null",
      9,
      node,
      "Null node found, returning height 0"
    );
    return 0;
  }

  pushStep(
    ctx,
    "check_null",
    9,
    node,
    `Node ${node.val} is not null, continuing...`
  );

  // Push frame for current node
  const frame: BalancedTreeCallStackFrame = {
    functionName: "check",
    nodeValue: node.val,
    phase: "start",
  };
  ctx.callStack.push(frame);

  // Line 12: Recurse left
  pushStep(
    ctx,
    "recurse_left",
    12,
    node,
    `Recursively checking left subtree of node ${node.val}`,
    { leftHeight: undefined, rightHeight: undefined }
  );

  frame.phase = "recursing_left";
  const leftHeight = checkBalanced(node.left, ctx);

  // Line 13: Check left sentinel
  pushStep(
    ctx,
    "check_left_sentinel",
    13,
    node,
    leftHeight === -1
      ? `Left subtree of ${node.val} is unbalanced!`
      : `Left subtree of ${node.val} has height ${leftHeight}`,
    { leftHeight }
  );

  if (leftHeight === -1) {
    frame.phase = "done";
    ctx.callStack.pop();
    return -1;
  }

  // Line 16: Recurse right
  pushStep(
    ctx,
    "recurse_right",
    16,
    node,
    `Recursively checking right subtree of node ${node.val}`,
    { leftHeight }
  );

  frame.phase = "recursing_right";
  const rightHeight = checkBalanced(node.right, ctx);

  // Line 17: Check right sentinel
  pushStep(
    ctx,
    "check_right_sentinel",
    17,
    node,
    rightHeight === -1
      ? `Right subtree of ${node.val} is unbalanced!`
      : `Right subtree of ${node.val} has height ${rightHeight}`,
    { leftHeight, rightHeight }
  );

  if (rightHeight === -1) {
    frame.phase = "done";
    ctx.callStack.pop();
    return -1;
  }

  // Line 19: Compare heights
  pushStep(
    ctx,
    "compare_heights",
    19,
    node,
    `Comparing heights at node ${node.val}: |${leftHeight} - ${rightHeight}| = ${Math.abs(leftHeight - rightHeight)}`,
    { leftHeight, rightHeight }
  );

  // Check if unbalanced
  if (Math.abs(leftHeight - rightHeight) > 1) {
    pushStep(
      ctx,
      "unbalanced",
      20,
      node,
      `Node ${node.val} is UNBALANCED! Height difference > 1`,
      { leftHeight, rightHeight, currentHeight: -1 }
    );
    ctx.isBalanced = false;
    frame.phase = "done";
    ctx.callStack.pop();
    return -1;
  }

  // Line 22: Calculate and return height
  const height = 1 + Math.max(leftHeight, rightHeight);
  pushStep(
    ctx,
    "calculate_height",
    22,
    node,
    `Node ${node.val} is balanced. Returning height ${height}`,
    { leftHeight, rightHeight, currentHeight: height }
  );

  frame.currentHeight = height;
  frame.phase = "done";
  ctx.callStack.pop();
  return height;
}

export function generateBalancedTreeSteps(root: TreeNode | null): {
  executionSteps: BalancedTreeExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const ctx: EngineContext = {
    steps: [],
    nodeStates: {},
    callStack: [],
    isBalanced: true,
  };

  // Initialize all nodes as unvisited
  function initNodeStates(node: TreeNode | null) {
    if (!node) return;
    ctx.nodeStates[node.val] = "unvisited";
    initNodeStates(node.left);
    initNodeStates(node.right);
  }
  initNodeStates(root);
  const initialNodeStates = { ...ctx.nodeStates };

  // Entry step
  pushStep(
    ctx,
    "enter_function",
    6,
    root,
    root ? "Starting isBalanced check..." : "Checking empty tree"
  );

  if (!root) {
    pushStep(
      ctx,
      "exit_function",
      24,
      null,
      "Empty tree is balanced by definition",
      { isBalanced: true }
    );
    return { executionSteps: ctx.steps, initialNodeStates };
  }

  // Call the recursive check
  const result = checkBalanced(root, ctx);
  const balanced = result !== -1;

  // Final step
  pushStep(
    ctx,
    "exit_function",
    24,
    root,
    balanced
      ? "Tree is BALANCED! All nodes satisfy height condition."
      : "Tree is UNBALANCED! At least one node violated the condition.",
    { isBalanced: balanced, currentHeight: result }
  );

  pushStep(
    ctx,
    "complete",
    25,
    null,
    "Algorithm complete.",
    { isBalanced: balanced }
  );

  return { executionSteps: ctx.steps, initialNodeStates };
}
