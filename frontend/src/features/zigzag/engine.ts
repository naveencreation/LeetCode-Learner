import type {
  ExecutionStep,
  NodeVisualState,
  TreeNode,
} from "./types";
import type { CallStackFrame } from "../shared/types";

interface QueueItem {
  node: TreeNode;
}

function cloneNodeStates(
  states: Record<number, NodeVisualState>,
): Record<number, NodeVisualState> {
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

function buildQueueFrames(
  queue: QueueItem[],
  head: number,
  activeNodeVal?: number,
): CallStackFrame[] {
  const frames: CallStackFrame[] = [];
  const remainingQueue = queue.slice(head);

  if (typeof activeNodeVal === "number") {
    frames.push({
      nodeVal: activeNodeVal,
      depth: 0,
      id: 0,
      state: "executing",
    });
  }

  remainingQueue.forEach((item, index) => {
    frames.push({
      nodeVal: item.node.val,
      depth: 0,
      id: frames.length + index + 1,
      state: "pending",
    });
  });

  return frames;
}

export function generateZigzagExecutionSteps(root: TreeNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, NodeVisualState>;
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, NodeVisualState> = {};
  const result: number[][] = [];

  if (root === null) {
    return { executionSteps, initialNodeStates: nodeStates };
  }

  initializeNodeStates(root, nodeStates);
  const initialNodeStates = cloneNodeStates(nodeStates);

  // Simulate queue-based BFS with zigzag direction
  const queue: QueueItem[] = [{ node: root }];
  let head = 0;
  let leftToRight = true;
  let depth = 0;

  // Root starts queued for dequeue
  nodeStates[root.val] = "exploring_left";

  while (head < queue.length) {
    const currentLevelSize = queue.length - head;
    const level: number[] = [];

    // Process all nodes at the current depth
    for (let i = 0; i < currentLevelSize; i++) {
      const currentItem = queue[head];
      const currentNode = currentItem.node;
      head += 1;

      // Mark as currently dequeued
      nodeStates[currentNode.val] = "current";

      // Dequeue operation
      executionSteps.push({
        type: "dequeue",
        node: currentNode,
        value: currentNode.val,
        operation: `Dequeue node ${currentNode.val}`,
        callStack: buildQueueFrames(queue, head, currentNode.val),
        nodeStates: cloneNodeStates(nodeStates),
        levelData: {
          currentLevel: level,
          direction: leftToRight ? "left-to-right" : "right-to-left",
          depth,
        },
      });

      // Mark node as processing
      nodeStates[currentNode.val] = "processing";
      level.push(currentNode.val);

      // Process level
      executionSteps.push({
        type: "process_level",
        node: currentNode,
        value: currentNode.val,
        operation: `Process node ${currentNode.val} at level ${depth}`,
        callStack: buildQueueFrames(queue, head, currentNode.val),
        nodeStates: cloneNodeStates(nodeStates),
        levelData: {
          currentLevel: level,
          direction: leftToRight ? "left-to-right" : "right-to-left",
          depth,
        },
      });

      // Queue children (always in left-then-right order)
      if (currentNode.left) {
        nodeStates[currentNode.left.val] = "exploring_left";
        queue.push({ node: currentNode.left });

        executionSteps.push({
          type: "enqueue",
          node: currentNode.left,
          value: currentNode.left.val,
          operation: `Enqueue left child ${currentNode.left.val}`,
          callStack: buildQueueFrames(queue, head, currentNode.val),
          nodeStates: cloneNodeStates(nodeStates),
          levelData: {
            currentLevel: level,
            direction: leftToRight ? "left-to-right" : "right-to-left",
            depth,
          },
        });
      }

      if (currentNode.right) {
        nodeStates[currentNode.right.val] = "exploring_right";
        queue.push({ node: currentNode.right });

        executionSteps.push({
          type: "enqueue",
          node: currentNode.right,
          value: currentNode.right.val,
          operation: `Enqueue right child ${currentNode.right.val}`,
          callStack: buildQueueFrames(queue, head, currentNode.val),
          nodeStates: cloneNodeStates(nodeStates),
          levelData: {
            currentLevel: level,
            direction: leftToRight ? "left-to-right" : "right-to-left",
            depth,
          },
        });
      }

      nodeStates[currentNode.val] = "completed";
    }

    // Check if direction flip is needed
    if (!leftToRight) {
      level.reverse();

      executionSteps.push({
        type: "flip_direction",
        node: null,
        value: undefined,
        operation: `Reverse level ${depth} for right-to-left traversal`,
        callStack: buildQueueFrames(queue, head),
        nodeStates: cloneNodeStates(nodeStates),
        levelData: {
          currentLevel: level,
          direction: leftToRight ? "left-to-right" : "right-to-left",
          depth,
        },
      });
    }

    result.push([...level]);
    leftToRight = !leftToRight;
    depth++;
  }

  // Final completion step
  executionSteps.push({
    type: "complete",
    node: null,
    value: undefined,
    operation: `Traversal complete. Result: ${JSON.stringify(result)}`,
    callStack: [],
    nodeStates: cloneNodeStates(nodeStates),
    levelData: {
      currentLevel: [],
      direction: "left-to-right",
      depth,
    },
  });

  return { executionSteps, initialNodeStates };
}
