import type {
  TreeNode,
  ZigzagTreeExecutionStep,
  ZigzagTreeOperationType,
  ZigzagTreeCallStackFrame,
} from "./types";
import type { NodeVisualState } from "@/features/shared/types";

interface EngineContext {
  steps: ZigzagTreeExecutionStep[];
  nodeStates: Record<number, NodeVisualState>;
  callStack: ZigzagTreeCallStackFrame[];
  queue: TreeNode[];
  finalResult: number[][];
}

function pushStep(
  ctx: EngineContext,
  type: ZigzagTreeOperationType,
  lineNumber: number,
  node: TreeNode | null,
  explanation: string,
  extra: Partial<ZigzagTreeExecutionStep> = {}
) {
  if (node) {
    if (type === "process_node") {
      ctx.nodeStates[node.val] = "current";
    } else if (type === "add_level_result") {
      ctx.nodeStates[node.val] = "completed";
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
    queueState: ctx.queue.map((n) => n.val),
    explanation,
    currentLevel: extra.currentLevel ?? 0,
    leftToRight: extra.leftToRight ?? true,
    levelResult: extra.levelResult ?? [],
    finalResult: [...ctx.finalResult],
    ...extra,
  });
}

export function generateZigzagTreeSteps(root: TreeNode | null): {
  executionSteps: ZigzagTreeExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const ctx: EngineContext = {
    steps: [],
    nodeStates: {},
    callStack: [],
    queue: [],
    finalResult: [],
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
  pushStep(ctx, "enter_function", 2, root, root ? "Starting zigzag traversal..." : "Checking empty tree", {
    currentLevel: 0,
    leftToRight: true,
  });

  if (!root) {
    pushStep(ctx, "check_null", 3, null, "Empty tree - returning empty result", { currentLevel: 0, leftToRight: true });
    pushStep(ctx, "exit_function", 27, null, "Algorithm complete", { currentLevel: 0, leftToRight: true });
    return { executionSteps: ctx.steps, initialNodeStates };
  }

  pushStep(ctx, "check_null", 3, root, "Root exists - initializing queue", { currentLevel: 0, leftToRight: true });

  // Init queue
  ctx.queue.push(root);
  pushStep(ctx, "init_queue", 6, root, "Queue initialized with root", { currentLevel: 0, leftToRight: true });

  let currentLevel = 0;
  let leftToRight = true;

  // Add initial frame
  const frame: ZigzagTreeCallStackFrame = {
    functionName: "zigzagLevelOrder",
    nodeValue: root.val,
    phase: "start",
    level: 0,
  };
  ctx.callStack.push(frame);

  while (ctx.queue.length > 0) {
    // Start new level
    pushStep(ctx, "start_level", 9, null, `Starting level ${currentLevel} (${leftToRight ? "L→R" : "R→L"})`, {
      currentLevel,
      leftToRight,
    });

    const levelSize = ctx.queue.length;
    pushStep(ctx, "get_level_size", 10, null, `Level ${currentLevel} has ${levelSize} nodes`, {
      currentLevel,
      leftToRight,
    });

    const levelNodes: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = ctx.queue.shift()!;
      
      // Process node
      pushStep(ctx, "process_node", 14, node, `Processing node ${node.val} at level ${currentLevel}`, {
        currentLevel,
        leftToRight,
        levelResult: [...levelNodes],
      });
      levelNodes.push(node.val);

      // Add children
      if (node.left) {
        ctx.queue.push(node.left);
        pushStep(ctx, "add_left_child", 17, node, `Added left child ${node.left.val} to queue`, {
          currentLevel,
          leftToRight,
          levelResult: [...levelNodes],
        });
      }
      if (node.right) {
        ctx.queue.push(node.right);
        pushStep(ctx, "add_right_child", 18, node, `Added right child ${node.right.val} to queue`, {
          currentLevel,
          leftToRight,
          levelResult: [...levelNodes],
        });
      }
    }

    // Reverse if going right to left
    if (!leftToRight) {
      levelNodes.reverse();
      pushStep(ctx, "reverse_level", 21, null, `Reversed level ${currentLevel} for R→L order: [${levelNodes.join(", ")}]`, {
        currentLevel,
        leftToRight,
        levelResult: [...levelNodes],
      });
    }

    // Add to final result
    ctx.finalResult.push([...levelNodes]);
    pushStep(ctx, "add_level_result", 24, null, `Level ${currentLevel} complete: [${levelNodes.join(", ")}]`, {
      currentLevel,
      leftToRight,
      levelResult: [...levelNodes],
    });

    // Toggle direction
    leftToRight = !leftToRight;
    pushStep(ctx, "toggle_direction", 25, null, `Toggled direction. Next level: ${leftToRight ? "L→R" : "R→L"}`, {
      currentLevel,
      leftToRight: !leftToRight,
      levelResult: [],
    });

    currentLevel++;
  }

  ctx.callStack.pop();

  // Exit step
  pushStep(ctx, "exit_function", 27, null, `Traversal complete! Result: ${JSON.stringify(ctx.finalResult)}`, {
    currentLevel,
    leftToRight,
    finalResult: ctx.finalResult,
  });

  pushStep(ctx, "complete", 28, null, "Algorithm finished", {
    currentLevel,
    leftToRight,
    finalResult: ctx.finalResult,
  });

  return { executionSteps: ctx.steps, initialNodeStates };
}
