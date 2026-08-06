import { SharedCodePanel } from "@/features/shared/components/SharedCodePanel";
import { INORDER_CODE_LINES, INORDER_LINE_LABELS } from "../constants";

interface CodePanelProps {
  currentCodeLine: number;
  executionLineNumbers: number[];
}

export function CodePanel({ currentCodeLine, executionLineNumbers }: CodePanelProps) {
  return (
    <SharedCodePanel
      currentCodeLine={currentCodeLine}
      executionLineNumbers={executionLineNumbers}
      codeLines={INORDER_CODE_LINES}
      lineLabels={INORDER_LINE_LABELS}
    />
  );
}

