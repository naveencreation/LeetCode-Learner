"use client";

import { useMemo } from "react";
import { ZIGZAG_TREE_PRESETS, cloneTree, createSampleTree } from "./constants";
import { generateZigzagExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
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

// Problem-specific state projection logic
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
    if (step.type === "process_level" && typeof step.value === "number") {
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

function buildNestedResult(
  currentStep: number,
  executionSteps: ExecutionStep[],
): number[][] {
  const levels: number[][] = [];

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step.type !== "process_level" || typeof step.value !== "number") {
      continue;
    }

    const depth = step.levelData?.depth ?? 0;
    const direction = step.levelData?.direction ?? "left-to-right";

    if (!levels[depth]) {
      levels[depth] = [];
    }

    if (direction === "right-to-left") {
      levels[depth].unshift(step.value);
    } else {
      levels[depth].push(step.value);
    }
  }

  return levels.filter((level) => Array.isArray(level));
}

// Return type for zigzag traversal
interface ZigzagTraversalReturn {
  root: TreeNode | null;
  selectedPreset: TreePresetKey;
  presets: Record<TreePresetKey, { label: string; create: () => TreeNode | null }>;
  customNodePositions: Record<number, { x: number; y: number }>;
  executionSteps: ExecutionStep[];
  totalSteps: number;
  currentStep: number;
  result: number[];
  nestedResult: number[][];
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
}

export function useZigzagTraversal(): ZigzagTraversalReturn {
  // Memoize config to avoid unnecessary recalculations
  const config = useMemo(
    () => ({
      generateSteps: generateZigzagExecutionSteps,
      presets: ZIGZAG_TREE_PRESETS,
      cloneTree,
      createSampleTree,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep,
    }),
    [],
  );

  const generic = useGenericTraversal(config);

  return {
    ...(generic as ZigzagTraversalReturn),
    nestedResult: buildNestedResult(generic.currentStep, generic.executionSteps),
  };
}
