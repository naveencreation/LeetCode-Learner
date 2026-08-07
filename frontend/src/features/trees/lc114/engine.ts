import type { NodeVisualState, TreeNode } from "../shared/types";
import type { ExecutionStep, Lc114CallStackFrame } from "./types";

function findNodeByValue(node: TreeNode | null, value: number): TreeNode | null {
  if (!node) {
    return null;
  }
  if (node.val === value) {
    return node;
  }

  return findNodeByValue(node.left, value) ?? findNodeByValue(node.right, value);
}

function collectPreorder(node: TreeNode | null, output: number[]): void {
  if (!node) {
    return;
  }
  output.push(node.val);
  collectPreorder(node.left, output);
  collectPreorder(node.right, output);
}

function collectValues(node: TreeNode | null, output: number[]): void {
  if (!node) {
    return;
  }
  output.push(node.val);
  collectValues(node.left, output);
  collectValues(node.right, output);
}

function buildInitialNodeStates(values: number[]): Record<number, NodeVisualState> {
  return values.reduce<Record<number, NodeVisualState>>((acc, value) => {
    acc[value] = "unvisited";
    return acc;
  }, {});
}

export function deriveFlattenOrder(root: TreeNode | null): { preorder: number[]; chain: number[] } {
  const preorder: number[] = [];
  collectPreorder(root, preorder);
  return { preorder, chain: [...preorder] };
}

export function generateLc114ExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const allValues: number[] = [];
  collectValues(root, allValues);
  const { preorder } = deriveFlattenOrder(root);
  const executionSteps: ExecutionStep[] = [];
  const initialNodeStates = buildInitialNodeStates(allValues);

  if (preorder.length === 0) {
    return { executionSteps, initialNodeStates };
  }

  const nodeStates: Record<number, NodeVisualState> = { ...initialNodeStates };
  const chain: number[] = [];
  const callStack: Lc114CallStackFrame[] = [];
  let pointer = 0;
  let frameId = 1;

  const pushStep = (
    type: ExecutionStep["type"],
    node: TreeNode | null,
    value: number | undefined,
    operation: string,
  ) => {
    executionSteps.push({
      type,
      node,
      value,
      operation,
      callStack: callStack.map((frame) => ({ ...frame })),
      nodeStates: { ...nodeStates },
      preorderIndex: pointer,
      chain: [...chain],
    });
  };

  preorder.forEach((value, index) => {
    pointer = index;
    const node = findNodeByValue(root, value);
    const frame: Lc114CallStackFrame = {
      nodeVal: value,
      depth: index,
      id: frameId,
      state: "executing",
    };
    frameId += 1;

    callStack.push(frame);
    nodeStates[value] = "current";
    pushStep("pick_root", node, value, `Visit node ${value} in preorder chain`);

    if (node?.left) {
      nodeStates[value] = "exploring_left";
      pushStep("build_left", node, value, `Move left subtree of ${value} to right pointer`);
    } else {
      pushStep("base_case", node, value, `Node ${value} has no left subtree to rewire`);
    }

    if (node?.right) {
      nodeStates[value] = "exploring_right";
      pushStep("build_right", node, value, `Attach original right subtree after rewired segment`);
    }

    chain.push(value);
    nodeStates[value] = "completed";
    frame.state = "returned";
    pushStep("complete_node", node, value, `Flattened chain now ends at ${value}`);

    callStack.pop();
  });

  return { executionSteps, initialNodeStates };
}
