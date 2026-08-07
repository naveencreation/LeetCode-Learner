import type {
  ExecutionStep,
  NodeVisualState,
  TreeNode,
} from "./types";
import type { CallStackFrame } from "../shared/types";

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

export function generateLcaBinaryTreeExecutionSteps(
  root: TreeNode | null,
  targets?: { p: number | null; q: number | null },
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
      operation: "Empty tree: no LCA",
      callStack: [],
      nodeStates: {},
      lcaValue: null,
      returnValue: null,
    });
    return { executionSteps, initialNodeStates: {} };
  }

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  const stack: InternalFrame[] = [];
  let frameId = 0;

  const values: number[] = [];
  const collectValues = (node: TreeNode | null) => {
    if (!node) return;
    values.push(node.val);
    collectValues(node.left);
    collectValues(node.right);
  };
  collectValues(root);

  const fallbackP = values.includes(5) ? 5 : values[0] ?? 0;
  const fallbackQ = values.includes(1)
    ? 1
    : values.find((value) => value !== fallbackP) ?? fallbackP;

  const pVal =
    targets?.p !== null && targets?.p !== undefined && values.includes(targets.p)
      ? targets.p
      : fallbackP;
  const qVal =
    targets?.q !== null && targets?.q !== undefined && values.includes(targets.q)
      ? targets.q
      : fallbackQ;

  let resolvedLcaValue: number | null = null;

  function check(node: TreeNode | null, depth: number): number {
    if (node === null) {
      return 0;
    }

    const currentId = frameId++;
    const frame: InternalFrame = {
      nodeVal: node.val,
      depth,
      id: currentId,
    };

    stack.push(frame);
    nodeStates[node.val] = "current";

    executionSteps.push({
      type: "enter_function",
      node,
      value: node.val,
      operation: `Enter lca(${node.val}) for targets p=${pVal}, q=${qVal}`,
      callStack: getCallStackSnapshot(stack, "executing", currentId),
      nodeStates: cloneNodeStates(nodeStates),
      lcaValue: resolvedLcaValue,
      returnValue: null,
    });

    if (node.val === pVal || node.val === qVal) {
      executionSteps.push({
        type: "found_target",
        node,
        value: node.val,
        operation: `Found target node ${node.val}, return upward`,
        callStack: getCallStackSnapshot(stack, "exiting", currentId),
        nodeStates: cloneNodeStates(nodeStates),
        lcaValue: resolvedLcaValue,
        returnValue: node.val,
      });

      nodeStates[node.val] = "completed";
      stack.pop();
      return node.val;
    }

    nodeStates[node.val] = "exploring_left";
    executionSteps.push({
      type: "recurse_left",
      node,
      value: node.val,
      operation: `Recurse left from node ${node.val}`,
      callStack: getCallStackSnapshot(stack, "executing", currentId),
      nodeStates: cloneNodeStates(nodeStates),
      lcaValue: resolvedLcaValue,
      returnValue: null,
    });

    const left = check(node.left, depth + 1);

    nodeStates[node.val] = "exploring_right";
    executionSteps.push({
      type: "recurse_right",
      node,
      value: node.val,
      operation: `Recurse right from node ${node.val}`,
      callStack: getCallStackSnapshot(stack, "executing", currentId),
      nodeStates: cloneNodeStates(nodeStates),
      lcaValue: resolvedLcaValue,
      returnValue: null,
    });

    const right = check(node.right, depth + 1);

    nodeStates[node.val] = "processing";
    executionSteps.push({
      type: "check_split",
      node,
      value: node.val,
      operation: `Check split at ${node.val}: left=${left || "null"}, right=${right || "null"}`,
      callStack: getCallStackSnapshot(stack, "executing", currentId),
      nodeStates: cloneNodeStates(nodeStates),
      lcaValue: resolvedLcaValue,
      returnValue: null,
    });

    if (left && right) {
      if (resolvedLcaValue === null) {
        resolvedLcaValue = node.val;
      }
      nodeStates[node.val] = "current";
      executionSteps.push({
        type: "return_lca",
        node,
        value: node.val,
        operation: `Split found at ${node.val}; this is LCA`,
        callStack: getCallStackSnapshot(stack, "exiting", currentId),
        nodeStates: cloneNodeStates(nodeStates),
        lcaValue: resolvedLcaValue,
        returnValue: node.val,
      });

      nodeStates[node.val] = "completed";
      stack.pop();
      return node.val;
    }

    const candidate = left || right || 0;
    nodeStates[node.val] = "completed";

    executionSteps.push({
      type: "propagate",
      node,
      value: candidate || undefined,
      operation: candidate
        ? `Propagate ${candidate} up from node ${node.val}`
        : `No target under node ${node.val}, return null`,
      callStack: getCallStackSnapshot(stack, "exiting", currentId),
      nodeStates: cloneNodeStates(nodeStates),
      lcaValue: resolvedLcaValue,
      returnValue: candidate || null,
    });

    stack.pop();
    return candidate;
  }

  const result = check(root, 0);
  const finalLca = resolvedLcaValue ?? (result || null);

  executionSteps.push({
    type: "exit_function",
    node: root,
    value: finalLca ?? undefined,
    operation: finalLca
      ? `LCA is node ${finalLca}`
      : "LCA not found for selected targets",
    callStack: [],
    nodeStates: cloneNodeStates(nodeStates),
    lcaValue: finalLca,
    returnValue: finalLca,
  });

  return { executionSteps, initialNodeStates };
}
