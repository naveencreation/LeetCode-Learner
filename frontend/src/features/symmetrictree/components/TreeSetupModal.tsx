import { TreeSetupModal as InorderTreeSetupModal } from "@/features/inorder/components/TreeSetupModal";

import type { NodePosition, TreeNode, TreePresetKey } from "../types";

interface TreeSetupModalProps {
	root: TreeNode | null;
	selectedPreset: TreePresetKey;
	presets: Record<TreePresetKey, { label: string; create: () => TreeNode | null }>;
	customNodePositions: Record<number, NodePosition>;
	onClose: () => void;
	onApply: (
		root: TreeNode | null,
		positions: Record<number, NodePosition>,
		preset: TreePresetKey,
	) => void;
	onApplyAndRun: (
		root: TreeNode | null,
		positions: Record<number, NodePosition>,
		preset: TreePresetKey,
	) => void;
}

export function TreeSetupModal(props: TreeSetupModalProps) {
	return <InorderTreeSetupModal {...(props as any)} />;
}
