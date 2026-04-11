"use client";

import { useMemo } from "react";
import { SAMETREE_TREE_PRESETS, cloneTree, createSampleTrees } from "./constants";
import { generateSameTreeExecutionSteps } from "./engine";
import { getCodeLineForStep, getOperationBadge, getPhaseLabel } from "./selectors";
import { useGenericTraversal } from "../shared/useGenericTraversal";
import type {
  ExecutionStep,
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
  initialNodeStatesP: Record<string, NodeVisualState>,
  initialNodeStatesQ: Record<string, NodeVisualState>,
): StepProjection & { 
  result: boolean | null;
  nodeStatesP: Record<string, NodeVisualState>;
  nodeStatesQ: Record<string, NodeVisualState>;
  currentNodeP: number | null;
  currentNodeQ: number | null;
} {
  if (currentStep <= 0) {
    return {
      result: null,
      visitedNodes: new Set<number>(),
      currentNode: null,
      currentNodeP: null,
      currentNodeQ: null,
      nodeStates: { ...initialNodeStatesP },
      nodeStatesP: { ...initialNodeStatesP },
      nodeStatesQ: { ...initialNodeStatesQ },
    };
  }

  const visitedNodes = new Set<number>();

  for (let index = 0; index < currentStep; index += 1) {
    const step = executionSteps[index];
    if (step.valueP !== undefined && step.valueP !== null) {
      visitedNodes.add(step.valueP);
    }
    if (step.valueQ !== undefined && step.valueQ !== null) {
      visitedNodes.add(step.valueQ);
    }
  }

  const previousStep = executionSteps[currentStep - 1];
  const currentNodeP = previousStep?.valueP ?? null;
  const currentNodeQ = previousStep?.valueQ ?? null;
  const nodeStatesP = previousStep?.nodeStatesP ?? { ...initialNodeStatesP };
  const nodeStatesQ = previousStep?.nodeStatesQ ?? { ...initialNodeStatesQ };

  // Determine result from final step
  let result: boolean | null = null;
  if (executionSteps.length > 0) {
    const lastStep = executionSteps[executionSteps.length - 1];
    if (currentStep >= executionSteps.length) {
      result = lastStep.isMatch;
    }
  }

  return {
    result,
    visitedNodes,
    currentNode: currentNodeP,
    currentNodeP,
    currentNodeQ,
    nodeStates: nodeStatesP,
    nodeStatesP,
    nodeStatesQ,
  };
}

// Thin wrapper around generic hook
interface SameTreeTraversalReturn {
  root: TreeNode | null;
  rootQ: TreeNode | null;
  selectedPreset: TreePresetKey;
  presets: Record<TreePresetKey, { label: string; create: () => { p: TreeNode | null; q: TreeNode | null } }>;
  customNodePositions: Record<number, { x: number; y: number }>;
  executionSteps: ExecutionStep[];
  totalSteps: number;
  currentStep: number;
  result: boolean | null;
  visitedNodes: Set<number>;
  currentNode: number | null;
  currentNodeP: number | null;
  currentNodeQ: number | null;
  nodeStates: Record<string, NodeVisualState>;
  nodeStatesP: Record<string, NodeVisualState>;
  nodeStatesQ: Record<string, NodeVisualState>;
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
  applyTreeConfiguration: (nextRoot: TreeNode, nextPositions: Record<number, any>, preset: TreePresetKey, runImmediately?: boolean) => void;
}

export function useSameTreeTraversal(): SameTreeTraversalReturn {
  // Create a wrapper for generateSteps that adapts to the generic hook interface
  const config = useMemo(
    () => ({
      generateSteps: () => {
        const { p, q } = createSampleTrees();
        return generateSameTreeExecutionSteps(p, q);
      },
      presets: SAMETREE_TREE_PRESETS,
      cloneTree,
      createSampleTree: () => createSampleTrees().p,
      getCodeLineForStep,
      getOperationBadge,
      getPhaseLabel,
      projectStateForStep: (step: number, steps: ExecutionStep[], initial: any) => {
        return projectStateForStep(step, steps, initial.initialNodeStatesP, initial.initialNodeStatesQ);
      },
    }),
    [],
  );

  const genericResult = useGenericTraversal(config) as any;

  // Create extended result with SameTree-specific fields
  return useMemo(() => {
    // Get the current pair from presets on reset/change
    const getCurrentPair = () => {
      const preset = SAMETREE_TREE_PRESETS[genericResult.selectedPreset || "same_trees"];
      return preset ? preset.create() : createSampleTrees();
    };

    return {
      ...genericResult,
      rootQ: getCurrentPair().q,
      currentNodeP: genericResult.currentNode,
      currentNodeQ: genericResult.currentNode, // Will be updated in real implementation
      nodeStatesP: genericResult.nodeStates,
      nodeStatesQ: genericResult.nodeStates,
      result: null, // Will be computed from steps
    };
  }, [genericResult]);
}
