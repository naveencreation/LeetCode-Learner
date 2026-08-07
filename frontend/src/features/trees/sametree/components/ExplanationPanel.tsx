import { SAMETREE_LINE_GUIDE, SAMETREE_LINE_LABELS } from "../constants";
import type { ExecutionStep } from "../types";

interface ExplanationPanelProps {
	currentStep: number;
	totalSteps: number;
	result: boolean | null;
	activeStep: ExecutionStep | undefined;
	currentCodeLine: number;
}

function getExplanation(
	step: ExecutionStep | undefined,
	currentStep: number,
	totalSteps: number,
	result: boolean | null,
	currentCodeLine: number,
) {
	const lineGuide = SAMETREE_LINE_GUIDE[currentCodeLine];
	const lineLabel = SAMETREE_LINE_LABELS[currentCodeLine] ?? "Comparison Context";

	if (!step && currentStep === 0) {
		return {
			title: "Ready To Compare Trees",
			description:
				'Click "Next Step" to start pairwise recursion. We compare corresponding nodes in p and q together.',
			details: [
				"Both-null pair means this branch matches.",
				"One-null pair means structure mismatch.",
				"Non-null pair must match values before recursing.",
			],
		};
	}

	if (currentStep >= totalSteps) {
		return {
			title: "Comparison Complete",
			description: result === true ? "Both trees are identical." : "Trees are not identical.",
			details: [
				`Total execution steps: ${totalSteps}`,
				"Replay with Previous to inspect where mismatch happened.",
			],
		};
	}

	if (lineGuide) {
		return {
			title: `Line ${currentCodeLine + 1}: ${lineLabel}`,
			description: lineGuide.meaning,
			details: [
				`Why this line matters: ${lineGuide.why}`,
				`What happens next: ${lineGuide.next}`,
			],
		};
	}

	switch (step?.type) {
		case "compare_values":
			return {
				title: "Compare Current Node Values",
				description: `Checking p=${step.valueP} and q=${step.valueQ}.`,
				details: ["Equal values allow recursion to continue."],
			};
		case "mismatch_found":
			return {
				title: "Mismatch Detected",
				description: "Comparison failed at this pair of nodes.",
				details: ["Returns False immediately (short-circuit)."],
			};
		case "match_found":
			return {
				title: "Pair Matches",
				description: "Current node pair and sub-branches are consistent.",
				details: ["Control returns to previous recursive frame."],
			};
		default:
			return {
				title: "Step Insight",
				description: "Comparison state updated.",
				details: [],
			};
	}
}

export function ExplanationPanel({
	currentStep,
	totalSteps,
	result,
	activeStep,
	currentCodeLine,
}: ExplanationPanelProps) {
	const explanation = getExplanation(activeStep, currentStep, totalSteps, result, currentCodeLine);

	return (
		<section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr_auto] gap-2 p-2.5">
			<div className="traversal-panel-header">
				<h2 className="traversal-panel-title">Step Explanation</h2>
			</div>

			<div className="min-h-0 space-y-2 overflow-auto rounded-[10px] border border-sky-200 bg-gradient-to-b from-cyan-50 to-sky-50 p-2">
				<h3 className="text-[13px] font-extrabold text-cyan-900">{explanation.title}</h3>
				<p className="text-[11px] leading-[1.45] text-cyan-800">{explanation.description}</p>
				<ul className="grid gap-1 text-[11px]">
					{explanation.details.map((detail) => (
						<li key={detail} className="rounded-lg border border-sky-200 bg-white/80 px-2 py-1 text-cyan-900">
							&gt; {detail}
						</li>
					))}
				</ul>
			</div>

			<div className="grid grid-cols-2 gap-1.5 rounded-[10px] border border-slate-200 bg-slate-50 p-2 text-[10px] text-slate-700">
				<div className="rounded-lg px-1 py-0.5">
					<span className="inline-flex items-center gap-1.5 font-bold">
						<span className="h-3 w-3 rounded-full bg-slate-300" /> Unvisited
					</span>
				</div>
				<div className="rounded-lg px-1 py-0.5">
					<span className="inline-flex items-center gap-1.5 font-bold">
						<span className="h-3 w-3 rounded-full bg-amber-400" /> Current Pair
					</span>
				</div>
				<div className="rounded-lg px-1 py-0.5">
					<span className="inline-flex items-center gap-1.5 font-bold">
						<span className="h-3 w-3 rounded-full bg-sky-400" /> Exploring Left
					</span>
				</div>
				<div className="rounded-lg px-1 py-0.5">
					<span className="inline-flex items-center gap-1.5 font-bold">
						<span className="h-3 w-3 rounded-full bg-violet-400" /> Exploring Right
					</span>
				</div>
				<div className="col-span-2 rounded-lg px-1 py-0.5">
					<span className="inline-flex items-center gap-1.5 font-bold">
						<span className="h-3 w-3 rounded-full bg-emerald-500" /> Done
					</span>
				</div>
			</div>
		</section>
	);
}
