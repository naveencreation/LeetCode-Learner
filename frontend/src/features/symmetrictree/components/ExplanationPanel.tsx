import type { ExecutionStep } from "../types";

interface ExplanationPanelProps {
	currentStep: number;
	totalSteps: number;
	result: boolean | null;
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
	const isDone = currentStep >= totalSteps;
	const summary =
		result === null ? "Mirror check in progress." : result ? "Tree is symmetric." : "Tree is not symmetric.";

	return (
		<section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_1fr] gap-2 p-2.5">
			<div className="traversal-panel-header">
				<h2 className="traversal-panel-title">Step Explanation</h2>
			</div>

			<div className="min-h-0 space-y-2 overflow-auto rounded-[10px] border border-sky-200 bg-gradient-to-b from-cyan-50 to-sky-50 p-2">
				<h3 className="text-[13px] font-extrabold text-cyan-900">
					{isDone ? "Traversal Complete" : `Line ${currentCodeLine + 1} in mirror check`}
				</h3>
				<p className="text-[11px] leading-[1.45] text-cyan-800">{summary}</p>
				<ul className="grid gap-1 text-[11px]">
					<li className="rounded-lg border border-sky-200 bg-white/80 px-2 py-1 text-cyan-900">
						&gt; Current operation: {activeStep?.operation ?? "Waiting to start"}
					</li>
					<li className="rounded-lg border border-sky-200 bg-white/80 px-2 py-1 text-cyan-900">
						&gt; Progress: {currentStep}/{totalSteps}
					</li>
				</ul>
			</div>
		</section>
	);
}
