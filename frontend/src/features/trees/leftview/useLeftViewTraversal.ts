"use client";

import { useMemo } from "react";
import { LEFTVIEW_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generateLeftViewExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type {
  CallStackFrame,
  ExecutionStep,
  NodePosition,
  NodeVisualState,
  TreeNode,
  TreePresetKey,
} from "./types";
import type { StepProjection } from "../shared/useGenericTraversal";

interface LeftViewTraversalReturn {
  root: TreeNode | null;
  selectedPreset: TreePresetKey;
  presets: Record<TreePresetKey, { label: string; create: () => TreeNode | null }>;
  customNodePositions: Record<number, NodePosition>;
  executionSteps: ExecutionStep[];
  totalSteps: number;
  currentStep: number;
  result: number[];
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
  queueBefore: number[];
  queueAfter: number[];
  currentLevel: number;
  indexInLevel: number;
  dequeuedNode: number | null;
  enqueuedNodes: number[];
  capturedNode: number | null;
  applyTreeConfiguration: (
    nextRoot: TreeNode | null,
    nextPositions: Record<number, NodePosition>,
    preset: TreePresetKey,
    runImmediately?: boolean,
  ) => void;
}

function projectStateForStep(
  currentStep: number,
  executionSteps: ExecutionStep[],
  initialNodeStates: Record<number, NodeVisualState>,
): StepProjection {
  if (currentStep <= 0) {
    return {
      result: [],
      visitedNodes: new Set<number>(),
      currentNode: null,
      nodeStates: { ...initialNodeStates },
    };
  }

  const result: number[] = [];
  const visitedNodes = new Set<number>();

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step.type === "capture_left_view" && typeof step.value === "number") {
      result.push(step.value);
      visitedNodes.add(step.value);
    }
  }

  const previousStep = executionSteps[currentStep - 1];
  const currentNode = previousStep?.node?.val ?? null;
  const nodeStates = previousStep?.nodeStates ?? { ...initialNodeStates };

  return {
    result,
    visitedNodes,
    currentNode,
    nodeStates,
  };
}

export function useLeftViewTraversal(): LeftViewTraversalReturn {
  const config = useMemo(
    () => ({
      generateSteps: generateLeftViewExecutionSteps,
      presets: LEFTVIEW_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  const state = useGenericTraversal(config);
  const step = state.executedStep as ExecutionStep | undefined;

  return {
    ...state,
    result: state.result as number[],
    queueBefore: step?.queueBefore ?? [],
    queueAfter: step?.queueAfter ?? [],
    currentLevel: step?.level ?? 0,
    indexInLevel: step?.indexInLevel ?? 0,
    dequeuedNode: step?.dequeued ?? null,
    enqueuedNodes: step?.enqueued ?? [],
    capturedNode: step?.captured && typeof step.value === "number" ? step.value : null,
  };
}



