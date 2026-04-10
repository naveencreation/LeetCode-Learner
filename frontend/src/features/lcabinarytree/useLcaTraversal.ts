"use client";

import { useMemo } from "react";
import { useState } from "react";
import {
  LCA_BINARY_TREE_PRESETS,
  cloneTree,
  createSampleTree,
} from "./constants";
import { generateLcaBinaryTreeExecutionSteps } from "./engine";
import {
  getCodeLineForStep,
  getOperationBadge,
  getPhaseLabel,
} from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type {
  ExecutionStep,
  NodePosition,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";
import type { StepProjection } from "../shared/useGenericTraversal";
import type { CallStackFrame } from "../shared/types";

function collectValues(root: TreeNode | null): number[] {
  const values: number[] = [];
  const dfs = (node: TreeNode | null) => {
    if (!node) return;
    values.push(node.val);
    dfs(node.left);
    dfs(node.right);
  };
  dfs(root);
  return values;
}

function getDefaultTargets(root: TreeNode | null): { p: number | null; q: number | null } {
  const values = collectValues(root);
  if (values.length === 0) {
    return { p: null, q: null };
  }

  const p = values.includes(5) ? 5 : values[0];
  const q = values.includes(1) ? 1 : values.find((value) => value !== p) ?? p;
  return { p, q };
}

// Problem-specific state projection logic
function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): StepProjection {
  if (currentStep <= 0) {
    return {
      result: null,
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
    };
  }

  const visitedNodes = new Set<number>();

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step && step.nodeStates) {
      Object.entries(step.nodeStates).forEach(([nodeVal, state]) => {
        if (state !== "unvisited") {
          visitedNodes.add(Number(nodeVal));
        }
      });
    }
  }

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.node?.val ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };
  const result = previousStep?.lcaValue ?? null;

  return {
    result,
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

// Return type for LCA traversal
interface LcaBinaryTreeTraversalReturn {
  root: TreeNode | null;
  selectedPreset: TreePresetKey;
  presets: Record<TreePresetKey, { label: string; create: () => TreeNode | null }>;
  customNodePositions: Record<number, NodePosition>;
  executionSteps: ExecutionStep[];
  totalSteps: number;
  currentStep: number;
  result: number | null;
  visitedNodes: Set<number>;
  currentNode: number | null;
  nodeStates: Record<number, NodeVisualState>;
  currentOperation: string;
  currentPhase: string;
  currentCodeLine: number;
  operationBadge: string;
  activeStep: ExecutionStep | undefined;
  executedStep: ExecutionStep | undefined;
  activeCallStack: CallStackFrame[];
  isAtStart: boolean;
  isAtEnd: boolean;
  controlMode: "manual" | "auto";
  setControlMode: (mode: "manual" | "auto") => void;
  isPlaying: boolean;
  autoPlaySpeedMs: number;
  setAutoPlaySpeedMs: (speedMs: number) => void;
  playTraversal: () => void;
  pauseTraversal: () => void;
  nextStep: () => void;
  previousStep: () => void;
  resetTraversal: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  applyTreeConfiguration: (
    nextRoot: TreeNode | null,
    nextPositions: Record<number, NodePosition>,
    preset: TreePresetKey,
    runImmediately?: boolean,
  ) => void;
  targetP: number | null;
  targetQ: number | null;
  setTargetNodes: (p: number | null, q: number | null) => void;
}

export function useLcaTraversal(): LcaBinaryTreeTraversalReturn {
  const initialTargets = useMemo(() => getDefaultTargets(createSampleTree()), []);
  const [targetP, setTargetP] = useState<number | null>(initialTargets.p);
  const [targetQ, setTargetQ] = useState<number | null>(initialTargets.q);

  const config = useMemo(
    () => ({
      generateSteps: (root: TreeNode | null) =>
        generateLcaBinaryTreeExecutionSteps(root, { p: targetP, q: targetQ }),
      presets: LCA_BINARY_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [targetP, targetQ],
  );

  const base = useGenericTraversal(config) as LcaBinaryTreeTraversalReturn;

  return {
    ...base,
    targetP,
    targetQ,
    setTargetNodes: (p, q) => {
      setTargetP(p);
      setTargetQ(q);
    },
  };
}
