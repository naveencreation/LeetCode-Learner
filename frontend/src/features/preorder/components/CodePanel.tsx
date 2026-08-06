import { SharedCodePanel } from "@/features/shared/components/SharedCodePanel";
import { PREORDER_CODE_LINES, PREORDER_LINE_LABELS } from "../constants";

interface CodePanelProps {
  currentCodeLine: number;
  executionLineNumbers: number[];
}

export function CodePanel({ currentCodeLine, executionLineNumbers }: CodePanelProps) {
  return (
    <SharedCodePanel
      currentCodeLine={currentCodeLine}
      executionLineNumbers={executionLineNumbers}
      codeLines={PREORDER_CODE_LINES}
      lineLabels={PREORDER_LINE_LABELS}
    />
  );
}



