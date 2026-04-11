import { TreePanel as InorderTreePanel } from "@/features/inorder/components/TreePanel";

import type { ExecutionStep, NodePosition, NodeVisualState, TreeNode } from "../types";

interface TreePanelProps {
	root: TreeNode | null;
	currentOperation: string;
	nodeStates: Record<number, NodeVisualState>;
	activeStep: ExecutionStep | undefined;
	customNodePositions: Record<number, NodePosition>;
	onOpenTreeSetup: () => void;
}

export function TreePanel(props: TreePanelProps) {
	return <InorderTreePanel {...(props as any)} activeStep={props.activeStep as any} />;
}
