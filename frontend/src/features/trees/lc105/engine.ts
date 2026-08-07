import type { NodeVisualState, TreeNode } from "../shared/types";
import type { ExecutionStep, Lc105CallStackFrame } from "./types";

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

function collectPreorder(node: TreeNode | null, output: number[]): void {
  if (!node) {
    return;
  }
  output.push(node.val);
  collectPreorder(node.left, output);
  collectPreorder(node.right, output);
}

function buildInitialNodeStates(values: number[]): Record<number, NodeVisualState> {
  return values.reduce<Record<number, NodeVisualState>>((acc, value) => {
    acc[value] = "unvisited";
    return acc;
  }, {});
}

export function deriveTraversals(root: TreeNode | null): { preorder: number[]; inorder: number[] } {
  const preorder: number[] = [];
  const inorder: number[] = [];

  collectPreorder(root, preorder);
  collectInorder(root, inorder);

  return { preorder, inorder };
}

export function generateLc105ExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const { preorder, inorder } = deriveTraversals(root);
  const executionSteps: ExecutionStep[] = [];
  const initialNodeStates = buildInitialNodeStates(inorder);

  if (preorder.length === 0 || inorder.length === 0) {
    return { executionSteps, initialNodeStates };
  }

  const inorderIndex = new Map<number, number>();
  inorder.forEach((value, index) => inorderIndex.set(value, index));

  const nodeStates: Record<number, NodeVisualState> = { ...initialNodeStates };
  const createdOrder: number[] = [];
  const callStack: Lc105CallStackFrame[] = [];
  let preorderPointer = 0;
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
      preorderIndex: preorderPointer,
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

    const rootValue = preorder[preorderPointer] as number;
    const sourceNode = findNodeByValue(root, rootValue);
    const frame: Lc105CallStackFrame = {
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
      `Pick ${rootValue} from preorder and split inorder at index ${pivot}`,
      left,
      right,
      pivot,
    );

    preorderPointer += 1;

    nodeStates[rootValue] = "exploring_left";
    pushStep(
      "build_left",
      sourceNode,
      rootValue,
      `Build left subtree inorder[${left}..${pivot - 1}]`,
      left,
      pivot - 1,
      pivot,
    );
    build(left, pivot - 1, depth + 1);

    nodeStates[rootValue] = "exploring_right";
    pushStep(
      "build_right",
      sourceNode,
      rootValue,
      `Build right subtree inorder[${pivot + 1}..${right}]`,
      pivot + 1,
      right,
      pivot,
    );
    build(pivot + 1, right, depth + 1);

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
