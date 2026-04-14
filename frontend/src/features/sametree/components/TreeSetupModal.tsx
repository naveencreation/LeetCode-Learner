import { useState } from "react";

import { cloneTree } from "../constants";
import type { NodePosition, TreeNode, TreePresetKey } from "../types";

interface TreeSetupModalProps {
	rootP: TreeNode | null;
	rootQ: TreeNode | null;
	selectedPreset: TreePresetKey;
	presets: Record<TreePresetKey, { label: string; create: () => { p: TreeNode | null; q: TreeNode | null } }>;
	customNodePositionsP: Record<number, NodePosition>;
	customNodePositionsQ: Record<number, NodePosition>;
	onClose: () => void;
	onApply: (
		nextP: TreeNode | null,
		nextQ: TreeNode | null,
		nextPositionsP: Record<number, NodePosition>,
		nextPositionsQ: Record<number, NodePosition>,
		preset: TreePresetKey,
	) => void;
	onApplyAndRun: (
		nextP: TreeNode | null,
		nextQ: TreeNode | null,
		nextPositionsP: Record<number, NodePosition>,
		nextPositionsQ: Record<number, NodePosition>,
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
		const { p, q } = presets[draftPreset].create();
		onApply(cloneTree(p), cloneTree(q), {}, {}, draftPreset);
		onClose();
	};

	const handleApplyAndRun = () => {
		const { p, q } = presets[draftPreset].create();
		onApplyAndRun(cloneTree(p), cloneTree(q), {}, {}, draftPreset);
		onClose();
	};

	return (
		<div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-[2px]">
			<div className="animate-slide-up w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
				<div className="border-b border-slate-200 px-6 py-5">
					<h2 className="text-lg font-extrabold text-slate-900">Select Paired Tree Scenario</h2>
					<p className="mt-1 text-xs font-semibold text-slate-600">
						Choose the p and q preset pair for Same Tree comparison
					</p>
				</div>

				<div className="max-h-72 overflow-y-auto px-6 py-5">
					<div className="space-y-2.5">
						{Object.entries(presets).map(([key, preset]) => (
							<label
								key={key}
								className="cursor-pointer flex items-center rounded-xl border border-slate-200 bg-white p-3 transition hover:bg-slate-50"
							>
								<input
									type="radio"
									name="preset"
									value={key}
									checked={draftPreset === key}
									onChange={(e) => setDraftPreset(e.target.value as TreePresetKey)}
									className="h-4 w-4 border-slate-300 text-teal-600"
								/>
								<span className="ml-3 text-sm font-semibold text-slate-900">{preset.label}</span>
							</label>
						))}
					</div>
				</div>

				<div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 px-6 py-4">
					<button
						onClick={onClose}
						className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
					>
						Cancel
					</button>
					<button
						onClick={handleApply}
						className="rounded-md border border-teal-300 bg-white px-3 py-1.5 text-sm font-extrabold text-teal-700 transition hover:bg-teal-50"
					>
						Apply
					</button>
					<button
						onClick={handleApplyAndRun}
						className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-extrabold text-white transition hover:bg-teal-700"
					>
						Apply & Run
					</button>
				</div>
			</div>
		</div>
	);
}
