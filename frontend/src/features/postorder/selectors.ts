import { OPERATION_TO_LINE_MAP } from "./constants";
import type { ExecutionStep } from "./types";
import {
  getCodeLineForStep as genericGetCodeLineForStep,
  getOperationBadge,
  getPhaseLabel,
} from "../shared/tree-selectors";

export { getPhaseLabel, getOperationBadge };

export function getCodeLineForStep(step: ExecutionStep | undefined): number {
  return genericGetCodeLineForStep(step, OPERATION_TO_LINE_MAP);
}

