import type { ListNode, LinkedListNodeState } from "../shared/linked-list-types";
import type { ExecutionStep, PointerSnapshot } from "./types";

function cloneStates(s: Record<number, LinkedListNodeState>): Record<number, LinkedListNodeState> {
  return { ...s };
}

function cloneLinks(l: Record<number, number | null>): Record<number, number | null> {
  return { ...l };
}

function snap(p: PointerSnapshot): PointerSnapshot {
  return { ...p };
}

export function generateReverseSteps(head: ListNode | null): {
  executionSteps: ExecutionStep[];
  initialNodeStates: Record<number, LinkedListNodeState>;
  originalValues: number[];
} {
  const executionSteps: ExecutionStep[] = [];
  const nodeStates: Record<number, LinkedListNodeState> = {};
  const links: Record<number, number | null> = {};
  const originalValues: number[] = [];

  // Build initial state
  let node = head;
  while (node) {
    originalValues.push(node.val);
    nodeStates[node.val] = "unvisited";
    links[node.val] = node.next?.val ?? null;
    node = node.next;
  }

  const initialNodeStates = cloneStates(nodeStates);

  if (!head) {
    return { executionSteps, initialNodeStates, originalValues };
  }

  const pointers: PointerSnapshot = { prev: null, curr: head.val, nextSaved: null };

  // Step 0: initialization
  nodeStates[head.val] = "current";
  executionSteps.push({
    type: "init",
    operation: `Initialize: prev = None, curr = ${head.val}`,
    nodeStates: cloneStates(nodeStates),
    pointers: snap(pointers),
    links: cloneLinks(links),
  });

  // Walk through the list
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;

  while (curr) {
    const nextNode: ListNode | null = curr.next;

    // 1) save_next
    pointers.nextSaved = nextNode?.val ?? null;
    if (nextNode) {
      nodeStates[nextNode.val] = "next_saved";
    }
    executionSteps.push({
      type: "save_next",
      operation: `Save next: next_node = ${nextNode ? nextNode.val : "None"}`,
      nodeStates: cloneStates(nodeStates),
      pointers: snap(pointers),
      links: cloneLinks(links),
    });

    // 2) reverse_link
    links[curr.val] = prev?.val ?? null;
    nodeStates[curr.val] = "reversed";
    executionSteps.push({
      type: "reverse_link",
      operation: `Reverse link: ${curr.val}.next = ${prev ? prev.val : "None"}`,
      nodeStates: cloneStates(nodeStates),
      pointers: snap(pointers),
      links: cloneLinks(links),
    });

    // 3) move_prev
    pointers.prev = curr.val;
    nodeStates[curr.val] = "completed";
    executionSteps.push({
      type: "move_prev",
      operation: `Move prev: prev = ${curr.val}`,
      nodeStates: cloneStates(nodeStates),
      pointers: snap(pointers),
      links: cloneLinks(links),
    });

    // 4) move_curr
    prev = curr;
    curr = nextNode;
    pointers.curr = curr?.val ?? null;
    pointers.nextSaved = null;

    if (curr) {
      nodeStates[curr.val] = "current";
    }

    // Clean up next_saved highlight from old next if it wasn't already reversed
    for (const key of Object.keys(nodeStates)) {
      if (nodeStates[Number(key)] === "next_saved") {
        nodeStates[Number(key)] = "unvisited";
      }
    }

    executionSteps.push({
      type: "move_curr",
      operation: `Move curr: curr = ${curr ? curr.val : "None"}`,
      nodeStates: cloneStates(nodeStates),
      pointers: snap(pointers),
      links: cloneLinks(links),
    });
  }

  // Final: complete
  executionSteps.push({
    type: "complete",
    operation: `Complete: return prev = ${prev?.val ?? "None"} (new head)`,
    nodeStates: cloneStates(nodeStates),
    pointers: snap(pointers),
    links: cloneLinks(links),
  });

  return { executionSteps, initialNodeStates, originalValues };
}
