import type { ExecutionStep } from "../types";
import { PREORDER_LINE_GUIDE, PREORDER_LINE_LABELS } from "../constants";
import { SharedExplanationPanel } from "@/features/shared/components/SharedExplanationPanel";

interface ExplanationPanelProps {
  currentStep: number;
  totalSteps: number;
  result: number[];
  activeStep: ExecutionStep | undefined;
  currentCodeLine: number;
}

export function ExplanationPanel({
  currentStep,
  totalSteps,
  result,
  activeStep,
  currentCodeLine,
}: ExplanationPanelProps) {
  return (
    <SharedExplanationPanel
      currentStep={currentStep}
      totalSteps={totalSteps}
      result={result}
      activeStep={activeStep}
      currentCodeLine={currentCodeLine}
      lineGuideMap={PREORDER_LINE_GUIDE}
      lineLabelMap={PREORDER_LINE_LABELS}
      algorithmName="preorder"
      traversalOrderText="Root -> Left -> Right"
    />
  );
}



