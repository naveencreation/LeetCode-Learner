import { useState } from "react";

import { cloneTree } from "../constants";
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

export function TreeSetupModal({
	selectedPreset,
	presets,
	onClose,
	onApply,
	onApplyAndRun,
}: TreeSetupModalProps) {
	const [draftPreset, setDraftPreset] = useState<TreePresetKey>(selectedPreset);

	const handleApply = () => {
		const nextRoot = presets[draftPreset].create();
		onApply(cloneTree(nextRoot), {}, draftPreset);
		onClose();
	};

	const handleApplyAndRun = () => {
		const nextRoot = presets[draftPreset].create();
		onApplyAndRun(cloneTree(nextRoot), {}, draftPreset);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-xl">
				<div className="border-b border-slate-200 px-6 py-4">
					<h2 className="text-lg font-bold text-slate-900">Select Tree Configuration</h2>
					<p className="mt-1 text-sm text-slate-600">Choose a preset tree for boundary traversal</p>
				</div>

				<div className="max-h-64 overflow-y-auto px-6 py-4">
					<div className="space-y-2">
						{Object.entries(presets).map(([key, preset]) => (
							<label
								key={key}
								className="flex cursor-pointer items-center rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50"
							>
								<input
									type="radio"
									name="boundary-preset"
									value={key}
									checked={draftPreset === key}
									onChange={(event) => setDraftPreset(event.target.value as TreePresetKey)}
									className="h-4 w-4 border-slate-300 text-teal-600"
								/>
								<span className="ml-3 font-medium text-slate-900">{preset.label}</span>
							</label>
						))}
					</div>
				</div>

				<div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleApply}
						className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 font-medium text-slate-900 transition hover:bg-slate-200"
					>
						Apply
					</button>
					<button
						type="button"
						onClick={handleApplyAndRun}
						className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition hover:bg-teal-700"
					>
						Apply & Run
					</button>
				</div>
			</div>
		</div>
	);
}
