// Shared types used across all linked list problems

export interface ListNode {
  val: number;
  next: ListNode | null;
}

export type LinkedListNodeState =
  | "unvisited"
  | "prev"
  | "current"
  | "next_saved"
  | "reversed"
  | "completed";

export type LinkedListPresetKey =
  | "short"
  | "medium"
  | "long"
  | "single"
  | "two_nodes";

export interface LinkedListPreset {
  label: string;
  create: () => ListNode | null;
}

// ── Helpers ──

export function createLinkedList(values: number[]): ListNode | null {
  if (values.length === 0) return null;
  const head: ListNode = { val: values[0], next: null };
  let current = head;
  for (let i = 1; i < values.length; i++) {
    const node: ListNode = { val: values[i], next: null };
    current.next = node;
    current = node;
  }
  return head;
}

export function linkedListToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

export function cloneLinkedList(head: ListNode | null): ListNode | null {
  if (!head) return null;
  const newHead: ListNode = { val: head.val, next: null };
  let src = head.next;
  let dst = newHead;
  while (src) {
    const node: ListNode = { val: src.val, next: null };
    dst.next = node;
    dst = node;
    src = src.next;
  }
  return newHead;
}

export const linkedListPresets: Record<LinkedListPresetKey, LinkedListPreset> = {
  short: {
    label: "3 Nodes",
    create: () => createLinkedList([1, 2, 3]),
  },
  medium: {
    label: "5 Nodes",
    create: () => createLinkedList([1, 2, 3, 4, 5]),
  },
  long: {
    label: "7 Nodes",
    create: () => createLinkedList([1, 2, 3, 4, 5, 6, 7]),
  },
  single: {
    label: "1 Node",
    create: () => createLinkedList([1]),
  },
  two_nodes: {
    label: "2 Nodes",
    create: () => createLinkedList([1, 2]),
  },
};
