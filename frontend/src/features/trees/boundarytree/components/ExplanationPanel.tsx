import type { ExecutionStep } from "../types";
import { BOUNDARY_LINE_GUIDE, BOUNDARY_LINE_LABELS } from "../constants";

interface ExplanationPanelProps {
	currentStep: number;
	totalSteps: number;
	result: number[];
	activeStep: ExecutionStep | undefined;
	currentCodeLine: number;
}

function getExplanation(
	step: ExecutionStep | undefined,
	currentStep: number,
	totalSteps: number,
	result: number[],
	currentCodeLine: number,
) {
	const lineGuide = BOUNDARY_LINE_GUIDE[currentCodeLine];
	const lineLabel = BOUNDARY_LINE_LABELS[currentCodeLine] ?? "Boundary Context";

	if (!step && currentStep === 0) {
		return {
			title: "Ready to Start",
			description:
				'Click "Next Step" to begin boundary traversal in anti-clockwise order.',
			details: [
				"Order: root -> left boundary -> leaves -> reversed right boundary.",
				"Watch phase and result update together.",
			],
		};
	}

	if (currentStep >= totalSteps) {
		return {
			title: "Boundary Complete",
			description: `All steps finished. Final boundary is [${result.join(", ")}].`,
			details: [
				`Total execution steps: ${totalSteps}`,
				"Use Previous to replay each phase.",
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
				`Current boundary snapshot: [${result.join(", ")}]`,
			],
		};
	}

	switch (step?.type) {
		case "add_root":
			return {
				title: "Add Root",
				description: "Root is included in boundary when it is not a leaf.",
				details: ["Next phase moves to left boundary collection."],
			};
		case "collect_left_boundary":
		case "visit_left_node":
			return {
				title: "Collect Left Boundary",
				description: "Traverse down the left edge, excluding leaves.",
				details: ["When left child is missing, traversal may use right child."],
			};
		case "collect_leaves":
		case "visit_leaf":
			return {
				title: "Collect Leaves",
				description: "Leaves are collected left-to-right to form the bottom boundary.",
				details: ["Leaf nodes are always included exactly once."],
			};
		case "collect_right_boundary":
		case "visit_right_node":
		case "reverse_right":
			return {
				title: "Collect Right Boundary",
				description: "Right boundary nodes are collected and reversed for anti-clockwise order.",
				details: ["This keeps the final output in correct boundary sequence."],
			};
		case "complete":
			return {
				title: "Traversal Done",
				description: "Boundary traversal has produced the final answer.",
				details: ["You can step backwards to inspect each phase."],
			};
		default:
			return {
				title: "Step Insight",
				description: "Boundary traversal state updated.",
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
	const explanation = getExplanation(
		activeStep,
		currentStep,
		totalSteps,
		result,
		currentCodeLine,
	);

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
						<span className="h-3 w-3 rounded-full bg-sky-400" /> Left
					</span>
				</div>
				<div className="rounded-lg px-1 py-0.5">
					<span className="inline-flex items-center gap-1.5 font-bold">
						<span className="h-3 w-3 rounded-full bg-amber-400" /> Current
					</span>
				</div>
				<div className="rounded-lg px-1 py-0.5">
					<span className="inline-flex items-center gap-1.5 font-bold">
						<span className="h-3 w-3 rounded-full bg-violet-400" /> Right
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
