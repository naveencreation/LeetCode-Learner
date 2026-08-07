import type { NodeVisualState, TreeNode } from "../shared/types";
import type { ExecutionStep, Lc106CallStackFrame } from "./types";

function findNodeByValue(node: TreeNode | null, value: number): TreeNode | null {
  if (!node) {
    return null;
  }
  if (node.val === value) {
    return node;
  }

  return findNodeByValue(node.left, value) ?? findNodeByValue(node.right, value);
}

function collectInorder(node: TreeNode | null, output: number[]): void {
  if (!node) {
    return;
  }
  collectInorder(node.left, output);
  output.push(node.val);
  collectInorder(node.right, output);
}

function collectPostorder(node: TreeNode | null, output: number[]): void {
  if (!node) {
    return;
  }
  collectPostorder(node.left, output);
  collectPostorder(node.right, output);
  output.push(node.val);
}

function buildInitialNodeStates(values: number[]): Record<number, NodeVisualState> {
  return values.reduce<Record<number, NodeVisualState>>((acc, value) => {
    acc[value] = "unvisited";
    return acc;
  }, {});
}

export function deriveTraversals(root: TreeNode | null): { inorder: number[]; postorder: number[] } {
  const inorder: number[] = [];
  const postorder: number[] = [];

  collectInorder(root, inorder);
  collectPostorder(root, postorder);

  return { inorder, postorder };
}

export function generateLc106ExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const { inorder, postorder } = deriveTraversals(root);
  const executionSteps: ExecutionStep[] = [];
  const initialNodeStates = buildInitialNodeStates(inorder);

  if (postorder.length === 0 || inorder.length === 0) {
    return { executionSteps, initialNodeStates };
  }

  const inorderIndex = new Map<number, number>();
  inorder.forEach((value, index) => inorderIndex.set(value, index));

  const nodeStates: Record<number, NodeVisualState> = { ...initialNodeStates };
  const createdOrder: number[] = [];
  const callStack: Lc106CallStackFrame[] = [];
  let postorderPointer = postorder.length - 1;
  let frameId = 1;

  const pushStep = (
    type: ExecutionStep["type"],
    node: TreeNode | null,
    value: number | undefined,
    operation: string,
    left: number,
    right: number,
    pivot: number | null,
  ) => {
    executionSteps.push({
      type,
      node,
      value,
      operation,
      callStack: callStack.map((frame) => ({ ...frame })),
      nodeStates: { ...nodeStates },
      postorderIndex: postorderPointer,
      currentRange: { left, right },
      inorderPivot: pivot,
      createdOrder: [...createdOrder],
    });
  };

  const build = (left: number, right: number, depth: number): void => {
    if (left > right) {
      pushStep(
        "base_case",
        null,
        undefined,
        `No node in inorder[${left}..${right}]`,
        left,
        right,
        null,
      );
      return;
    }

    const rootValue = postorder[postorderPointer] as number;
    const sourceNode = findNodeByValue(root, rootValue);
    const frame: Lc106CallStackFrame = {
      nodeVal: rootValue,
      depth,
      id: frameId,
      state: "executing",
    };
    frameId += 1;

    callStack.push(frame);
    nodeStates[rootValue] = "current";
    createdOrder.push(rootValue);

    const pivot = inorderIndex.get(rootValue) ?? left;
    pushStep(
      "pick_root",
      sourceNode,
      rootValue,
      `Pick ${rootValue} from postorder and split inorder at index ${pivot}`,
      left,
      right,
      pivot,
    );

    postorderPointer -= 1;

    nodeStates[rootValue] = "exploring_right";
    pushStep(
      "build_right",
      sourceNode,
      rootValue,
      `Build right subtree inorder[${pivot + 1}..${right}] first`,
      pivot + 1,
      right,
      pivot,
    );
    build(pivot + 1, right, depth + 1);

    nodeStates[rootValue] = "exploring_left";
    pushStep(
      "build_left",
      sourceNode,
      rootValue,
      `Build left subtree inorder[${left}..${pivot - 1}] next`,
      left,
      pivot - 1,
      pivot,
    );
    build(left, pivot - 1, depth + 1);

    nodeStates[rootValue] = "completed";
    frame.state = "returned";
    pushStep(
      "complete_node",
      sourceNode,
      rootValue,
      `Node ${rootValue} subtree completed`,
      left,
      right,
      pivot,
    );

    callStack.pop();
  };

  build(0, inorder.length - 1, 0);

  return { executionSteps, initialNodeStates };
}
